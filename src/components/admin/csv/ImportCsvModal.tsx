import { useEffect, useMemo, useRef, useState } from "react";
import Papa from "papaparse";
import {
  X,
  Upload,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  Download,
  FileText,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import {
  autoDetectColumn,
  cleanCpf,
  downloadTemplate,
  formatCpf,
  normalizePhone,
  parseValor,
  validateCpf,
  validateEmail,
  type CampoInvestidor,
} from "@/lib/csv";
import {
  useInvestors,
  type Investidor,
  type StatusInvestidor,
} from "@/store/investors";
import { gerarCredenciaisEmLote } from "@/lib/api/usuarios";
import { cn } from "@/lib/utils";

type Step = "upload" | "mapping" | "validacao" | "sucesso";

interface ParsedCsv {
  headers: string[];
  rows: Record<string, string>[];
  fileName: string;
}

type Mapping = Partial<Record<CampoInvestidor, string>>;

interface LinhaValidacao {
  linha: number;
  raw: Record<string, string>;
  cpf: string;
  nome: string;
  email: string;
  whatsapp: string;
  valor: number;
  erros: string[];
  duplicado: boolean;
}

interface ResumoImport {
  totalLido: number;
  novos: number;
  duplicados: number;
  invalidos: number;
  credenciaisCriadas?: number;
}

const CAMPOS: { key: CampoInvestidor; label: string; obrigatorio: boolean }[] = [
  { key: "cpf", label: "CPF", obrigatorio: true },
  { key: "nome", label: "Nome", obrigatorio: true },
  { key: "email", label: "E-mail", obrigatorio: true },
  { key: "whatsapp", label: "WhatsApp", obrigatorio: false },
  { key: "valorInvestido", label: "Valor investido", obrigatorio: false },
];

const STEPS_LABEL: Record<Step, string> = {
  upload: "Upload",
  mapping: "Mapeamento",
  validacao: "Validação",
  sucesso: "Sucesso",
};

export function ImportCsvModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { state: invState, dispatch } = useInvestors();
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("upload");
  const [parsed, setParsed] = useState<ParsedCsv | null>(null);
  const [mapping, setMapping] = useState<Mapping>({});
  const [duplicadosAction, setDuplicadosAction] = useState<
    "ignorar" | "atualizar"
  >("ignorar");
  const [statusPadrao, setStatusPadrao] = useState<StatusInvestidor>(
    "pendente_confirmacao"
  );
  const [gerarCredenciais, setGerarCredenciais] = useState(false);
  const [importando, setImportando] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [resumo, setResumo] = useState<ResumoImport | null>(null);

  // Reset ao fechar/abrir — sincroniza estado interno com a prop `open`.
  useEffect(() => {
    if (!open) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setStep("upload");
      setParsed(null);
      setMapping({});
      setParseError(null);
      setResumo(null);
      setGerarCredenciais(false);
      setImportando(false);
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, [open]);

  // ===== Parse =====
  const onSelectFile = (file: File) => {
    setParseError(null);
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
      complete: (result) => {
        if (result.errors.length > 0) {
          setParseError(
            `Erro ao parsear: ${result.errors[0].message} (linha ${result.errors[0].row})`
          );
          return;
        }
        const headers = (result.meta.fields || []).filter(Boolean);
        if (headers.length === 0) {
          setParseError("O arquivo não tem cabeçalho ou está vazio.");
          return;
        }
        const rows = result.data as Record<string, string>[];
        if (rows.length === 0) {
          setParseError(
            "Arquivo sem linhas de dados (só cabeçalho ou vazio)."
          );
          return;
        }
        // Auto-detect mapping
        const auto: Mapping = {};
        for (const c of CAMPOS) {
          const col = autoDetectColumn(headers, c.key);
          if (col) auto[c.key] = col;
        }
        setParsed({ headers, rows, fileName: file.name });
        setMapping(auto);
        setStep("mapping");
      },
      error: (err) => {
        setParseError(`Falha ao ler o arquivo: ${err.message}`);
      },
    });
  };

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onSelectFile(f);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) onSelectFile(f);
  };

  // ===== Validação =====
  const linhasValidadas: LinhaValidacao[] = useMemo(() => {
    if (!parsed) return [];
    const cpfsExistentes = new Set(
      invState.investidores.map((i) => cleanCpf(i.cpf))
    );
    const cpfsVistosNoCsv = new Set<string>();

    return parsed.rows.map((raw, idx) => {
      const cpfRaw = mapping.cpf ? raw[mapping.cpf] : "";
      const nomeRaw = mapping.nome ? raw[mapping.nome] : "";
      const emailRaw = mapping.email ? raw[mapping.email] : "";
      const wppRaw = mapping.whatsapp ? raw[mapping.whatsapp] : "";
      const valorRaw = mapping.valorInvestido
        ? raw[mapping.valorInvestido]
        : "";

      const cpfClean = cleanCpf(cpfRaw);
      const erros: string[] = [];

      if (!mapping.cpf || !cpfRaw?.trim()) erros.push("CPF ausente");
      else if (!validateCpf(cpfRaw)) erros.push("CPF inválido");

      if (!mapping.nome || !nomeRaw?.trim()) erros.push("Nome ausente");
      if (!mapping.email || !emailRaw?.trim()) erros.push("E-mail ausente");
      else if (!validateEmail(emailRaw)) erros.push("E-mail inválido");

      // Duplicado se CPF já existe na base OU se repete dentro do próprio CSV
      const duplicadoBase = cpfClean && cpfsExistentes.has(cpfClean);
      const duplicadoCsv = cpfClean && cpfsVistosNoCsv.has(cpfClean);
      if (cpfClean) cpfsVistosNoCsv.add(cpfClean);

      return {
        linha: idx + 2, // +2 = cabeçalho ocupa linha 1, dados começam na 2
        raw,
        cpf: cpfClean ? formatCpf(cpfClean) : "",
        nome: (nomeRaw || "").trim(),
        email: (emailRaw || "").trim(),
        whatsapp: wppRaw ? normalizePhone(wppRaw) : "",
        valor: parseValor(valorRaw),
        erros,
        duplicado: Boolean(duplicadoBase || duplicadoCsv),
      };
    });
  }, [parsed, mapping, invState.investidores]);

  const stats = useMemo(() => {
    const total = linhasValidadas.length;
    const validas = linhasValidadas.filter(
      (l) => l.erros.length === 0 && !l.duplicado
    ).length;
    const duplicadas = linhasValidadas.filter(
      (l) => l.erros.length === 0 && l.duplicado
    ).length;
    const invalidas = linhasValidadas.filter((l) => l.erros.length > 0).length;
    return { total, validas, duplicadas, invalidas };
  }, [linhasValidadas]);

  // ===== Confirmar import =====
  const confirmarImport = async () => {
    const cpfsExistentes = new Map(
      invState.investidores.map((i) => [cleanCpf(i.cpf), i.id])
    );
    // Trackeia CPFs já tratados neste batch para evitar duplicar
    // o mesmo CPF se ele aparece múltiplas vezes no próprio CSV.
    const cpfsTratadosNoBatch = new Set<string>();

    const novos: Omit<Investidor, "id" | "criadoEm">[] = [];
    let duplicadosTratados = 0;

    for (const l of linhasValidadas) {
      if (l.erros.length > 0) continue;
      const cpfClean = cleanCpf(l.cpf);
      const jaNaBase = cpfsExistentes.has(cpfClean);
      const jaNoBatch = cpfsTratadosNoBatch.has(cpfClean);

      if (jaNaBase || jaNoBatch) {
        duplicadosTratados++;
        // Só atualiza se está na base original — duplicata interna do CSV
        // significa que a primeira ocorrência venceu, demais são ignoradas.
        if (duplicadosAction === "atualizar" && jaNaBase) {
          const idExistente = cpfsExistentes.get(cpfClean)!;
          const original = invState.investidores.find(
            (i) => i.id === idExistente
          );
          if (original) {
            dispatch({
              type: "update",
              payload: {
                ...original,
                nome: l.nome,
                email: l.email,
                whatsapp: l.whatsapp || original.whatsapp,
                valorInvestido: l.valor || original.valorInvestido,
                ultimoContato: new Date().toISOString().slice(0, 10),
              },
            });
          }
        }
        continue;
      }

      novos.push({
        nome: l.nome,
        cpf: l.cpf,
        email: l.email,
        whatsapp: l.whatsapp,
        status: statusPadrao,
        valorInvestido: l.valor,
        ultimoContato: new Date().toISOString().slice(0, 10),
        origem: "CSV",
      });
      cpfsTratadosNoBatch.add(cpfClean);
    }

    if (novos.length > 0) {
      dispatch({ type: "bulkImport", payload: { novos } });
    }

    // Geração de credenciais de acesso (papel investidor) — opcional
    let credenciaisCriadas: number | undefined;
    if (gerarCredenciais && novos.length > 0) {
      setImportando(true);
      try {
        const r = await gerarCredenciaisEmLote(
          novos.map((n) => ({ nome: n.nome, email: n.email, cpf: n.cpf }))
        );
        credenciaisCriadas = r.criados;
      } catch (e) {
        console.error("[import] falha ao gerar credenciais:", e);
        alert(
          "Investidores importados, mas houve erro ao gerar as credenciais. Verifique o console."
        );
      } finally {
        setImportando(false);
      }
    }

    setResumo({
      totalLido: linhasValidadas.length,
      novos: novos.length,
      duplicados: duplicadosTratados,
      invalidos: stats.invalidas,
      credenciaisCriadas,
    });
    setStep("sucesso");
  };

  // ===== Navegação =====
  const podeAvancarMapping =
    !!mapping.cpf && !!mapping.nome && !!mapping.email;

  const podeAvancarValidacao = stats.validas > 0 || stats.duplicadas > 0;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-xl border border-border bg-card shadow-elevated overflow-hidden">
        {/* Header com stepper */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-base font-bold text-foreground">
              Importar base de investidores
            </h3>
            <p className="text-[12px] text-muted-foreground">
              {parsed?.fileName ?? "Selecione um arquivo CSV"}
            </p>
          </div>
          <Stepper currentStep={step} />
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="h-9 w-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Conteúdo do passo atual */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {step === "upload" && (
            <UploadStep
              onDrop={onDrop}
              onFileInput={onFileInput}
              fileRef={fileRef}
              error={parseError}
            />
          )}
          {step === "mapping" && parsed && (
            <MappingStep
              parsed={parsed}
              mapping={mapping}
              setMapping={setMapping}
            />
          )}
          {step === "validacao" && parsed && (
            <ValidacaoStep
              linhas={linhasValidadas}
              stats={stats}
              duplicadosAction={duplicadosAction}
              setDuplicadosAction={setDuplicadosAction}
              statusPadrao={statusPadrao}
              setStatusPadrao={setStatusPadrao}
              gerarCredenciais={gerarCredenciais}
              setGerarCredenciais={setGerarCredenciais}
            />
          )}
          {step === "sucesso" && resumo && <SucessoStep resumo={resumo} />}
        </div>

        {/* Footer com ações */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between gap-3">
          <div className="text-[12px] text-muted-foreground">
            {step === "upload" && "Selecione um CSV para começar"}
            {step === "mapping" &&
              `${parsed?.rows.length ?? 0} linhas detectadas no arquivo`}
            {step === "validacao" &&
              `${stats.validas} novas · ${stats.duplicadas} duplicadas · ${stats.invalidas} inválidas`}
            {step === "sucesso" && "Importação concluída"}
          </div>

          <div className="flex items-center gap-2">
            {step !== "upload" && step !== "sucesso" && (
              <button
                onClick={() => {
                  if (step === "mapping") setStep("upload");
                  if (step === "validacao") setStep("mapping");
                }}
                className="inline-flex items-center gap-2 px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Voltar
              </button>
            )}

            {step === "mapping" && (
              <button
                onClick={() => setStep("validacao")}
                disabled={!podeAvancarMapping}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-[12px] font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Validar
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}

            {step === "validacao" && (
              <button
                onClick={confirmarImport}
                disabled={!podeAvancarValidacao || importando}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-[12px] font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary-deep transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check className="h-3.5 w-3.5" />
                {importando ? "Importando..." : "Confirmar importação"}
              </button>
            )}

            {step === "sucesso" && (
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-[12px] font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary-deep transition-colors"
              >
                Concluído
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== Stepper =====
function Stepper({ currentStep }: { currentStep: Step }) {
  const order: Step[] = ["upload", "mapping", "validacao", "sucesso"];
  const currentIdx = order.indexOf(currentStep);
  return (
    <div className="hidden md:flex items-center gap-2">
      {order.map((s, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors",
                done && "bg-primary text-primary-foreground",
                active &&
                  "bg-primary/15 text-primary border-2 border-primary",
                !done &&
                  !active &&
                  "bg-muted text-muted-foreground border border-border"
              )}
            >
              {done ? <Check className="h-3 w-3" /> : i + 1}
            </div>
            <span
              className={cn(
                "text-[11px] font-semibold uppercase tracking-wider",
                active && "text-foreground",
                done && "text-primary",
                !done && !active && "text-muted-foreground"
              )}
            >
              {STEPS_LABEL[s]}
            </span>
            {i < order.length - 1 && (
              <div
                className={cn(
                  "w-6 h-px",
                  i < currentIdx ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ===== Passo 1: Upload =====
function UploadStep({
  onDrop,
  onFileInput,
  fileRef,
  error,
}: {
  onDrop: (e: React.DragEvent) => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileRef: React.RefObject<HTMLInputElement | null>;
  error: string | null;
}) {
  const [dragOver, setDragOver] = useState(false);
  return (
    <div className="max-w-xl mx-auto py-4 space-y-5">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          setDragOver(false);
          onDrop(e);
        }}
        onClick={() => fileRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all",
          dragOver
            ? "border-primary bg-primary/5"
            : "border-border bg-background hover:border-primary/40 hover:bg-primary/5"
        )}
      >
        <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Upload className="h-7 w-7" />
        </div>
        <div className="mt-5 font-display text-lg font-bold text-foreground">
          Arraste o arquivo CSV aqui
        </div>
        <div className="mt-1 text-[13px] text-muted-foreground">
          ou clique para selecionar do seu computador
        </div>
        <div className="mt-4 text-[11px] text-muted-foreground">
          Formato esperado:{" "}
          <code className="px-1.5 py-0.5 rounded bg-muted font-mono">
            cpf, nome, email, whatsapp, valor
          </code>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept=".csv,text/csv"
        onChange={onFileInput}
        className="hidden"
      />

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 flex items-start gap-3">
          <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
          <div className="text-[13px] text-foreground">{error}</div>
        </div>
      )}

      <div className="text-center">
        <button
          onClick={downloadTemplate}
          className="inline-flex items-center gap-2 text-[12px] font-semibold text-primary hover:text-primary-deep transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          Baixar template CSV de exemplo
        </button>
      </div>
    </div>
  );
}

// ===== Passo 2: Mapeamento =====
function MappingStep({
  parsed,
  mapping,
  setMapping,
}: {
  parsed: ParsedCsv;
  mapping: Mapping;
  setMapping: (m: Mapping) => void;
}) {
  const auto = CAMPOS.filter((c) => mapping[c.key]).length;
  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 flex items-start gap-3">
        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
        <div className="text-[13px] text-foreground">
          <strong>{auto} de {CAMPOS.length}</strong> campos detectados
          automaticamente pelos cabeçalhos do CSV. Confira o mapeamento abaixo
          ou ajuste se necessário.
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {CAMPOS.map((campo) => (
          <div
            key={campo.key}
            className="rounded-lg border border-border bg-background p-4 flex items-center gap-4"
          >
            <div className="w-44 shrink-0">
              <div className="text-[13px] font-semibold text-foreground">
                {campo.label}
                {campo.obrigatorio && (
                  <span className="text-destructive ml-1">*</span>
                )}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {campo.obrigatorio ? "Obrigatório" : "Opcional"}
              </div>
            </div>

            <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />

            <select
              value={mapping[campo.key] ?? ""}
              onChange={(e) =>
                setMapping({
                  ...mapping,
                  [campo.key]: e.target.value || undefined,
                })
              }
              className="flex-1 rounded-md border border-input bg-card px-3 py-2 text-[13px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            >
              <option value="">— Ignorar este campo —</option>
              {parsed.headers.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>

            {mapping[campo.key] && (
              <div className="text-[11px] text-muted-foreground font-mono max-w-[180px] truncate">
                {parsed.rows[0]?.[mapping[campo.key]!] || "(vazio)"}
              </div>
            )}
          </div>
        ))}
      </div>

      <details className="rounded-lg border border-border bg-background">
        <summary className="px-4 py-3 cursor-pointer text-[12px] font-semibold text-foreground hover:bg-muted/40 transition-colors">
          Ver preview das 5 primeiras linhas
        </summary>
        <div className="border-t border-border overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left bg-muted/40">
                {parsed.headers.map((h) => (
                  <th
                    key={h}
                    className="px-3 py-2 font-semibold text-foreground border-r border-border last:border-0"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {parsed.rows.slice(0, 5).map((row, i) => (
                <tr key={i} className="border-t border-border">
                  {parsed.headers.map((h) => (
                    <td
                      key={h}
                      className="px-3 py-2 text-muted-foreground border-r border-border last:border-0"
                    >
                      {row[h] ?? ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

// ===== Passo 3: Validação =====
function ValidacaoStep({
  linhas,
  stats,
  duplicadosAction,
  setDuplicadosAction,
  statusPadrao,
  setStatusPadrao,
  gerarCredenciais,
  setGerarCredenciais,
}: {
  linhas: LinhaValidacao[];
  stats: {
    total: number;
    validas: number;
    duplicadas: number;
    invalidas: number;
  };
  duplicadosAction: "ignorar" | "atualizar";
  setDuplicadosAction: (s: "ignorar" | "atualizar") => void;
  statusPadrao: StatusInvestidor;
  setStatusPadrao: (s: StatusInvestidor) => void;
  gerarCredenciais: boolean;
  setGerarCredenciais: (b: boolean) => void;
}) {
  const [filtro, setFiltro] = useState<"todos" | "validas" | "dup" | "erros">(
    "todos"
  );

  const filtradas = useMemo(() => {
    if (filtro === "validas")
      return linhas.filter((l) => l.erros.length === 0 && !l.duplicado);
    if (filtro === "dup")
      return linhas.filter((l) => l.erros.length === 0 && l.duplicado);
    if (filtro === "erros") return linhas.filter((l) => l.erros.length > 0);
    return linhas;
  }, [linhas, filtro]);

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatPill
          icon={FileText}
          label="Total"
          value={stats.total}
          tone="neutral"
        />
        <StatPill
          icon={CheckCircle2}
          label="Novas válidas"
          value={stats.validas}
          tone="success"
        />
        <StatPill
          icon={AlertTriangle}
          label="Duplicadas"
          value={stats.duplicadas}
          tone="warning"
        />
        <StatPill
          icon={XCircle}
          label="Com erros"
          value={stats.invalidas}
          tone="destructive"
        />
      </div>

      {/* Opções de import */}
      <div className="rounded-lg border border-border bg-background p-4 space-y-4">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Como tratar duplicados?
          </div>
          <div className="flex flex-wrap gap-2">
            <RadioChip
              checked={duplicadosAction === "ignorar"}
              onClick={() => setDuplicadosAction("ignorar")}
              label="Ignorar (não importa nem atualiza)"
            />
            <RadioChip
              checked={duplicadosAction === "atualizar"}
              onClick={() => setDuplicadosAction("atualizar")}
              label="Atualizar (sobrescreve os dados existentes)"
            />
          </div>
        </div>

        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Status inicial dos novos investidores
          </div>
          <select
            value={statusPadrao}
            onChange={(e) => setStatusPadrao(e.target.value as StatusInvestidor)}
            className="w-full md:w-72 rounded-md border border-input bg-card px-3 py-2 text-[13px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          >
            <option value="pendente_confirmacao">Pendente (recomendado)</option>
            <option value="ativo">Ativo (já confirmado)</option>
            <option value="inativo">Inativo</option>
          </select>
        </div>

        <div className="pt-2 border-t border-border">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={gerarCredenciais}
              onChange={(e) => setGerarCredenciais(e.target.checked)}
              className="mt-0.5 rounded border-input text-primary focus:ring-primary/30"
            />
            <span>
              <span className="text-[13px] font-semibold text-foreground">
                Gerar credenciais de acesso?
              </span>
              <span className="block text-[12px] text-muted-foreground mt-0.5">
                Cria um usuário (papel investidor) com senha provisória para cada
                novo investidor importado. O envio das credenciais por e-mail é
                feito depois, na lista de investidores.
              </span>
            </span>
          </label>
        </div>
      </div>

      {/* Filtros e tabela */}
      <div>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <FilterChip
            active={filtro === "todos"}
            onClick={() => setFiltro("todos")}
            label={`Todas (${stats.total})`}
          />
          <FilterChip
            active={filtro === "validas"}
            onClick={() => setFiltro("validas")}
            label={`Válidas (${stats.validas})`}
          />
          <FilterChip
            active={filtro === "dup"}
            onClick={() => setFiltro("dup")}
            label={`Duplicadas (${stats.duplicadas})`}
          />
          <FilterChip
            active={filtro === "erros"}
            onClick={() => setFiltro("erros")}
            label={`Com erros (${stats.invalidas})`}
          />
        </div>

        <div className="rounded-lg border border-border bg-card overflow-hidden max-h-80 overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-background/95 backdrop-blur-sm">
              <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="px-3 py-2 font-semibold w-12">Linha</th>
                <th className="px-3 py-2 font-semibold">CPF</th>
                <th className="px-3 py-2 font-semibold">Nome</th>
                <th className="px-3 py-2 font-semibold">E-mail</th>
                <th className="px-3 py-2 font-semibold">WhatsApp</th>
                <th className="px-3 py-2 font-semibold text-right">Valor</th>
                <th className="px-3 py-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-muted-foreground">
                    Nenhuma linha nesta categoria.
                  </td>
                </tr>
              )}
              {filtradas.slice(0, 200).map((l) => {
                const tone =
                  l.erros.length > 0
                    ? "border-l-destructive bg-destructive/5"
                    : l.duplicado
                      ? "border-l-warning bg-warning/5"
                      : "border-l-primary bg-transparent";
                return (
                  <tr
                    key={l.linha}
                    className={cn(
                      "border-b border-border last:border-0 border-l-2",
                      tone
                    )}
                  >
                    <td className="px-3 py-2 text-muted-foreground tabular-nums">
                      {l.linha}
                    </td>
                    <td className="px-3 py-2 font-mono text-foreground">
                      {l.cpf || "—"}
                    </td>
                    <td className="px-3 py-2 text-foreground truncate max-w-[160px]">
                      {l.nome || "—"}
                    </td>
                    <td className="px-3 py-2 text-foreground truncate max-w-[180px]">
                      {l.email || "—"}
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {l.whatsapp || "—"}
                    </td>
                    <td className="px-3 py-2 text-foreground text-right tabular-nums">
                      {l.valor
                        ? l.valor.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                            maximumFractionDigits: 0,
                          })
                        : "—"}
                    </td>
                    <td className="px-3 py-2">
                      {l.erros.length > 0 ? (
                        <span
                          title={l.erros.join(", ")}
                          className="inline-flex items-center gap-1 text-destructive font-semibold"
                        >
                          <XCircle className="h-3 w-3" />
                          {l.erros[0]}
                        </span>
                      ) : l.duplicado ? (
                        <span className="inline-flex items-center gap-1 text-warning-foreground font-semibold">
                          <AlertTriangle className="h-3 w-3" />
                          Duplicado
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-primary font-semibold">
                          <CheckCircle2 className="h-3 w-3" />
                          Válido
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtradas.length > 200 && (
                <tr>
                  <td colSpan={7} className="py-3 text-center text-[11px] text-muted-foreground">
                    Mostrando 200 primeiras de {filtradas.length} linhas filtradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ===== Passo 4: Sucesso =====
function SucessoStep({ resumo }: { resumo: ResumoImport }) {
  return (
    <div className="py-8 text-center">
      <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        <CheckCircle2 className="h-8 w-8" />
      </div>
      <h2 className="mt-5 font-display text-2xl font-extrabold text-foreground">
        Importação concluída
      </h2>
      <p className="mt-2 text-[13px] text-muted-foreground">
        {resumo.novos > 0
          ? `${resumo.novos} novos investidores adicionados à base.`
          : "Nenhum novo investidor foi adicionado."}
      </p>

      <div className="mt-8 max-w-md mx-auto grid grid-cols-2 gap-3">
        <ResumoCard label="Linhas lidas" value={resumo.totalLido} />
        <ResumoCard label="Novos importados" value={resumo.novos} tone="success" />
        <ResumoCard
          label="Duplicados tratados"
          value={resumo.duplicados}
          tone="warning"
        />
        <ResumoCard
          label="Linhas inválidas ignoradas"
          value={resumo.invalidos}
          tone="destructive"
        />
      </div>

      {resumo.credenciaisCriadas !== undefined && (
        <div className="mt-6 max-w-md mx-auto rounded-lg border border-primary/20 bg-primary/5 p-4 text-left flex items-start gap-3">
          <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <div className="text-[13px] text-foreground">
            <strong>{resumo.credenciaisCriadas}</strong> credenciais de acesso
            geradas (papel investidor). Envie por e-mail na{" "}
            <strong>lista de investidores</strong> → "Enviar credenciais".
          </div>
        </div>
      )}
    </div>
  );
}

// ===== Auxiliares =====
function StatPill({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof FileText;
  label: string;
  value: number;
  tone: "neutral" | "success" | "warning" | "destructive";
}) {
  const toneCls = {
    neutral: "bg-muted text-muted-foreground",
    success: "bg-primary/10 text-primary",
    warning: "bg-warning/15 text-warning-foreground",
    destructive: "bg-destructive/10 text-destructive",
  }[tone];
  return (
    <div className="rounded-lg border border-border bg-card p-3 flex items-center gap-3">
      <div
        className={cn(
          "h-8 w-8 rounded-md flex items-center justify-center",
          toneCls
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <div className="font-display text-lg font-extrabold text-foreground tabular-nums leading-none">
          {value}
        </div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-0.5">
          {label}
        </div>
      </div>
    </div>
  );
}

function ResumoCard({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: number;
  tone?: "neutral" | "success" | "warning" | "destructive";
}) {
  const toneCls = {
    neutral: "text-foreground",
    success: "text-primary",
    warning: "text-warning-foreground",
    destructive: "text-destructive",
  }[tone];
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <div
        className={cn(
          "font-display text-3xl font-extrabold tabular-nums",
          toneCls
        )}
      >
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
        {label}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1 rounded-full text-[11px] font-semibold transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-background border border-border text-foreground hover:border-primary/40"
      )}
    >
      {label}
    </button>
  );
}

function RadioChip({
  checked,
  onClick,
  label,
}: {
  checked: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-[12px] font-semibold transition-colors",
        checked
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-card text-foreground hover:border-primary/40"
      )}
    >
      <span
        className={cn(
          "h-3 w-3 rounded-full border-2 flex items-center justify-center",
          checked ? "border-primary" : "border-border"
        )}
      >
        {checked && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
      </span>
      {label}
    </button>
  );
}

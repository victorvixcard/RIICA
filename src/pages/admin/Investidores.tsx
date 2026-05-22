import { useMemo, useState } from "react";
import Papa from "papaparse";
import {
  Plus,
  Upload,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Edit2,
  Trash2,
  Filter,
  CheckSquare,
  Square,
  Tag,
  XCircle,
} from "lucide-react";
import { Topbar } from "@/components/admin/layout/Topbar";
import { ImportCsvModal } from "@/components/admin/csv/ImportCsvModal";
import { InvestidorDetalheModal } from "@/components/admin/investidores/InvestidorDetalheModal";
import {
  useInvestors,
  STATUS_LABEL,
  STATUS_TINT,
  type Investidor,
  type StatusInvestidor,
  type OrigemInvestidor,
} from "@/store/investors";
import { cn } from "@/lib/utils";

const STATUS_OPTS: StatusInvestidor[] = [
  "ativo",
  "pendente_confirmacao",
  "bloqueado",
  "inativo",
];

const ORIGEM_OPTS: OrigemInvestidor[] = [
  "CSV",
  "Cadastro manual",
  "Importação SCP",
  "Indicação",
];

const FAIXAS = [
  { label: "Até R$ 100 mil", min: 0, max: 100_000 },
  { label: "R$ 100 mil – R$ 500 mil", min: 100_000, max: 500_000 },
  { label: "R$ 500 mil – R$ 1 mi", min: 500_000, max: 1_000_000 },
  { label: "Acima de R$ 1 mi", min: 1_000_000, max: Infinity },
];

type SortKey = "nome" | "valorInvestido" | "ultimoContato" | "status";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 10;

function fmtBRL(n: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(n);
}

function fmtData(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${String(d.getUTCDate()).padStart(2, "0")}.${String(d.getUTCMonth() + 1).padStart(2, "0")}.${d.getUTCFullYear()}`;
}

function maskCpf(cpf: string) {
  if (cpf.length < 11) return cpf;
  return cpf.replace(/^(\d{3}\.)\d{3}\.\d{3}(-\d{2})$/, "$1***.***$2");
}

export function Investidores() {
  const { state, dispatch } = useInvestors();
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<StatusInvestidor | "todos">(
    "todos"
  );
  const [filtroOrigem, setFiltroOrigem] = useState<OrigemInvestidor | "todos">(
    "todos"
  );
  const [filtroFaixa, setFiltroFaixa] = useState<number | "todos">("todos");
  const [sortKey, setSortKey] = useState<SortKey>("ultimoContato");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [pagina, setPagina] = useState(1);
  const [importOpen, setImportOpen] = useState(false);
  const [detalhe, setDetalhe] = useState<Investidor | null>(null);
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());

  const filtrados = useMemo(() => {
    let arr = state.investidores;
    if (busca.trim()) {
      const q = busca.trim().toLowerCase();
      arr = arr.filter(
        (i) =>
          i.nome.toLowerCase().includes(q) ||
          i.email.toLowerCase().includes(q) ||
          i.cpf.includes(q) ||
          i.whatsapp.includes(q)
      );
    }
    if (filtroStatus !== "todos") arr = arr.filter((i) => i.status === filtroStatus);
    if (filtroOrigem !== "todos") arr = arr.filter((i) => i.origem === filtroOrigem);
    if (filtroFaixa !== "todos") {
      const f = FAIXAS[filtroFaixa];
      arr = arr.filter(
        (i) => i.valorInvestido >= f.min && i.valorInvestido < f.max
      );
    }
    arr = [...arr].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "nome") cmp = a.nome.localeCompare(b.nome);
      else if (sortKey === "valorInvestido")
        cmp = a.valorInvestido - b.valorInvestido;
      else if (sortKey === "ultimoContato")
        cmp = a.ultimoContato.localeCompare(b.ultimoContato);
      else if (sortKey === "status") cmp = a.status.localeCompare(b.status);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [
    state.investidores,
    busca,
    filtroStatus,
    filtroOrigem,
    filtroFaixa,
    sortKey,
    sortDir,
  ]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / PAGE_SIZE));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const paginados = filtrados.slice(
    (paginaAtual - 1) * PAGE_SIZE,
    paginaAtual * PAGE_SIZE
  );

  const stats = useMemo(() => {
    const total = state.investidores.length;
    const ativos = state.investidores.filter((i) => i.status === "ativo")
      .length;
    const totalInvestido = state.investidores.reduce(
      (acc, i) => acc + i.valorInvestido,
      0
    );
    return { total, ativos, totalInvestido };
  }, [state.investidores]);

  const onSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const limparFiltros = () => {
    setBusca("");
    setFiltroStatus("todos");
    setFiltroOrigem("todos");
    setFiltroFaixa("todos");
    setPagina(1);
  };

  const temFiltro =
    busca ||
    filtroStatus !== "todos" ||
    filtroOrigem !== "todos" ||
    filtroFaixa !== "todos";

  const onDelete = (i: Investidor) => {
    if (confirm(`Remover ${i.nome} da base?\n\nEssa ação não pode ser desfeita.`)) {
      dispatch({ type: "delete", payload: { id: i.id } });
    }
  };

  // Multi-select
  const toggleOne = (id: string) => {
    setSelecionados((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllPage = () => {
    const idsPagina = paginados.map((i) => i.id);
    const todosSelecionados = idsPagina.every((id) => selecionados.has(id));
    setSelecionados((s) => {
      const next = new Set(s);
      if (todosSelecionados) idsPagina.forEach((id) => next.delete(id));
      else idsPagina.forEach((id) => next.add(id));
      return next;
    });
  };

  const limparSelecao = () => setSelecionados(new Set());

  const exportarCsv = (apenasSelecionados: boolean) => {
    const arr = apenasSelecionados
      ? state.investidores.filter((i) => selecionados.has(i.id))
      : filtrados;
    const csv = Papa.unparse(
      arr.map((i) => ({
        id: i.id,
        nome: i.nome,
        cpf: i.cpf,
        email: i.email,
        whatsapp: i.whatsapp,
        status: i.status,
        valor_investido: i.valorInvestido,
        ultimo_contato: i.ultimoContato,
        origem: i.origem,
        cadastrado_em: i.criadoEm,
      }))
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `investidores-ica-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const aplicarStatusEmLote = (novoStatus: StatusInvestidor) => {
    if (
      !confirm(
        `Aplicar status "${STATUS_LABEL[novoStatus]}" a ${selecionados.size} investidor${selecionados.size === 1 ? "" : "es"}?`
      )
    )
      return;
    state.investidores
      .filter((i) => selecionados.has(i.id))
      .forEach((i) => {
        dispatch({ type: "update", payload: { ...i, status: novoStatus } });
      });
    limparSelecao();
  };

  const deletarSelecionados = () => {
    if (
      !confirm(
        `Remover ${selecionados.size} investidor${selecionados.size === 1 ? "" : "es"} da base?\n\nEssa ação não pode ser desfeita.`
      )
    )
      return;
    dispatch({
      type: "deleteMany",
      payload: { ids: Array.from(selecionados) },
    });
    limparSelecao();
  };

  const idsPagina = paginados.map((i) => i.id);
  const todosSelecionadosNaPagina =
    idsPagina.length > 0 && idsPagina.every((id) => selecionados.has(id));

  return (
    <>
      <Topbar
        title="Investidores"
        subtitle="Base completa de investidores — importação, segmentação, cadastros"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setImportOpen(true)}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <Upload className="h-4 w-4" />
              Importar CSV
            </button>
            <button
              onClick={() =>
                alert(
                  "Modal de criação manual será implementado quando o backend chegar"
                )
              }
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary-deep transition-colors"
            >
              <Plus className="h-4 w-4" />
              Novo investidor
            </button>
          </div>
        }
      />

      <main className="flex-1 px-6 lg:px-10 py-8">
        <div className="max-w-[1400px] mx-auto space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Total na base
              </div>
              <div className="mt-2 font-display text-2xl font-extrabold text-foreground tabular-nums">
                {stats.total.toLocaleString("pt-BR")}
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                investidores cadastrados
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Ativos
              </div>
              <div className="mt-2 font-display text-2xl font-extrabold text-primary tabular-nums">
                {stats.ativos.toLocaleString("pt-BR")}
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                {((stats.ativos / Math.max(stats.total, 1)) * 100).toFixed(1)}%
                da base
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Valor total investido
              </div>
              <div className="mt-2 font-display text-2xl font-extrabold text-foreground tabular-nums">
                {fmtBRL(stats.totalInvestido)}
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                soma de todas as posições
              </div>
            </div>
          </div>

          {/* Busca + Filtros */}
          <div className="rounded-xl border border-border bg-card p-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={busca}
                  onChange={(e) => {
                    setBusca(e.target.value);
                    setPagina(1);
                  }}
                  placeholder="Buscar por nome, CPF, e-mail ou WhatsApp..."
                  className="flex-1 bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>
              {temFiltro && (
                <button
                  onClick={limparFiltros}
                  className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-destructive transition-colors px-3 py-2"
                >
                  Limpar
                </button>
              )}
              <button
                onClick={() => exportarCsv(false)}
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-[12px] font-semibold uppercase tracking-wider text-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                Exportar filtrados
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                <Filter className="h-3.5 w-3.5" />
                Filtros
              </div>

              <div className="flex flex-wrap gap-2">
                <FilterChip
                  active={filtroStatus === "todos"}
                  onClick={() => {
                    setFiltroStatus("todos");
                    setPagina(1);
                  }}
                  label="Status: todos"
                />
                {STATUS_OPTS.map((s) => (
                  <FilterChip
                    key={s}
                    active={filtroStatus === s}
                    onClick={() => {
                      setFiltroStatus(s);
                      setPagina(1);
                    }}
                    label={STATUS_LABEL[s]}
                  />
                ))}
              </div>

              <div className="h-5 w-px bg-border" />

              <div className="flex flex-wrap gap-2">
                <FilterChip
                  active={filtroOrigem === "todos"}
                  onClick={() => {
                    setFiltroOrigem("todos");
                    setPagina(1);
                  }}
                  label="Origem: todas"
                />
                {ORIGEM_OPTS.map((o) => (
                  <FilterChip
                    key={o}
                    active={filtroOrigem === o}
                    onClick={() => {
                      setFiltroOrigem(o);
                      setPagina(1);
                    }}
                    label={o}
                  />
                ))}
              </div>

              <div className="h-5 w-px bg-border" />

              <div className="flex flex-wrap gap-2">
                <FilterChip
                  active={filtroFaixa === "todos"}
                  onClick={() => {
                    setFiltroFaixa("todos");
                    setPagina(1);
                  }}
                  label="Valor: todos"
                />
                {FAIXAS.map((f, i) => (
                  <FilterChip
                    key={f.label}
                    active={filtroFaixa === i}
                    onClick={() => {
                      setFiltroFaixa(i);
                      setPagina(1);
                    }}
                    label={f.label}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Barra de ações em lote (sticky quando há seleção) */}
          {selecionados.size > 0 && (
            <div className="rounded-xl border-2 border-primary bg-primary/5 p-4 flex flex-wrap items-center gap-3">
              <div className="text-[13px] font-semibold text-primary">
                {selecionados.size} selecionado
                {selecionados.size > 1 ? "s" : ""}
              </div>
              <div className="h-5 w-px bg-primary/30" />
              <button
                onClick={() => exportarCsv(true)}
                className="inline-flex items-center gap-2 rounded-md bg-card border border-border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-foreground hover:border-primary hover:text-primary transition-colors"
              >
                <Download className="h-3 w-3" />
                Exportar selecionados
              </button>
              <BulkStatusBtn aplicar={aplicarStatusEmLote} />
              <button
                onClick={deletarSelecionados}
                className="inline-flex items-center gap-2 rounded-md bg-card border border-border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-foreground hover:border-destructive hover:text-destructive transition-colors"
              >
                <Trash2 className="h-3 w-3" />
                Remover
              </button>
              <div className="ml-auto">
                <button
                  onClick={limparSelecao}
                  aria-label="Limpar seleção"
                  className="inline-flex items-center gap-1 text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Limpar seleção
                </button>
              </div>
            </div>
          )}

          {/* Tabela */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border bg-background/40">
                    <th className="py-3 pl-5 pr-2 font-semibold w-10">
                      <button
                        onClick={toggleAllPage}
                        aria-label="Selecionar página"
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {todosSelecionadosNaPagina ? (
                          <CheckSquare className="h-4 w-4 text-primary" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </th>
                    <th className="py-3 pr-4 font-semibold">
                      <SortBtn
                        active={sortKey === "nome"}
                        dir={sortDir}
                        onClick={() => onSort("nome")}
                      >
                        Investidor
                      </SortBtn>
                    </th>
                    <th className="py-3 px-4 font-semibold">Contato</th>
                    <th className="py-3 px-4 font-semibold w-32">
                      <SortBtn
                        active={sortKey === "status"}
                        dir={sortDir}
                        onClick={() => onSort("status")}
                      >
                        Status
                      </SortBtn>
                    </th>
                    <th className="py-3 px-4 font-semibold w-40 text-right">
                      <SortBtn
                        active={sortKey === "valorInvestido"}
                        dir={sortDir}
                        onClick={() => onSort("valorInvestido")}
                      >
                        Valor investido
                      </SortBtn>
                    </th>
                    <th className="py-3 px-4 font-semibold w-32">
                      <SortBtn
                        active={sortKey === "ultimoContato"}
                        dir={sortDir}
                        onClick={() => onSort("ultimoContato")}
                      >
                        Último contato
                      </SortBtn>
                    </th>
                    <th className="py-3 px-4 font-semibold w-32">Origem</th>
                    <th className="py-3 pl-4 pr-5 font-semibold w-24 text-right">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginados.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-16 text-center text-[13px] text-muted-foreground"
                      >
                        Nenhum investidor encontrado com esses filtros.
                      </td>
                    </tr>
                  )}
                  {paginados.map((i) => {
                    const selecionado = selecionados.has(i.id);
                    return (
                      <tr
                        key={i.id}
                        className={cn(
                          "border-b border-border last:border-0 transition-colors",
                          selecionado ? "bg-primary/5" : "hover:bg-muted/40"
                        )}
                      >
                        <td className="py-3.5 pl-5 pr-2">
                          <button
                            onClick={() => toggleOne(i.id)}
                            aria-label="Selecionar"
                            className="text-muted-foreground hover:text-primary transition-colors"
                          >
                            {selecionado ? (
                              <CheckSquare className="h-4 w-4 text-primary" />
                            ) : (
                              <Square className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                        <td className="py-3.5 pr-4">
                          <button
                            onClick={() => setDetalhe(i)}
                            className="flex items-center gap-3 text-left group w-full"
                          >
                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-[12px] shrink-0">
                              {i.nome
                                .split(" ")
                                .map((p) => p[0])
                                .slice(0, 2)
                                .join("")
                                .toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="text-[13px] font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
                                {i.nome}
                              </div>
                              <div className="text-[11px] text-muted-foreground font-mono">
                                {maskCpf(i.cpf)}
                              </div>
                            </div>
                          </button>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-[12px] text-foreground truncate max-w-[180px]">
                            {i.email}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {i.whatsapp}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider",
                              STATUS_TINT[i.status]
                            )}
                          >
                            {STATUS_LABEL[i.status]}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right text-[13px] font-semibold text-foreground tabular-nums">
                          {fmtBRL(i.valorInvestido)}
                        </td>
                        <td className="py-3.5 px-4 text-[12px] text-muted-foreground tabular-nums">
                          {fmtData(i.ultimoContato)}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-[11px] text-muted-foreground">
                            {i.origem}
                          </span>
                        </td>
                        <td className="py-3.5 pl-4 pr-5 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => setDetalhe(i)}
                              aria-label="Ver / Editar"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => onDelete(i)}
                              aria-label="Remover"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            {filtrados.length > 0 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-border bg-background/40">
                <div className="text-[12px] text-muted-foreground">
                  Mostrando{" "}
                  <strong className="text-foreground">
                    {(paginaAtual - 1) * PAGE_SIZE + 1}–
                    {Math.min(paginaAtual * PAGE_SIZE, filtrados.length)}
                  </strong>{" "}
                  de{" "}
                  <strong className="text-foreground">
                    {filtrados.length.toLocaleString("pt-BR")}
                  </strong>{" "}
                  {temFiltro ? "filtrados" : "investidores"}
                </div>
                <div className="inline-flex items-center gap-1">
                  <button
                    onClick={() => setPagina((p) => Math.max(1, p - 1))}
                    disabled={paginaAtual === 1}
                    className="h-8 w-8 rounded-md flex items-center justify-center border border-border bg-card text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-colors"
                    aria-label="Página anterior"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-[12px] font-semibold text-foreground px-3 tabular-nums">
                    {paginaAtual} / {totalPaginas}
                  </span>
                  <button
                    onClick={() =>
                      setPagina((p) => Math.min(totalPaginas, p + 1))
                    }
                    disabled={paginaAtual === totalPaginas}
                    className="h-8 w-8 rounded-md flex items-center justify-center border border-border bg-card text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-colors"
                    aria-label="Próxima página"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <ImportCsvModal open={importOpen} onClose={() => setImportOpen(false)} />
      <InvestidorDetalheModal
        investidor={detalhe}
        open={!!detalhe}
        onClose={() => setDetalhe(null)}
      />
    </>
  );
}

function BulkStatusBtn({
  aplicar,
}: {
  aplicar: (s: StatusInvestidor) => void;
}) {
  const [aberto, setAberto] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setAberto(!aberto)}
        className="inline-flex items-center gap-2 rounded-md bg-card border border-border px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-foreground hover:border-primary hover:text-primary transition-colors"
      >
        <Tag className="h-3 w-3" />
        Aplicar status
      </button>
      {aberto && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setAberto(false)}
          />
          <div className="absolute top-full left-0 mt-1 z-20 min-w-[200px] rounded-md border border-border bg-card shadow-elevated overflow-hidden">
            {STATUS_OPTS.map((s) => (
              <button
                key={s}
                onClick={() => {
                  aplicar(s);
                  setAberto(false);
                }}
                className="w-full px-3 py-2 text-left text-[12px] text-foreground hover:bg-muted transition-colors"
              >
                {STATUS_LABEL[s]}
              </button>
            ))}
          </div>
        </>
      )}
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

function SortBtn({
  active,
  dir,
  onClick,
  children,
}: {
  active: boolean;
  dir: SortDir;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 hover:text-primary transition-colors",
        active && "text-primary"
      )}
    >
      {children}
      <ArrowUpDown
        className={cn("h-3 w-3 opacity-60", active && "opacity-100")}
      />
      {active && (
        <span className="text-[9px] opacity-70">
          {dir === "asc" ? "↑" : "↓"}
        </span>
      )}
    </button>
  );
}

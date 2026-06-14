import { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  KeyRound,
  ShieldCheck,
  User,
  Power,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { Topbar } from "@/components/admin/layout/Topbar";
import { cn } from "@/lib/utils";
import {
  getUsuarios,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  setStatusUsuario,
  definirSenha,
  PAPEL_LABEL,
  type Usuario,
  type PapelUsuario,
  type StatusUsuario,
  type NovoUsuario,
} from "@/lib/api/usuarios";

const EMPTY: NovoUsuario = {
  nome: "",
  email: "",
  cpf: "",
  papel: "investidor",
  status: "ativo",
};

const PAPEL_TINT: Record<PapelUsuario, string> = {
  super_admin: "bg-primary/15 text-primary-deep border-primary/30",
  investidor: "bg-muted text-foreground border-border",
};

function formatCpf(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<string | "novo" | null>(null);
  const [form, setForm] = useState<NovoUsuario>(EMPTY);
  const [senhaModal, setSenhaModal] = useState<Usuario | null>(null);
  const [novaSenha, setNovaSenha] = useState("");
  const [verSenha, setVerSenha] = useState(false);
  const [erroSenha, setErroSenha] = useState("");
  const [salvandoSenha, setSalvandoSenha] = useState(false);

  const carregar = async () => {
    try {
      setUsuarios(await getUsuarios());
    } catch (e) {
      console.error("[usuarios] erro ao carregar:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Carga inicial dos usuários (load-on-mount).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void carregar();
  }, []);

  const abrirNovo = () => {
    setForm(EMPTY);
    setEditando("novo");
  };

  const abrirEdicao = (u: Usuario) => {
    setForm({
      nome: u.nome,
      email: u.email,
      cpf: u.cpf ?? "",
      papel: u.papel,
      status: u.status,
    });
    setEditando(u.id);
  };

  const fechar = () => {
    setEditando(null);
    setForm(EMPTY);
  };

  const salvar = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const payload: NovoUsuario = {
      nome: form.nome.trim(),
      email: form.email.trim(),
      cpf: form.cpf?.trim() || undefined,
      papel: form.papel,
      status: form.status,
    };
    try {
      if (editando === "novo") await createUsuario(payload);
      else if (editando) await updateUsuario(editando, payload);
      await carregar();
      fechar();
    } catch (e) {
      alert("Erro ao salvar usuário. Verifique se o e-mail já não está em uso.");
      console.error(e);
    }
  };

  const deletar = async (u: Usuario) => {
    if (!confirm(`Excluir o usuário ${u.nome}?`)) return;
    await deleteUsuario(u.id);
    await carregar();
  };

  const toggleStatus = async (u: Usuario) => {
    const novo: StatusUsuario = u.status === "ativo" ? "inativo" : "ativo";
    await setStatusUsuario(u.id, novo);
    await carregar();
  };

  const fecharModalSenha = () => {
    setSenhaModal(null);
    setNovaSenha("");
    setVerSenha(false);
    setErroSenha("");
    setSalvandoSenha(false);
  };

  const salvarSenha = async () => {
    if (!senhaModal) return;
    setErroSenha("");
    if (novaSenha.trim().length < 6) {
      setErroSenha("A senha deve ter ao menos 6 caracteres.");
      return;
    }
    setSalvandoSenha(true);
    try {
      await definirSenha(senhaModal.id, novaSenha.trim());
      fecharModalSenha();
      await carregar();
    } catch (e) {
      setErroSenha(e instanceof Error ? e.message : "Falha ao resetar senha.");
    } finally {
      setSalvandoSenha(false);
    }
  };

  return (
    <>
      <Topbar
        title="Usuários"
        subtitle="Contas de acesso ao sistema — defina papel, status e senha"
        actions={
          <button
            onClick={abrirNovo}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary-deep transition-colors"
          >
            <Plus className="h-4 w-4" />
            Novo usuário
          </button>
        }
      />

      <main className="flex-1 px-6 lg:px-10 py-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 mb-6 flex items-start gap-3">
            <ShieldCheck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <p className="text-[13px] text-muted-foreground">
              <strong className="text-foreground">Super Admin</strong> acessa o painel (<code>/admin</code>);{" "}
              <strong className="text-foreground">Investidor</strong> acessa a área do investidor (<code>/investidor</code>).
              O mesmo CPF pode ter os dois acessos. A autenticação real (login) entra na Fase 2 — por ora a senha é um placeholder.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border bg-background/40">
                  <th className="py-3 pl-5 pr-4 font-semibold">Usuário</th>
                  <th className="py-3 px-4 font-semibold w-36">Papel</th>
                  <th className="py-3 px-4 font-semibold w-32 text-center">Status</th>
                  <th className="py-3 px-4 font-semibold w-28 text-center">Senha</th>
                  <th className="py-3 pl-4 pr-5 font-semibold w-44 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-[13px] text-muted-foreground">
                      Carregando…
                    </td>
                  </tr>
                )}
                {!loading && usuarios.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-[13px] text-muted-foreground">
                      Nenhum usuário cadastrado.
                    </td>
                  </tr>
                )}
                {usuarios.map((u) => (
                  <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
                    <td className="py-4 pl-5 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-[13px] font-semibold text-foreground">{u.nome}</div>
                          <div className="text-[12px] text-muted-foreground inline-flex items-center gap-1">
                            <Mail className="h-3 w-3" />{u.email}
                            {u.cpf ? <span className="ml-2 tabular-nums">· {u.cpf}</span> : null}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={cn("inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-bold uppercase tracking-wider", PAPEL_TINT[u.papel])}>
                        {PAPEL_LABEL[u.papel]}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => toggleStatus(u)}
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors",
                          u.status === "ativo"
                            ? "bg-primary/10 text-primary hover:bg-primary/15"
                            : "bg-muted text-muted-foreground hover:bg-muted/80"
                        )}
                      >
                        <Power className="h-3 w-3" />
                        {u.status === "ativo" ? "Ativo" : "Inativo"}
                      </button>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={cn("text-[11px] font-semibold", u.senhaDefinida ? "text-primary" : "text-muted-foreground")}>
                        {u.senhaDefinida ? "Definida" : "Pendente"}
                      </span>
                    </td>
                    <td className="py-4 pl-4 pr-5 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button onClick={() => setSenhaModal(u)} aria-label="Definir/resetar senha" title="Definir/resetar senha" className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                          <KeyRound className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => abrirEdicao(u)} aria-label="Editar" className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => deletar(u)} aria-label="Excluir" className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal criar/editar */}
      {editando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4" onClick={(ev) => ev.target === ev.currentTarget && fechar()}>
          <div className="w-full max-w-lg rounded-xl border border-border bg-card shadow-elevated overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-display text-base font-bold text-foreground">
                {editando === "novo" ? "Novo usuário" : "Editar usuário"}
              </h3>
              <button onClick={fechar} aria-label="Fechar" className="h-9 w-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={salvar} className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Nome</label>
                <input type="text" required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">E-mail</label>
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">CPF (opcional)</label>
                  <input type="text" inputMode="numeric" value={form.cpf} onChange={(e) => setForm({ ...form, cpf: formatCpf(e.target.value) })} placeholder="000.000.000-00" className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Papel</label>
                  <select value={form.papel} onChange={(e) => setForm({ ...form, papel: e.target.value as PapelUsuario })} className="w-full rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15">
                    <option value="investidor">Investidor</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.status === "ativo"} onChange={(e) => setForm({ ...form, status: e.target.checked ? "ativo" : "inativo" })} className="rounded border-input text-primary focus:ring-primary/30" />
                  <span className="text-[13px] text-foreground">Usuário ativo</span>
                </label>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button type="button" onClick={fechar} className="px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">Cancelar</button>
                <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-[12px] font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary-deep transition-colors">
                  <Save className="h-3.5 w-3.5" />Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal senha */}
      {senhaModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm p-4"
          onClick={(ev) => ev.target === ev.currentTarget && fecharModalSenha()}
        >
          <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-elevated overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="font-display text-base font-bold text-foreground inline-flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-primary" />
                {senhaModal.senhaDefinida ? "Resetar senha" : "Definir senha"}
              </h3>
              <button
                onClick={fecharModalSenha}
                aria-label="Fechar"
                className="h-9 w-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <p className="text-[13px] text-muted-foreground">
                Definindo nova senha para{" "}
                <strong className="text-foreground">{senhaModal.nome}</strong> (
                <span className="font-mono">{senhaModal.email}</span>).
              </p>
              <div className="relative">
                <input
                  type={verSenha ? "text" : "password"}
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  placeholder="Nova senha (mín. 6 caracteres)"
                  autoFocus
                  className="w-full rounded-md border border-input bg-background pl-3 pr-10 py-2 text-[14px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                />
                <button
                  type="button"
                  onClick={() => setVerSenha((v) => !v)}
                  aria-label={verSenha ? "Ocultar senha" : "Mostrar senha"}
                  tabIndex={-1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  {verSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {erroSenha && (
                <div className="flex items-start gap-2 rounded-md bg-destructive/10 border border-destructive/20 px-3 py-2 text-[12px] text-destructive">
                  <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  {erroSenha}
                </div>
              )}
              <p className="text-[11px] text-muted-foreground">
                A senha será sincronizada com o login real do Supabase Auth. O
                usuário poderá entrar imediatamente com a nova senha.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
                <button
                  onClick={fecharModalSenha}
                  disabled={salvandoSenha}
                  className="px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={salvarSenha}
                  disabled={salvandoSenha}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-[12px] font-bold uppercase tracking-wider text-primary-foreground hover:bg-primary-deep transition-colors disabled:opacity-60"
                >
                  <Save className="h-3.5 w-3.5" />
                  {salvandoSenha ? "Salvando..." : "Salvar senha"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

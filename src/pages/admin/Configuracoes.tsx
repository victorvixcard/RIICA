import { useState } from "react";
import {
  Globe,
  Mail,
  MessageCircle,
  Bell,
  Users as UsersIcon,
  Palette,
  Shield,
  CreditCard,
  Check,
  ExternalLink,
} from "lucide-react";
import { Topbar } from "@/components/admin/layout/Topbar";
import { cn } from "@/lib/utils";

type Aba =
  | "geral"
  | "integracoes"
  | "equipe"
  | "branding"
  | "seguranca"
  | "billing";

const ABAS: { id: Aba; label: string; icon: typeof Globe }[] = [
  { id: "geral", label: "Geral", icon: Globe },
  { id: "integracoes", label: "Integrações", icon: Mail },
  { id: "equipe", label: "Equipe", icon: UsersIcon },
  { id: "branding", label: "Branding", icon: Palette },
  { id: "seguranca", label: "Segurança", icon: Shield },
  { id: "billing", label: "Billing", icon: CreditCard },
];

const TIME = [
  { nome: "Vitão Uli", email: "vitao@grupoica.com.br", role: "Owner" },
  {
    nome: "Renan Giacomin",
    email: "renan@vixsofthouse.com.br",
    role: "Administrador",
  },
  {
    nome: "Marina Costa",
    email: "marina.costa@grupoica.com.br",
    role: "Editor",
  },
  {
    nome: "Pedro Aguiar",
    email: "pedro.aguiar@grupoica.com.br",
    role: "Visualizador",
  },
];

const INTEGRACOES = [
  {
    id: "resend",
    nome: "Resend",
    descricao: "Envio transacional de e-mails (releases, comunicados)",
    icon: Mail,
    conectado: true,
    detalhe: "ri@grupoica.com.br · DKIM/SPF/DMARC verificados",
  },
  {
    id: "meta",
    nome: "Meta Cloud API (WhatsApp)",
    descricao: "Disparo de mensagens via WhatsApp Business",
    icon: MessageCircle,
    conectado: true,
    detalhe: "+55 27 99999-0000 · 6 templates aprovados",
  },
  {
    id: "firebase",
    nome: "Firebase Cloud Messaging",
    descricao: "Notificações push para o portal e área do investidor",
    icon: Bell,
    conectado: false,
    detalhe: "Aguardando configuração de credenciais",
  },
  {
    id: "s3",
    nome: "AWS S3 / Cloudflare R2",
    descricao: "Armazenamento de documentos (releases, atas, formulários)",
    icon: Globe,
    conectado: true,
    detalhe: "Bucket: ica-ri-documentos · região sa-east-1",
  },
  {
    id: "sentry",
    nome: "Sentry",
    descricao: "Monitoramento de erros e performance",
    icon: Shield,
    conectado: false,
    detalhe: "Recomendado para ambiente de produção",
  },
];

export function Configuracoes() {
  const [aba, setAba] = useState<Aba>("geral");

  return (
    <>
      <Topbar
        title="Configurações"
        subtitle="Integrações, equipe, branding e segurança do painel R.I."
      />

      <main className="flex-1 px-6 lg:px-10 py-8">
        <div className="max-w-[1200px] mx-auto">
          {/* Abas */}
          <div className="flex items-center gap-1 mb-6 border-b border-border overflow-x-auto">
            {ABAS.map((a) => (
              <button
                key={a.id}
                onClick={() => setAba(a.id)}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-3 text-[12px] font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap",
                  aba === a.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                <a.icon className="h-3.5 w-3.5" />
                {a.label}
              </button>
            ))}
          </div>

          {aba === "geral" && <AbaGeral />}
          {aba === "integracoes" && <AbaIntegracoes />}
          {aba === "equipe" && <AbaEquipe />}
          {aba === "branding" && <AbaBranding />}
          {aba === "seguranca" && <AbaSeguranca />}
          {aba === "billing" && <AbaBilling />}
        </div>
      </main>
    </>
  );
}

function Card({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 mb-4">
      <h2 className="font-display text-base font-bold text-foreground">{title}</h2>
      {description && (
        <p className="text-[12px] text-muted-foreground mt-1">{description}</p>
      )}
      <div className="mt-5">{children}</div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 last:mb-0">
      <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
        {label}
      </label>
      {children}
      {hint && (
        <p className="mt-1.5 text-[11px] text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

function AbaGeral() {
  return (
    <>
      <Card
        title="Identificação da operação"
        description="Dados gerais do painel R.I. exibidos em e-mails e portal."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nome do emissor">
            <input
              defaultValue="Grupo ICA — Relações com Investidores"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-[13px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </Field>
          <Field label="Domínio do portal R.I.">
            <input
              defaultValue="ri.grupoica.com.br"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-[13px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </Field>
          <Field label="CNPJ">
            <input
              defaultValue="00.000.000/0001-00"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-[13px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </Field>
          <Field label="E-mail de contato">
            <input
              defaultValue="ri@grupoica.com.br"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-[13px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </Field>
        </div>
      </Card>

      <Card title="Fuso horário e formato">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Fuso horário">
            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-[13px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15">
              <option>America/Sao_Paulo (UTC-3)</option>
              <option>America/Bahia (UTC-3)</option>
            </select>
          </Field>
          <Field label="Idioma padrão">
            <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-[13px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15">
              <option>Português (Brasil)</option>
              <option>English (US)</option>
            </select>
          </Field>
        </div>
      </Card>
    </>
  );
}

function AbaIntegracoes() {
  return (
    <>
      <Card
        title="Provedores conectados"
        description="Serviços externos que alimentam disparos, armazenamento e monitoria."
      >
        <ul className="space-y-3">
          {INTEGRACOES.map((i) => (
            <li
              key={i.id}
              className="flex items-start gap-4 p-4 rounded-lg border border-border bg-background"
            >
              <div
                className={cn(
                  "h-10 w-10 rounded-md flex items-center justify-center shrink-0",
                  i.conectado
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <i.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-display text-sm font-bold text-foreground">
                    {i.nome}
                  </span>
                  {i.conectado ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                      <Check className="h-3 w-3" />
                      Conectado
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                      Desconectado
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[12px] text-muted-foreground">
                  {i.descricao}
                </p>
                <p className="mt-2 text-[11px] text-foreground/80 font-mono">
                  {i.detalhe}
                </p>
              </div>
              <button
                onClick={() =>
                  alert("Configurações detalhadas virão com o backend")
                }
                className="text-[11px] font-bold uppercase tracking-wider text-primary hover:text-primary-deep transition-colors shrink-0"
              >
                {i.conectado ? "Configurar" : "Conectar"}
              </button>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}

function AbaEquipe() {
  return (
    <Card
      title="Equipe do RI"
      description="Quem tem acesso ao painel e suas permissões."
    >
      <ul className="divide-y divide-border">
        {TIME.map((u) => (
          <li
            key={u.email}
            className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
          >
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-sm shrink-0">
              {u.nome
                .split(" ")
                .map((p) => p[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-semibold text-foreground">
                {u.nome}
              </div>
              <div className="text-[12px] text-muted-foreground">{u.email}</div>
            </div>
            <span
              className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider",
                u.role === "Owner"
                  ? "bg-primary/15 text-primary-deep"
                  : u.role === "Administrador"
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
              )}
            >
              {u.role}
            </span>
          </li>
        ))}
      </ul>
      <button className="mt-5 inline-flex items-center gap-2 rounded-md border border-dashed border-border bg-background px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-foreground hover:border-primary hover:text-primary transition-colors w-full justify-center">
        + Convidar membro
      </button>
    </Card>
  );
}

function AbaBranding() {
  return (
    <Card
      title="Identidade visual"
      description="Cores e logos aplicadas em e-mails, portal e templates."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Field label="Cor primária">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-md bg-primary border border-border" />
            <input
              defaultValue="#0E6231"
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-[13px] text-foreground font-mono outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>
        </Field>
        <Field label="Background">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-md bg-background border border-border" />
            <input
              defaultValue="#FAFAF7"
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-[13px] text-foreground font-mono outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>
        </Field>
        <Field label="Superfície escura (sidebar/footer)">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-md bg-surface-dark border border-border" />
            <input
              defaultValue="#14161A"
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-[13px] text-foreground font-mono outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>
        </Field>
      </div>
      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Tipografia — Display">
          <input
            defaultValue="Plus Jakarta Sans"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-[13px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </Field>
        <Field label="Tipografia — Body">
          <input
            defaultValue="Inter"
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-[13px] text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </Field>
      </div>
    </Card>
  );
}

function AbaSeguranca() {
  return (
    <Card
      title="Políticas de acesso"
      description="2FA obrigatório, expiração de sessão, IP allowlist."
    >
      <div className="space-y-4">
        <Toggle
          label="2FA obrigatório para todos os administradores"
          defaultOn
          hint="Recomendado para qualquer operação que envia comunicações em massa."
        />
        <Toggle
          label="Expirar sessão após 8h de inatividade"
          defaultOn
        />
        <Toggle
          label="Notificar por e-mail logins de novo IP"
          defaultOn
        />
        <Toggle
          label="Bloquear acesso fora do Brasil (IP allowlist)"
          defaultOn={false}
        />
        <Toggle
          label="Auditoria de todas as ações (log imutável)"
          defaultOn
          hint="Obrigatório para compliance CVM/COAF."
        />
      </div>
    </Card>
  );
}

function AbaBilling() {
  return (
    <>
      <Card
        title="Plano atual"
        description="ICA — Plano Corporativo Anual"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Metric label="Mensagens incluídas" value="50.000 / mês" />
          <Metric label="Usadas este mês" value="42.180" />
          <Metric label="Próximo ciclo" value="01.06.2026" />
        </div>
        <button className="mt-5 inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-[12px] font-bold uppercase tracking-wider text-foreground hover:border-primary hover:text-primary transition-colors">
          <ExternalLink className="h-3.5 w-3.5" />
          Ver faturas
        </button>
      </Card>

      <Card title="Consumo por canal" description="Maio/2026 (parcial)">
        <ul className="space-y-2">
          {[
            { canal: "E-mail", usado: 28400, limite: 40000 },
            { canal: "WhatsApp", usado: 9580, limite: 8000 },
            { canal: "Push", usado: 4200, limite: 999999 },
          ].map((c) => {
            const pct = Math.min(100, (c.usado / c.limite) * 100);
            const excesso = c.usado > c.limite;
            return (
              <li
                key={c.canal}
                className="p-3 rounded-md border border-border bg-background"
              >
                <div className="flex items-center justify-between text-[13px] mb-2">
                  <span className="font-semibold text-foreground">{c.canal}</span>
                  <span
                    className={cn(
                      "tabular-nums",
                      excesso ? "text-destructive font-bold" : "text-muted-foreground"
                    )}
                  >
                    {c.usado.toLocaleString("pt-BR")}{" "}
                    {c.limite < 999999 && `/ ${c.limite.toLocaleString("pt-BR")}`}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      excesso ? "bg-destructive" : "bg-primary"
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                {excesso && (
                  <div className="mt-1.5 text-[11px] text-destructive">
                    Limite excedido em{" "}
                    {(c.usado - c.limite).toLocaleString("pt-BR")} mensagens.
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </Card>
    </>
  );
}

function Toggle({
  label,
  defaultOn,
  hint,
}: {
  label: string;
  defaultOn: boolean;
  hint?: string;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-start gap-4">
      <button
        onClick={() => setOn(!on)}
        className={cn(
          "relative w-11 h-6 rounded-full transition-colors shrink-0",
          on ? "bg-primary" : "bg-muted"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-soft transition-transform",
            on ? "translate-x-5" : "translate-x-0.5"
          )}
        />
      </button>
      <div className="flex-1">
        <div className="text-[13px] font-medium text-foreground">{label}</div>
        {hint && (
          <p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-background p-4">
      <div className="font-display text-xl font-extrabold text-foreground">
        {value}
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

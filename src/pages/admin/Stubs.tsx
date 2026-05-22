import { Topbar } from "@/components/admin/layout/Topbar";
import { Construction } from "lucide-react";

function ComingSoon({ title, descricao }: { title: string; descricao: string }) {
  return (
    <>
      <Topbar title={title} subtitle={descricao} />
      <main className="flex-1 px-6 lg:px-10 py-16">
        <div className="max-w-md mx-auto rounded-xl border border-border bg-card p-10 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Construction className="h-6 w-6" />
          </div>
          <h2 className="mt-5 font-display text-lg font-bold text-foreground">
            Em construção
          </h2>
          <p className="mt-2 text-[13px] text-muted-foreground leading-relaxed">
            Esta tela vem na próxima entrega. O Dashboard já está totalmente
            funcional para você navegar e validar a estrutura geral.
          </p>
        </div>
      </main>
    </>
  );
}

export const Campanhas = () => (
  <ComingSoon
    title="Campanhas"
    descricao="Disparo de mensagens multicanal — email, WhatsApp, push"
  />
);

export const Templates = () => (
  <ComingSoon
    title="Templates"
    descricao="Modelos reutilizáveis de mensagens por canal"
  />
);

export const Historico = () => (
  <ComingSoon
    title="Histórico"
    descricao="Auditoria completa de envios e ações administrativas"
  />
);

export const Configuracoes = () => (
  <ComingSoon
    title="Configurações"
    descricao="Domínios, integrações, equipe e permissões"
  />
);

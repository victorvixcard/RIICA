// Aviso legal — fecha a home com texto discreto e compacto antes do Footer.
// CNPJ e endereço/razão social vêm do CMS (Conteúdo > Rodapé) — single source
// of truth: editar lá atualiza aqui, o rodapé e qualquer outro lugar que
// referencie esses dados.
import { useContent } from "@/store/content";

export function AvisoLegal() {
  const { state } = useContent();
  const { footerCnpj, footerEndereco } = state.config;

  // Monta a assinatura institucional a partir do CMS, separada por " · ".
  const assinatura = [footerEndereco, footerCnpj].filter(Boolean).join(" · ");

  return (
    <section className="bg-background border-t border-border">
      <div className="mx-auto max-w-[1100px] px-6 lg:px-10 py-10 lg:py-12">
        <div className="flex items-start gap-3 lg:gap-4">
          <span className="mt-1 inline-block h-px w-6 shrink-0 bg-primary/60" />
          <div className="min-w-0">
            <h3 className="font-display text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Aviso Legal
            </h3>
            <p className="mt-2 text-[12px] lg:text-[12.5px] leading-relaxed text-muted-foreground">
              Este portal é destinado exclusivamente a fins informativos e de
              transparência com investidores e stakeholders do Grupo ICA. As
              informações aqui contidas não configuram oferta pública de valores
              mobiliários nos termos da Lei nº 6.385/76 e normas da Comissão de
              Valores Mobiliários. Declarações sobre perspectivas futuras estão
              sujeitas a riscos e incertezas que podem fazer com que os resultados
              reais difiram materialmente das expectativas.
              {assinatura && (
                <>
                  {" "}
                  <span className="text-foreground/80">{assinatura}.</span>
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

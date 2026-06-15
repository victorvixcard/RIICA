import { supabase } from "@/lib/supabase";
import { removerSeNossoStorage } from "@/lib/api/storage";
import type {
  Comunicado,
  ContentState,
  Documento,
  Evento,
  KitTrimestre,
  TextosInstitucionais,
  Kpi,
  TickerSimbolo,
  NavItem,
  QuickAction,
  FooterColuna,
  RedeSocial,
  SiteConfig,
  Faq,
  FatoRelevante,
} from "@/store/types";

// ============================================================
// Linhas do banco (snake_case) — mapeadas para os tipos camelCase
// ============================================================
interface DocumentoRow {
  id: string;
  titulo: string;
  categoria: Documento["categoria"];
  periodo: string | null;
  arquivo: string;
  tamanho: number | null;
  data_publicacao: string;
  publico: boolean;
  tag: string | null;
}

interface ComunicadoRow {
  id: string;
  data: string;
  titulo: string;
  resumo: string | null;
  documento_id: string | null;
  link: string | null;
  destaque: boolean;
  publicado: boolean;
}

interface EventoRow {
  id: string;
  data: string;
  hora: string;
  titulo: string;
  tipo: Evento["tipo"];
  local: string | null;
  link_inscricao: string | null;
  publicado: boolean;
}

interface FatoRelevanteRow {
  id: string;
  data: string;
  tag: string;
  titulo: string;
  resumo: string | null;
  url: string | null;
  publicado: boolean;
  ordem: number;
}

// ============================================================
// Mappers row -> domínio
// ============================================================
function toDocumento(r: DocumentoRow): Documento {
  return {
    id: r.id,
    titulo: r.titulo,
    categoria: r.categoria,
    periodo: r.periodo ?? undefined,
    arquivo: r.arquivo,
    tamanho: r.tamanho ?? undefined,
    dataPublicacao: r.data_publicacao,
    publico: r.publico,
    tag: r.tag ?? undefined,
  };
}

function toComunicado(r: ComunicadoRow): Comunicado {
  return {
    id: r.id,
    data: r.data,
    titulo: r.titulo,
    resumo: r.resumo ?? undefined,
    documentoId: r.documento_id ?? undefined,
    link: r.link ?? undefined,
    destaque: r.destaque,
    publicado: r.publicado,
  };
}

function toEvento(r: EventoRow): Evento {
  return {
    id: r.id,
    data: r.data,
    hora: r.hora,
    titulo: r.titulo,
    tipo: r.tipo,
    local: r.local ?? undefined,
    linkInscricao: r.link_inscricao ?? undefined,
    publicado: r.publicado,
  };
}

function toFatoRelevante(r: FatoRelevanteRow): FatoRelevante {
  return {
    id: r.id,
    data: r.data,
    tag: r.tag,
    titulo: r.titulo,
    resumo: r.resumo ?? undefined,
    url: r.url ?? undefined,
    publicado: r.publicado,
    ordem: r.ordem,
  };
}

function fromFatoRelevante(f: Omit<FatoRelevante, "id"> | FatoRelevante) {
  return {
    data: f.data,
    tag: f.tag,
    titulo: f.titulo,
    resumo: f.resumo ?? null,
    url: f.url ?? null,
    publicado: f.publicado,
    ordem: f.ordem,
  };
}

// ============================================================
// Mappers domínio -> row (para insert/update)
// ============================================================
function fromDocumento(d: Omit<Documento, "id"> | Documento) {
  return {
    titulo: d.titulo,
    categoria: d.categoria,
    periodo: d.periodo ?? null,
    arquivo: d.arquivo,
    tamanho: d.tamanho ?? null,
    data_publicacao: d.dataPublicacao,
    publico: d.publico,
    tag: d.tag ?? null,
  };
}

function fromComunicado(c: Omit<Comunicado, "id"> | Comunicado) {
  return {
    data: c.data,
    titulo: c.titulo,
    resumo: c.resumo ?? null,
    documento_id: c.documentoId ?? null,
    link: c.link ?? null,
    destaque: c.destaque,
    publicado: c.publicado,
  };
}

function fromEvento(e: Omit<Evento, "id"> | Evento) {
  return {
    data: e.data,
    hora: e.hora,
    titulo: e.titulo,
    tipo: e.tipo,
    local: e.local ?? null,
    link_inscricao: e.linkInscricao ?? null,
    publicado: e.publicado,
  };
}

// ============================================================
// LEITURA — monta o ContentState completo
// ============================================================
export async function getContent(): Promise<ContentState> {
  const [
    documentosRes,
    comunicadosRes,
    eventosRes,
    kitRes,
    textosRes,
    kpisRes,
    tickerRes,
    navRes,
    quickRes,
    footerColsRes,
    footerLinksRes,
    redesRes,
    configRes,
    faqsRes,
    fatosRelevantesRes,
  ] = await Promise.all([
    supabase.from("documentos").select("*").order("data_publicacao", { ascending: false }),
    supabase.from("comunicados").select("*").order("data", { ascending: false }),
    supabase.from("eventos").select("*").order("data", { ascending: true }),
    supabase.from("kit_trimestre").select("*").eq("ativo", true).limit(1).maybeSingle(),
    supabase.from("site_textos").select("*").eq("id", 1).maybeSingle(),
    supabase.from("kpis").select("*").order("ordem", { ascending: true }),
    supabase.from("ticker").select("*").order("ordem", { ascending: true }),
    supabase.from("nav_items").select("*").order("ordem", { ascending: true }),
    supabase.from("quick_actions").select("*").order("ordem", { ascending: true }),
    supabase.from("footer_colunas").select("*").order("ordem", { ascending: true }),
    supabase.from("footer_links").select("*").order("ordem", { ascending: true }),
    supabase.from("redes_sociais").select("*").order("ordem", { ascending: true }),
    supabase.from("site_config").select("*").eq("id", 1).maybeSingle(),
    supabase.from("faqs").select("*").order("ordem", { ascending: true }),
    supabase
      .from("fatos_relevantes")
      .select("*")
      .order("data", { ascending: false }),
  ]);

  // Resultado opcional — a tabela fatos_relevantes pode ainda não existir
  // num ambiente onde a migration não foi aplicada (resiliência durante rollout).
  const fatosResData = fatosRelevantesRes.error ? [] : (fatosRelevantesRes.data ?? []);
  if (fatosRelevantesRes.error) {
    console.warn(
      "[content] fatos_relevantes indisponível (talvez a migration ainda não foi aplicada):",
      fatosRelevantesRes.error.message
    );
  }

  const erros = [
    documentosRes.error,
    comunicadosRes.error,
    eventosRes.error,
    kitRes.error,
    textosRes.error,
    kpisRes.error,
    tickerRes.error,
    navRes.error,
    quickRes.error,
    footerColsRes.error,
    footerLinksRes.error,
    redesRes.error,
    configRes.error,
    faqsRes.error,
  ].filter(Boolean);
  if (erros.length) throw erros[0];

  // Kit + filhos
  let kitAtual: KitTrimestre = {
    trimestre: "",
    ano: new Date().getFullYear(),
    documentosDestaqueIds: [],
    linksAuxiliares: [],
  };
  if (kitRes.data) {
    const kitId = kitRes.data.id as string;
    const [kitDocsRes, kitLinksRes] = await Promise.all([
      supabase
        .from("kit_documentos")
        .select("documento_id, ordem")
        .eq("kit_id", kitId)
        .order("ordem", { ascending: true }),
      supabase
        .from("kit_links")
        .select("id, label, url, ordem")
        .eq("kit_id", kitId)
        .order("ordem", { ascending: true }),
    ]);
    kitAtual = {
      trimestre: kitRes.data.trimestre,
      ano: kitRes.data.ano,
      documentosDestaqueIds: (kitDocsRes.data ?? []).map((d) => d.documento_id),
      linksAuxiliares: (kitLinksRes.data ?? []).map((l) => ({
        id: l.id,
        label: l.label,
        url: l.url,
      })),
    };
  }

  const textos: TextosInstitucionais = {
    hero: textosRes.data?.hero,
    purpose: textosRes.data?.purpose,
    kpis: (kpisRes.data ?? []) as Kpi[],
    ticker: (tickerRes.data ?? []) as TickerSimbolo[],
  };

  // Agrupa links por coluna do rodapé
  const linksPorColuna = new Map<string, { id: string; label: string; url: string }[]>();
  for (const l of footerLinksRes.data ?? []) {
    const arr = linksPorColuna.get(l.coluna_id) ?? [];
    arr.push({ id: l.id, label: l.label, url: l.url });
    linksPorColuna.set(l.coluna_id, arr);
  }
  const footerColunas: FooterColuna[] = (footerColsRes.data ?? []).map((c) => ({
    id: c.id,
    titulo: c.titulo,
    links: linksPorColuna.get(c.id) ?? [],
  }));

  const config: SiteConfig = {
    institucionalUrl: configRes.data?.institucional_url ?? "#",
    footerDescricao: configRes.data?.footer_descricao ?? "",
    footerCnpj: configRes.data?.footer_cnpj ?? "",
    footerEndereco: configRes.data?.footer_endereco ?? "",
    footerCopyright: configRes.data?.footer_copyright ?? "",
  };

  return {
    version: 1,
    documentos: (documentosRes.data as DocumentoRow[]).map(toDocumento),
    comunicados: (comunicadosRes.data as ComunicadoRow[]).map(toComunicado),
    eventos: (eventosRes.data as EventoRow[]).map(toEvento),
    kitAtual,
    textos,
    navItems: (navRes.data ?? []) as NavItem[],
    quickActions: (quickRes.data ?? []) as QuickAction[],
    footerColunas,
    redesSociais: (redesRes.data ?? []) as RedeSocial[],
    config,
    faqs: (faqsRes.data ?? []) as Faq[],
    fatosRelevantes: (fatosResData as FatoRelevanteRow[]).map(toFatoRelevante),
  };
}

// ============================================================
// CRUD — Fatos Relevantes
// ============================================================
export async function createFatoRelevante(payload: Omit<FatoRelevante, "id">) {
  const { error } = await supabase.from("fatos_relevantes").insert(fromFatoRelevante(payload));
  if (error) throw error;
}
export async function updateFatoRelevante(f: FatoRelevante) {
  // Detecta troca de PDF: se a URL anterior era do nosso Storage e mudou,
  // remove o arquivo antigo para não acumular órfãos.
  const { data: anterior } = await supabase
    .from("fatos_relevantes")
    .select("url")
    .eq("id", f.id)
    .maybeSingle();
  const urlAntiga = anterior?.url as string | null | undefined;

  const { error } = await supabase
    .from("fatos_relevantes")
    .update(fromFatoRelevante(f))
    .eq("id", f.id);
  if (error) throw error;

  if (urlAntiga && urlAntiga !== f.url) {
    await removerSeNossoStorage(urlAntiga);
  }
}
export async function deleteFatoRelevante(id: string) {
  // Captura URL antes de deletar para limpar o PDF anexo no Storage.
  const { data: anterior } = await supabase
    .from("fatos_relevantes")
    .select("url")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("fatos_relevantes").delete().eq("id", id);
  if (error) throw error;

  await removerSeNossoStorage(anterior?.url as string | null | undefined);
}

// ============================================================
// CRUD — Comunicados
// ============================================================
export async function createComunicado(payload: Omit<Comunicado, "id">) {
  const { error } = await supabase.from("comunicados").insert(fromComunicado(payload));
  if (error) throw error;
}
export async function updateComunicado(c: Comunicado) {
  const { error } = await supabase.from("comunicados").update(fromComunicado(c)).eq("id", c.id);
  if (error) throw error;
}
export async function deleteComunicado(id: string) {
  const { error } = await supabase.from("comunicados").delete().eq("id", id);
  if (error) throw error;
}

// ============================================================
// CRUD — Eventos
// ============================================================
export async function createEvento(payload: Omit<Evento, "id">) {
  const { error } = await supabase.from("eventos").insert(fromEvento(payload));
  if (error) throw error;
}
export async function updateEvento(e: Evento) {
  const { error } = await supabase.from("eventos").update(fromEvento(e)).eq("id", e.id);
  if (error) throw error;
}
export async function deleteEvento(id: string) {
  const { error } = await supabase.from("eventos").delete().eq("id", id);
  if (error) throw error;
}

// ============================================================
// CRUD — Documentos
// ============================================================
export async function createDocumento(payload: Omit<Documento, "id">) {
  const { error } = await supabase.from("documentos").insert(fromDocumento(payload));
  if (error) throw error;
}
export async function updateDocumento(d: Documento) {
  // Detecta troca de arquivo: se o anterior era do nosso Storage e mudou,
  // remove o arquivo antigo para não acumular órfãos.
  const { data: anterior } = await supabase
    .from("documentos")
    .select("arquivo")
    .eq("id", d.id)
    .maybeSingle();
  const arquivoAntigo = anterior?.arquivo as string | null | undefined;

  const { error } = await supabase.from("documentos").update(fromDocumento(d)).eq("id", d.id);
  if (error) throw error;

  if (arquivoAntigo && arquivoAntigo !== d.arquivo) {
    await removerSeNossoStorage(arquivoAntigo);
  }
}
export async function deleteDocumento(id: string) {
  // Captura URL do arquivo antes de deletar para limpar o PDF no Storage.
  const { data: anterior } = await supabase
    .from("documentos")
    .select("arquivo")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("documentos").delete().eq("id", id);
  if (error) throw error;

  await removerSeNossoStorage(anterior?.arquivo as string | null | undefined);
}

// ============================================================
// Kit do Investidor — opera sobre o kit ativo
// ============================================================
export async function updateKit(kit: KitTrimestre) {
  const { data: kitRow, error: kitErr } = await supabase
    .from("kit_trimestre")
    .select("id")
    .eq("ativo", true)
    .limit(1)
    .maybeSingle();
  if (kitErr) throw kitErr;

  let kitId = kitRow?.id as string | undefined;
  if (!kitId) {
    const { data: novo, error } = await supabase
      .from("kit_trimestre")
      .insert({ trimestre: kit.trimestre, ano: kit.ano, ativo: true })
      .select("id")
      .single();
    if (error) throw error;
    kitId = novo.id;
  } else {
    const { error } = await supabase
      .from("kit_trimestre")
      .update({ trimestre: kit.trimestre, ano: kit.ano })
      .eq("id", kitId);
    if (error) throw error;
  }

  // Substitui documentos em destaque
  await supabase.from("kit_documentos").delete().eq("kit_id", kitId);
  if (kit.documentosDestaqueIds.length) {
    const { error } = await supabase.from("kit_documentos").insert(
      kit.documentosDestaqueIds.map((documento_id, ordem) => ({
        kit_id: kitId,
        documento_id,
        ordem,
      }))
    );
    if (error) throw error;
  }

  // Substitui links auxiliares
  await supabase.from("kit_links").delete().eq("kit_id", kitId);
  if (kit.linksAuxiliares.length) {
    const { error } = await supabase.from("kit_links").insert(
      kit.linksAuxiliares.map((l, ordem) => ({
        kit_id: kitId,
        label: l.label,
        url: l.url,
        ordem,
      }))
    );
    if (error) throw error;
  }
}

// ============================================================
// Textos institucionais / KPIs / Ticker
// ============================================================
export async function updateTextos(partial: Partial<TextosInstitucionais>) {
  if (partial.hero || partial.purpose) {
    const patch: Record<string, unknown> = { id: 1 };
    if (partial.hero) patch.hero = partial.hero;
    if (partial.purpose) patch.purpose = partial.purpose;
    const { error } = await supabase.from("site_textos").upsert(patch);
    if (error) throw error;
  }

  if (partial.kpis) {
    await supabase.from("kpis").delete().neq("id", "");
    const { error } = await supabase.from("kpis").insert(
      partial.kpis.map((k, ordem) => ({ valor: k.valor, label: k.label, ordem }))
    );
    if (error) throw error;
  }

  if (partial.ticker) {
    await supabase.from("ticker").delete().neq("id", "");
    const { error } = await supabase.from("ticker").insert(
      partial.ticker.map((t, ordem) => ({
        simbolo: t.simbolo,
        preco: t.preco,
        variacao: t.variacao,
        positivo: t.positivo,
        ordem,
      }))
    );
    if (error) throw error;
  }
}

// ============================================================
// Navegação (header) — substitui a lista inteira
// ============================================================
export async function saveNavItems(items: NavItem[]) {
  await supabase.from("nav_items").delete().neq("id", "");
  if (!items.length) return;
  const { error } = await supabase.from("nav_items").insert(
    items.map((n, ordem) => ({
      label: n.label,
      url: n.url,
      ordem,
      visivel: n.visivel,
    }))
  );
  if (error) throw error;
}

// ============================================================
// Ações rápidas — substitui a lista inteira
// ============================================================
export async function saveQuickActions(items: QuickAction[]) {
  await supabase.from("quick_actions").delete().neq("id", "");
  if (!items.length) return;
  const { error } = await supabase.from("quick_actions").insert(
    items.map((q, ordem) => ({
      label: q.label,
      href: q.href,
      ordem,
      visivel: q.visivel,
    }))
  );
  if (error) throw error;
}

// ============================================================
// Rodapé (colunas + links) — substitui tudo
// ============================================================
export async function saveFooter(colunas: FooterColuna[]) {
  // on delete cascade limpa os links junto
  await supabase.from("footer_colunas").delete().neq("id", "");
  for (let i = 0; i < colunas.length; i++) {
    const col = colunas[i];
    const { data: novaCol, error: colErr } = await supabase
      .from("footer_colunas")
      .insert({ titulo: col.titulo, ordem: i })
      .select("id")
      .single();
    if (colErr) throw colErr;
    if (col.links.length) {
      const { error: linkErr } = await supabase.from("footer_links").insert(
        col.links.map((l, ordem) => ({
          coluna_id: novaCol.id,
          label: l.label,
          url: l.url || "#",
          ordem,
        }))
      );
      if (linkErr) throw linkErr;
    }
  }
}

// ============================================================
// Redes sociais — substitui a lista inteira
// ============================================================
export async function saveRedesSociais(items: RedeSocial[]) {
  await supabase.from("redes_sociais").delete().neq("id", "");
  if (!items.length) return;
  const { error } = await supabase.from("redes_sociais").insert(
    items.map((r, ordem) => ({ tipo: r.tipo, url: r.url, ordem }))
  );
  if (error) throw error;
}

// ============================================================
// Configuração institucional (singleton)
// ============================================================
export async function updateConfig(config: SiteConfig) {
  const { error } = await supabase.from("site_config").upsert({
    id: 1,
    institucional_url: config.institucionalUrl,
    footer_descricao: config.footerDescricao,
    footer_cnpj: config.footerCnpj,
    footer_endereco: config.footerEndereco,
    footer_copyright: config.footerCopyright,
  });
  if (error) throw error;
}

// ============================================================
// FAQ — CRUD individual
// ============================================================
function fromFaq(f: Omit<Faq, "id"> | Faq) {
  return {
    pergunta: f.pergunta,
    resposta: f.resposta,
    categoria: f.categoria ?? null,
    ordem: f.ordem,
    publicado: f.publicado,
  };
}
export async function createFaq(payload: Omit<Faq, "id">) {
  const { error } = await supabase.from("faqs").insert(fromFaq(payload));
  if (error) throw error;
}
export async function updateFaq(f: Faq) {
  const { error } = await supabase.from("faqs").update(fromFaq(f)).eq("id", f.id);
  if (error) throw error;
}
export async function deleteFaq(id: string) {
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) throw error;
}

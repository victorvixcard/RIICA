import { supabase } from "@/lib/supabase";
import type { Template } from "@/mock/templates";

interface TemplateRow {
  id: string;
  nome: string;
  canal: Template["canal"];
  assunto: string | null;
  resumo: string;
  conteudo: string;
  tags: string[] | null;
  usos: number;
  ultima_edicao: string | null;
  ativo: boolean;
}

function toTemplate(r: TemplateRow): Template {
  return {
    id: r.id,
    nome: r.nome,
    canal: r.canal,
    assunto: r.assunto ?? undefined,
    resumo: r.resumo,
    conteudo: r.conteudo,
    tags: r.tags ?? [],
    usos: r.usos,
    ultimaEdicao: r.ultima_edicao ?? "",
    ativo: r.ativo,
  };
}

function fromTemplate(t: Omit<Template, "id"> | Template) {
  return {
    nome: t.nome,
    canal: t.canal,
    assunto: t.assunto ?? null,
    resumo: t.resumo,
    conteudo: t.conteudo,
    tags: t.tags ?? [],
    usos: t.usos,
    ultima_edicao: t.ultimaEdicao || null,
    ativo: t.ativo,
  };
}

export async function getTemplates(): Promise<Template[]> {
  const { data, error } = await supabase
    .from("templates")
    .select("*")
    .order("ultima_edicao", { ascending: false });
  if (error) throw error;
  return (data as TemplateRow[]).map(toTemplate);
}

export async function createTemplate(payload: Omit<Template, "id">) {
  const { error } = await supabase.from("templates").insert(fromTemplate(payload));
  if (error) throw error;
}

export async function updateTemplate(t: Template) {
  const { error } = await supabase.from("templates").update(fromTemplate(t)).eq("id", t.id);
  if (error) throw error;
}

export async function deleteTemplate(id: string) {
  const { error } = await supabase.from("templates").delete().eq("id", id);
  if (error) throw error;
}

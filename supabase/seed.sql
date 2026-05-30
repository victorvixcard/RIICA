-- ============================================================
-- RIICA — Seed (dados iniciais a partir dos mocks do frontend)
-- ============================================================

-- ----------------------------------------------------------------
-- DOCUMENTOS
-- ----------------------------------------------------------------
insert into public.documentos (id, titulo, categoria, periodo, arquivo, tamanho, data_publicacao, publico) values
('doc-001','Release de Resultados 1T26','release','1T26','release-1t26.pdf',1248000,'2026-05-18',true),
('doc-002','Apresentação de Resultados 1T26','apresentacao','1T26','apresentacao-1t26.pdf',3850000,'2026-05-18',true),
('doc-003','Demonstrações Financeiras Consolidadas 1T26','demonstracao','1T26','dfp-1t26.pdf',5120000,'2026-05-18',true),
('doc-004','Ata da Reunião do Conselho — 30.04.2026','ata','1T26','ata-conselho-30-04-2026.pdf',412000,'2026-04-30',true),
('doc-005','Formulário 20-F — exercício 2025','formulario','2025-Anual','20-f-2025.pdf',8420000,'2026-03-31',true),
('doc-006','Apresentação Institucional — Maio/2026','apresentacao',null,'apresentacao-institucional.pdf',6240000,'2026-05-02',true);

-- ----------------------------------------------------------------
-- COMUNICADOS
-- ----------------------------------------------------------------
insert into public.comunicados (id, data, titulo, resumo, documento_id, destaque, publicado) values
('com-001','2026-05-19','Grupo ICA anuncia novo programa de dividendos extraordinários','Conselho aprovou distribuição de R$ 0,42 por ação a ser paga em 30/06.',null,true,false),
('com-002','2026-05-18','Grupo ICA divulga resultados financeiros do 1T26','Receita líquida cresceu 12,8% no comparativo anual. EBITDA ajustado de R$ 184M.','doc-001',true,false),
('com-003','2026-05-12','Comunicado ao mercado: aquisição estratégica no segmento de varejo','Aquisição de 60% da Capixaba Distribuidora aprovada pelo CADE.',null,true,false),
('com-004','2026-04-30','Reunião do Conselho de Administração — ata disponível',null,'doc-004',true,false);

-- ----------------------------------------------------------------
-- EVENTOS
-- ----------------------------------------------------------------
insert into public.eventos (id, data, hora, titulo, tipo, local, link_inscricao, publicado) values
('evt-001','2026-05-28','10h00','Teleconferência de Resultados 1T26','Conferência',null,'https://ri.icabank.com.br/teleconf',false),
('evt-002','2026-06-12','14h00','Reunião APIMEC — Vitória/ES','APIMEC','Vitória/ES',null,false),
('evt-003','2026-07-20','Dia todo','ICA Investor Day 2026','Investor Day','São Paulo/SP',null,false);

-- ----------------------------------------------------------------
-- KIT DO INVESTIDOR
-- ----------------------------------------------------------------
insert into public.kit_trimestre (id, trimestre, ano, ativo) values
('kit-1t26','1T26',2026,false);

insert into public.kit_documentos (kit_id, documento_id, ordem) values
('kit-1t26','doc-001',0),
('kit-1t26','doc-002',1),
('kit-1t26','doc-003',2);

insert into public.kit_links (id, kit_id, label, url, ordem) values
('la-1','kit-1t26','20-F','#',0),
('la-2','kit-1t26','Apresentação Institucional','#',1),
('la-3','kit-1t26','Planilha de Dados','#',2);

-- ----------------------------------------------------------------
-- TEXTOS INSTITUCIONAIS (singleton)
-- ----------------------------------------------------------------
insert into public.site_textos (id, hero, purpose) values (
  1,
  '{
    "eyebrow": "Resultados em breve",
    "tituloLinha1": "Grupo ICA divulga",
    "tituloLinha2": "resultados do 1T26",
    "descricao": "Acesse o material completo de divulgação trimestral — release, apresentação, demonstrações financeiras e teleconferência com a administração.",
    "ctaLabel": "Acessar Kit do Investidor",
    "ctaSecundarioLabel": "Formas de contato"
  }'::jsonb,
  '{
    "eyebrow": "Quem somos",
    "tituloAntes": "Nosso propósito é",
    "tituloDestaque": "transformar vidas",
    "descricao": "O Grupo ICA é um ecossistema de soluções que conecta pessoas e empresas ao que importa — com mais de três décadas construindo presença sólida no mercado capixaba e nacional.",
    "kpisEyebrow": "Grupo ICA em números"
  }'::jsonb
);

-- (KPIs e Ticker: vazios por padrão — serão preenchidos via CMS quando
--  houver informações reais para divulgar ao investidor.)

-- ----------------------------------------------------------------
-- INVESTIDORES
-- ----------------------------------------------------------------
insert into public.investidores (id, nome, cpf, email, whatsapp, status, valor_investido, ultimo_contato, origem, criado_em) values
('INV-0001','Ana Carolina Ferreira','123.456.789-00','ana.ferreira@email.com','+55 27 99999-1234','ativo',285000,'2026-05-19','CSV','2026-01-01'),
('INV-0002','Bruno Lima Pereira','987.654.321-00','bruno.lima@email.com','+55 27 98888-5678','ativo',1240000,'2026-05-18','CSV','2026-01-01'),
('INV-0003','Carla Souza Albuquerque','456.789.123-00','carla.souza@email.com','+55 11 97777-3456','pendente_confirmacao',75000,'2026-04-30','Cadastro manual','2026-01-01'),
('INV-0004','Daniel Vasconcelos Pinto','321.654.987-00','daniel.v@email.com','+55 31 96666-7890','ativo',520000,'2026-05-15','Importação SCP','2026-01-01'),
('INV-0005','Eduarda Martins Andrade','654.987.321-00','eduarda.m@email.com','+55 21 95555-1122','ativo',180000,'2026-05-12','CSV','2026-01-01'),
('INV-0006','Felipe Antunes Costa','789.123.456-00','felipe.costa@email.com','+55 27 94444-3344','bloqueado',320000,'2026-03-22','CSV','2026-01-01'),
('INV-0007','Gabriela Reis Monteiro','147.258.369-00','gabi.reis@email.com','+55 27 93333-5566','ativo',95000,'2026-05-17','CSV','2026-01-01'),
('INV-0008','Henrique Toledo Pacheco','258.369.147-00','henrique.t@email.com','+55 11 92222-7788','inativo',0,'2025-11-08','Importação SCP','2026-01-01'),
('INV-0009','Isabela Nogueira Brito','369.147.258-00','isa.brito@email.com','+55 27 91111-9900','ativo',2150000,'2026-05-20','CSV','2026-01-01'),
('INV-0010','João Pedro Mendonça','159.357.486-00','joao.m@email.com','+55 31 90000-2233','pendente_confirmacao',60000,'2026-05-08','Cadastro manual','2026-01-01'),
('INV-0011','Karina Oliveira Salles','753.951.486-00','karina.s@email.com','+55 27 99811-1100','ativo',410000,'2026-05-19','CSV','2026-01-01'),
('INV-0012','Lucas Bernardes Faria','852.741.963-00','lucas.b@email.com','+55 11 98722-3344','ativo',1850000,'2026-05-21','Indicação','2026-01-01'),
('INV-0013','Mariana Castro Lima','951.357.852-00','mariana.c@email.com','+55 31 97633-5566','ativo',130000,'2026-05-14','CSV','2026-01-01'),
('INV-0014','Nelson Diniz Almeida','246.813.579-00','nelson.d@email.com','+55 21 96544-7788','pendente_confirmacao',250000,'2026-05-05','Cadastro manual','2026-01-01'),
('INV-0015','Olívia Pacheco Ramos','135.792.468-00','olivia.p@email.com','+55 27 95455-9900','ativo',88000,'2026-05-16','CSV','2026-01-01'),
('INV-0016','Pedro Henrique Tavares','864.197.532-00','pedro.t@email.com','+55 27 94366-1122','ativo',720000,'2026-05-13','CSV','2026-01-01'),
('INV-0017','Quezia Lopes Madureira','975.318.642-00','quezia.l@email.com','+55 11 93277-3344','ativo',165000,'2026-05-19','Importação SCP','2026-01-01'),
('INV-0018','Rafael Cordeiro Bastos','486.215.973-00','rafael.c@email.com','+55 31 92188-5566','ativo',3400000,'2026-05-20','Indicação','2026-01-01'),
('INV-0019','Sabrina Vieira Coutinho','537.624.819-00','sabrina.v@email.com','+55 21 91099-7788','bloqueado',195000,'2026-02-14','CSV','2026-01-01'),
('INV-0020','Tiago Marques Filho','648.715.293-00','tiago.m@email.com','+55 27 90011-9900','ativo',240000,'2026-05-11','CSV','2026-01-01'),
('INV-0021','Úrsula Bittencourt Ribeiro','759.826.314-00','ursula.b@email.com','+55 11 99012-1234','ativo',4750000,'2026-05-21','Indicação','2026-01-01'),
('INV-0022','Vinicius Antunes Borges','861.937.425-00','vinicius.a@email.com','+55 31 98923-5678','ativo',380000,'2026-05-10','CSV','2026-01-01'),
('INV-0023','Wesley Praxedes Lobato','972.148.536-00','wesley.p@email.com','+55 21 97834-3456','pendente_confirmacao',55000,'2026-04-28','Cadastro manual','2026-01-01'),
('INV-0024','Xênia Carvalho Furtado','183.259.647-00','xenia.c@email.com','+55 27 96745-7890','ativo',920000,'2026-05-18','CSV','2026-01-01'),
('INV-0025','Yuri Almeida Marcondes','294.361.758-00','yuri.a@email.com','+55 27 95656-1122','ativo',145000,'2026-05-15','CSV','2026-01-01'),
('INV-0026','Zilda Brandão Oliveira','305.472.869-00','zilda.b@email.com','+55 11 94567-3344','inativo',0,'2025-09-12','Importação SCP','2026-01-01'),
('INV-0027','Adriana Coelho Santos','416.583.971-00','adriana.c@email.com','+55 31 93478-5566','ativo',670000,'2026-05-12','CSV','2026-01-01'),
('INV-0028','Bernardo Pires Quintela','527.694.182-00','bernardo.q@email.com','+55 21 92389-7788','ativo',1100000,'2026-05-21','Indicação','2026-01-01'),
('INV-0029','Camila Duarte Esteves','638.715.293-00','camila.d@email.com','+55 27 91290-9900','ativo',78000,'2026-05-09','CSV','2026-01-01'),
('INV-0030','Diogo Falcão Rezende','749.826.314-00','diogo.f@email.com','+55 27 90101-1234','ativo',290000,'2026-05-16','CSV','2026-01-01'),
('INV-0031','Eliana Gomes Soares','850.937.425-00','eliana.g@email.com','+55 11 99012-5678','pendente_confirmacao',115000,'2026-05-03','Cadastro manual','2026-01-01'),
('INV-0032','Fábio Hering Ramalho','961.048.536-00','fabio.h@email.com','+55 31 98123-3456','ativo',2050000,'2026-05-20','Indicação','2026-01-01'),
('INV-0033','Giselle Itamar Pessoa','072.159.647-00','giselle.i@email.com','+55 21 97234-7890','ativo',195000,'2026-05-14','CSV','2026-01-01');

-- Valores de investimento zerados — preenchidos quando dados reais chegarem.
update public.investidores set valor_investido = 0;

-- ----------------------------------------------------------------
-- TEMPLATES
-- ----------------------------------------------------------------
insert into public.templates (id, nome, canal, assunto, resumo, conteudo, tags, usos, ultima_edicao, ativo) values
('TPL-001','Release de Resultados Trimestrais','email','Resultados do {{trimestre}} disponíveis — Grupo ICA','Prezado(a) {{nome}}, o Grupo ICA divulgou os resultados financeiros do {{trimestre}}...','<h2>Resultados do {{trimestre}}</h2><p>Prezado(a) {{nome}},</p><p>O Grupo ICA divulgou os resultados financeiros do {{trimestre}}. Acesse o material completo no portal.</p><p><a href=''{{url_kit}}''>Acessar Kit do Investidor</a></p>', array['trimestral','resultados','release'],12,'2026-05-18',true),
('TPL-002','Convite Teleconferência','email','Convite — Teleconferência de Resultados {{trimestre}}','Olá {{nome}}, convidamos você para a teleconferência de resultados do {{trimestre}}...','<h2>Teleconferência {{trimestre}}</h2><p>Olá {{nome}},</p><p>Convidamos você para nossa teleconferência em {{data}} às {{hora}}.</p>', array['convite','teleconferência','evento'],8,'2026-05-20',true),
('TPL-003','Aviso curto — WhatsApp Resultados','whatsapp',null,'Olá {{nome}}, os resultados do {{trimestre}} já estão no portal do investidor.','Olá {{nome}}, os resultados do {{trimestre}} já estão no portal do investidor. Acesse: {{url_kit}}', array['trimestral','curto'],14,'2026-05-21',true),
('TPL-004','Push — Novo Comunicado','push',null,'📊 Novo comunicado do Grupo ICA disponível no portal.','📊 Novo comunicado do Grupo ICA disponível no portal. Toque para ler.', array['comunicado','alerta'],32,'2026-05-19',true),
('TPL-005','Dividendos — Aviso de pagamento','email','Pagamento de dividendos confirmado — Grupo ICA','{{nome}}, confirmamos o pagamento de R$ {{valor_div}} referente aos seus dividendos...','<h2>Pagamento de dividendos</h2><p>{{nome}}, confirmamos o pagamento de R$ {{valor_div}} referente aos seus dividendos do exercício {{ano}}.</p><p>O crédito foi realizado em {{data}}.</p>', array['dividendos','pagamento'],4,'2026-05-15',true),
('TPL-006','Atualização da Reestruturação','email','Atualização da Fase {{fase}} — Reestruturação','Prezados investidores, comunicamos o andamento da Fase {{fase}} da reestruturação...','<h2>Atualização — Fase {{fase}}</h2><p>Prezados investidores,</p><p>Comunicamos o andamento da Fase {{fase}} da reestruturação societária do Grupo ICA.</p>', array['reestruturação','fase','fidc'],6,'2026-05-20',true),
('TPL-007','Onboarding — Boas-vindas','email','Bem-vindo(a) à área do investidor do Grupo ICA','Olá {{nome}}, sua conta de investidor foi criada. Acesse seus dados no portal...','<h2>Bem-vindo(a)</h2><p>Olá {{nome}}, sua conta foi criada com sucesso.</p><p>Acesse: {{url_portal}}</p>', array['onboarding','boas-vindas'],142,'2026-04-30',true),
('TPL-008','Lembrete — Documentação pendente','whatsapp',null,'{{nome}}, identificamos documentos pendentes no seu cadastro. Atualize em {{prazo}}.','Olá {{nome}}, identificamos documentos pendentes no seu cadastro. Atualize até {{prazo}} para manter sua conta ativa: {{url_docs}}', array['compliance','documentos'],38,'2026-05-10',false);

-- ----------------------------------------------------------------
-- CMS ESTENDIDO — navegação do header
-- ----------------------------------------------------------------
insert into public.nav_items (id, label, url, ordem, visivel) values
('nav-1','Governança Corporativa','#governanca',0,true),
('nav-2','Informações Financeiras','/demonstracoes',1,true),
('nav-3','Comunicados, Eventos e Replays','#comunicados',2,true),
('nav-4','Ação','#acao',3,true),
('nav-5','Serviços aos Investidores','#servicos',4,true);

-- ----------------------------------------------------------------
-- CMS ESTENDIDO — ações rápidas
-- ----------------------------------------------------------------
insert into public.quick_actions (id, label, href, ordem, visivel) values
('qa-1','FAQs','/em-construcao',0,true),
('qa-2','Resultados Trimestrais','/resultados',1,true),
('qa-3','Apresentação Institucional','/apresentacao',2,true);

-- ----------------------------------------------------------------
-- CMS ESTENDIDO — rodapé (colunas + links)
-- ----------------------------------------------------------------
insert into public.footer_colunas (id, titulo, ordem) values
('fc-1','Sobre a ICA',0),
('fc-2','Investidores',1),
('fc-3','Atendimento',2);

insert into public.footer_links (coluna_id, label, url, ordem) values
('fc-1','Quem somos','#',0),
('fc-1','Nossas soluções','#',1),
('fc-1','Governança','#',2),
('fc-1','Carreiras','#',3),
('fc-2','Informações financeiras','/demonstracoes',0),
('fc-2','Comunicados ao mercado','#comunicados',1),
('fc-2','Agenda do investidor','#eventos',2),
('fc-2','FAQ','#faqs',3),
('fc-3','Fale com RI','#contato',0),
('fc-3','Imprensa','#',1),
('fc-3','Ouvidoria','#',2),
('fc-3','Política de privacidade','#',3);

-- ----------------------------------------------------------------
-- CMS ESTENDIDO — redes sociais
-- ----------------------------------------------------------------
insert into public.redes_sociais (tipo, url, ordem) values
('linkedin','#',0),
('instagram','#',1),
('email','mailto:ri@grupoica.com.br',2),
('telefone','tel:+5527000000000',3);

-- ----------------------------------------------------------------
-- CMS ESTENDIDO — configuração institucional (singleton)
-- ----------------------------------------------------------------
insert into public.site_config (id, institucional_url, footer_descricao, footer_cnpj, footer_endereco, footer_copyright) values (
  1,
  'https://seugrupoica.com.br',
  'Relações com Investidores do Grupo ICA — transparência, governança e comunicação direta com nossos acionistas.',
  'CNPJ 00.000.000/0001-00',
  'Rua Exemplo, 1000 — Vitória/ES — Brasil',
  '© 2026 Grupo ICA. Todos os direitos reservados.'
);

-- ----------------------------------------------------------------
-- CMS ESTENDIDO — FAQ inicial
-- ----------------------------------------------------------------
insert into public.faqs (pergunta, resposta, categoria, ordem, publicado) values
('Como acesso a área do investidor?','Clique em "Área do Investidor" no topo do portal e entre com seu CPF e a senha cadastrada no primeiro acesso.','Acesso',0,true),
('Onde encontro os resultados trimestrais?','Os releases, apresentações e demonstrações financeiras de cada trimestre ficam no Kit do Investidor e na seção de Documentos.','Resultados',1,true),
('Como entro em contato com o time de RI?','Use o botão "Contato com RI" no portal ou escreva para ri@grupoica.com.br.','Contato',2,true),
('Quando ocorre a próxima teleconferência?','As datas das teleconferências e demais eventos ficam na agenda "Próximos Eventos" da home.','Eventos',3,true);

-- ----------------------------------------------------------------
-- USUÁRIOS DO SISTEMA (gestão pelo Super Admin)
-- senha_temp é PLACEHOLDER de dev — Fase 2 usa Supabase Auth.
-- ----------------------------------------------------------------
insert into public.usuarios (id, nome, email, cpf, papel, status, senha_temp, senha_definida) values
('usr-001','Vitão Uli','vitao@grupoica.com.br',null,'super_admin','ativo','admin123',true),
('usr-002','Renan Giacomin','renan@grupoica.com.br',null,'super_admin','ativo','admin123',true),
('usr-003','Ana Carolina Ferreira','ana.ferreira@email.com','123.456.789-00','investidor','ativo','invest123',true),
('usr-004','Bruno Lima Pereira','bruno.lima@email.com','987.654.321-00','investidor','ativo',null,false),
('usr-005','Felipe Antunes Costa','felipe.costa@email.com','789.123.456-00','investidor','inativo',null,false);

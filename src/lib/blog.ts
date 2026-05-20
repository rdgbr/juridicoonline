/**
 * Blog posts hard-coded em TS (sem CMS por enquanto).
 * Cada post é otimizado pra long-tail keyword + E-E-A-T.
 * Pra adicionar novos posts, basta editar este arquivo.
 *
 * Long-term: migrar pra MDX em /content/blog ou Postgres se o volume escalar.
 */

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string; // ISO date
  updatedAt: string;
  author: { name: string; bio: string };
  readingMinutes: number;
  keywords: string[];
  /** Body in HTML — paragraphs, h2, h3, ul/ol, strong, a, p */
  body: string;
};

const DEFAULT_AUTHOR = {
  name: "Equipe Jurídico Online",
  bio: "Time editorial Jurídico Online — especializado em dados públicos do CNPJ, tributário e jurisprudência.",
};

export const POSTS: BlogPost[] = [
  {
    slug: "como-consultar-cnpj-gratis",
    title: "Como consultar CNPJ grátis: guia completo 2026",
    excerpt: "Aprenda a consultar qualquer CNPJ brasileiro grátis em segundos. Veja razão social, sócios, situação cadastral, endereço e contatos.",
    category: "Consulta CNPJ",
    publishedAt: "2026-01-15",
    updatedAt: new Date().toISOString().slice(0, 10),
    author: DEFAULT_AUTHOR,
    readingMinutes: 6,
    keywords: ["consultar CNPJ grátis", "consulta CNPJ", "CNPJ Receita Federal", "razão social"],
    body: `<p>Consultar um CNPJ no Brasil é um direito de qualquer cidadão. Os dados do Cadastro Nacional de Pessoas Jurídicas (CNPJ) são públicos por natureza e podem ser consultados gratuitamente. Neste guia, mostramos todas as formas de fazer isso em 2026.</p>

<h2>O que é o CNPJ?</h2>
<p>O CNPJ (Cadastro Nacional da Pessoa Jurídica) é um número de 14 dígitos que identifica unicamente uma empresa brasileira na Receita Federal. Ele substituiu o antigo CGC em 1998.</p>

<h2>O que você pode consultar gratuitamente</h2>
<ul>
<li><strong>Razão social e nome fantasia</strong> — identificação oficial</li>
<li><strong>Situação cadastral</strong> — ativa, baixada, suspensa, inapta</li>
<li><strong>Endereço completo</strong> — logradouro, número, bairro, CEP, município, UF</li>
<li><strong>CNAE</strong> — atividade econômica principal e secundárias</li>
<li><strong>Quadro societário (QSA)</strong> — sócios e administradores</li>
<li><strong>Capital social</strong> — valor declarado</li>
<li><strong>Telefone e e-mail</strong> — quando declarados na Receita</li>
<li><strong>Data de abertura</strong></li>
<li><strong>Porte</strong> — ME, EPP, Demais</li>
<li><strong>Opção pelo Simples Nacional ou MEI</strong></li>
</ul>

<h2>3 formas de consultar grátis em 2026</h2>

<h3>1. Site da Receita Federal</h3>
<p>O <a href="https://solucoes.receita.fazenda.gov.br/Servicos/cnpjreva/cnpjreva_solicitacao.asp" target="_blank" rel="nofollow noopener">comprovante oficial</a> está disponível diretamente no portal da Receita. É a fonte primária, mas a interface é pesada e exige captcha.</p>

<h3>2. Jurídico Online (recomendado)</h3>
<p>Pelo <a href="/">Jurídico Online</a> você consulta os mesmos dados oficiais, mas com:</p>
<ul>
<li>Busca por razão social, sócio ou CNPJ</li>
<li>Quadro societário expandido com qualificações</li>
<li>Empresas relacionadas (mesmo CNAE, mesma cidade)</li>
<li>Atualização diária da base RFB</li>
<li>Acesso grátis (apenas cadastro)</li>
</ul>

<h3>3. API REST (para desenvolvedores)</h3>
<p>Se você precisa integrar consulta de CNPJ em um sistema, oferecemos <a href="/api">API REST</a> com Bearer token e rate limit transparente.</p>

<h2>Por que cadastrar?</h2>
<p>Os dados de identificação (razão social, CNPJ, endereço, CNAE, situação) ficam <strong>públicos sem login</strong>. Já dados de contato sensíveis (telefones e e-mails) e quadro societário completo exigem cadastro grátis para evitar uso massivo automatizado (LGPD).</p>

<p>Comece agora: <a href="/cadastro">criar conta grátis</a> ou faça uma <a href="/buscar">busca</a> direto.</p>`,
  },
  {
    slug: "mei-simples-lucro-real-diferencas",
    title: "MEI, Simples Nacional e Lucro Real: qual a diferença?",
    excerpt: "Entenda os 3 regimes tributários mais comuns para empresas brasileiras e como identificar pelo CNPJ.",
    category: "Tributário",
    publishedAt: "2026-01-20",
    updatedAt: new Date().toISOString().slice(0, 10),
    author: DEFAULT_AUTHOR,
    readingMinutes: 8,
    keywords: ["MEI", "Simples Nacional", "Lucro Real", "regime tributário", "Receita Federal"],
    body: `<p>Toda empresa brasileira se enquadra em um regime tributário. Os três mais comuns são MEI, Simples Nacional e Lucro Real. Saber identificar pelo CNPJ é essencial para prospecção, due diligence e análise de crédito.</p>

<h2>MEI — Microempreendedor Individual</h2>
<ul>
<li><strong>Faturamento limite</strong>: R$ 81.000/ano (2026)</li>
<li><strong>Funcionários</strong>: até 1</li>
<li><strong>Tributo</strong>: valor fixo mensal (DAS-MEI)</li>
<li><strong>Identificação CNPJ</strong>: campo opcao_mei = "S" + porte "MICRO EMPRESA"</li>
</ul>

<h2>Simples Nacional</h2>
<ul>
<li><strong>Faturamento limite</strong>: R$ 4,8 milhões/ano</li>
<li><strong>Tributo</strong>: alíquota única progressiva (4-30%)</li>
<li><strong>Identificação CNPJ</strong>: campo opcao_simples = "S"</li>
</ul>

<h2>Lucro Presumido / Lucro Real</h2>
<ul>
<li>Empresas acima de R$ 4,8M/ano ou que optam por estes regimes</li>
<li>Geralmente porte "DEMAIS" + opcao_simples = "N"</li>
</ul>

<h2>Como identificar pelo CNPJ?</h2>
<p>No <a href="/">Jurídico Online</a>, cada página de empresa mostra essas informações como badges no topo:</p>
<ul>
<li>Badge <span style="background:#ecfdf5;color:#10b981;padding:2px 8px;border-radius:4px;font-size:12px;">Simples</span> quando optante</li>
<li>Badge <span style="background:#fef3c7;color:#d97706;padding:2px 8px;border-radius:4px;font-size:12px;">MEI</span> quando MEI</li>
<li>Badge de porte (MICRO EMPRESA, EPP, DEMAIS)</li>
</ul>

<p>Para listar todos os MEIs ou Simples de um estado, use <a href="/empresas-mei/sp">/empresas-mei/[uf]</a> ou <a href="/empresas-simples/sp">/empresas-simples/[uf]</a>.</p>`,
  },
  {
    slug: "situacao-cadastral-cnpj-ativa-baixada",
    title: "Situação cadastral do CNPJ: o que significa cada status?",
    excerpt: "ATIVA, BAIXADA, SUSPENSA, INAPTA: entenda cada situação cadastral e suas implicações legais.",
    category: "Receita Federal",
    publishedAt: "2026-01-25",
    updatedAt: new Date().toISOString().slice(0, 10),
    author: DEFAULT_AUTHOR,
    readingMinutes: 5,
    keywords: ["situação cadastral", "CNPJ ativa", "CNPJ baixada", "CNPJ inapta", "CNPJ suspensa"],
    body: `<p>A situação cadastral do CNPJ indica o estado da empresa perante a Receita Federal. São 5 situações possíveis. Saber identificar é essencial para qualquer negócio que envolva contratos, crédito ou prospecção.</p>

<h2>1. ATIVA</h2>
<p>A empresa está em operação regular e pode emitir notas fiscais. É o status normal de empresas funcionando.</p>

<h2>2. SUSPENSA</h2>
<p>Empresa temporariamente impedida de operar — geralmente por solicitação do próprio contribuinte ou medida fiscal. Pode voltar a ser ATIVA.</p>

<h2>3. INAPTA</h2>
<p>A Receita Federal considerou a empresa inapta — geralmente por não entregar declarações por 5 anos consecutivos ou por indícios de fraude. <strong>Não pode emitir notas fiscais válidas.</strong></p>

<h2>4. BAIXADA</h2>
<p>Encerramento definitivo da empresa. Não há retorno — a empresa não existe mais juridicamente.</p>

<h2>5. NULA</h2>
<p>Caso especial: o CNPJ foi declarado nulo (fraude na constituição).</p>

<h2>Por que isso importa?</h2>
<p>Fechar contrato, vender ou comprar de uma empresa <strong>INAPTA</strong> ou <strong>BAIXADA</strong> pode trazer problemas legais: nota fiscal inválida, falta de garantias, risco de fraude.</p>

<p>Antes de fazer negócio, sempre <a href="/cadastro">consulte gratuitamente</a> a situação no Jurídico Online — atualizamos a base diariamente da Receita Federal.</p>`,
  },
  {
    slug: "como-abrir-empresa-passo-a-passo",
    title: "Como abrir uma empresa em 2026: passo a passo completo",
    excerpt: "Guia atualizado para abrir CNPJ, escolher CNAE, definir regime tributário e registrar na Junta Comercial.",
    category: "Empreendedorismo",
    publishedAt: "2026-02-01",
    updatedAt: new Date().toISOString().slice(0, 10),
    author: DEFAULT_AUTHOR,
    readingMinutes: 10,
    keywords: ["como abrir empresa", "abrir CNPJ", "Junta Comercial", "CNAE", "MEI 2026"],
    body: `<p>Abrir uma empresa no Brasil em 2026 ficou mais simples graças à integração entre Receita Federal, Junta Comercial e prefeituras via REDESIM. Veja o passo a passo.</p>

<h2>1. Defina natureza jurídica e regime</h2>
<p>As opções mais comuns:</p>
<ul>
<li><strong>MEI</strong> — para autônomos com faturamento até R$ 81k/ano</li>
<li><strong>Empresa Individual (EI)</strong> — sem sócios</li>
<li><strong>Sociedade Limitada (LTDA)</strong> — 2+ sócios</li>
<li><strong>Sociedade Anônima (S.A.)</strong> — empresas grandes</li>
</ul>

<h2>2. Escolha o CNAE certo</h2>
<p>O CNAE define sua atividade econômica e impacta tributação e licenças. Use nossa <a href="/cnae/4711301">busca por CNAE</a> para encontrar o código correto.</p>

<h2>3. Registre na Junta Comercial</h2>
<p>O processo é online via REDESIM. Em SP, SC e MG é praticamente automático em 2-7 dias.</p>

<h2>4. Receba o CNPJ</h2>
<p>Após aprovação, o CNPJ é emitido pela Receita Federal. A partir daí sua empresa pode ser consultada em sites como o <a href="/">Jurídico Online</a>.</p>

<h2>5. Alvará municipal e licenças</h2>
<p>Dependendo do CNAE, pode ser necessário licenças sanitárias, ambientais ou de funcionamento.</p>

<h2>Erros comuns ao abrir CNPJ</h2>
<ul>
<li>Escolher CNAE errado (gera tributação inadequada)</li>
<li>Não optar pelo Simples Nacional quando elegível</li>
<li>Esquecer alvará municipal</li>
<li>Não emitir nota fiscal nos primeiros 90 dias</li>
</ul>`,
  },
  {
    slug: "quadro-societario-qsa-como-consultar",
    title: "Quadro societário (QSA): o que é e como consultar pelo CNPJ",
    excerpt: "Aprenda a identificar sócios, administradores e participações de qualquer empresa brasileira pelo CNPJ.",
    category: "Consulta CNPJ",
    publishedAt: "2026-02-08",
    updatedAt: new Date().toISOString().slice(0, 10),
    author: DEFAULT_AUTHOR,
    readingMinutes: 6,
    keywords: ["quadro societário", "QSA", "sócios CNPJ", "administradores empresa"],
    body: `<p>O Quadro de Sócios e Administradores (QSA) é a relação oficial de quem participa de uma empresa brasileira. Ele é público e essencial para due diligence, análise de crédito e investigação patrimonial.</p>

<h2>O que mostra o QSA?</h2>
<ul>
<li>Nome completo do sócio</li>
<li>CPF/CNPJ mascarado</li>
<li>Qualificação (sócio-administrador, diretor, presidente, etc)</li>
<li>Data de entrada na sociedade</li>
<li>Representante legal (quando aplicável)</li>
</ul>

<h2>Como consultar grátis</h2>
<p>No <a href="/">Jurídico Online</a> temos a base completa de QSA da Receita Federal indexada com 25+ milhões de registros. Para acessar o quadro completo, basta criar uma <a href="/cadastro">conta grátis</a>.</p>

<h2>Sócio cruzado: descubra outras empresas</h2>
<p>Um dos recursos mais úteis: clique no nome do sócio e veja <strong>todas as outras empresas onde ele é sócio ou administrador</strong>. Útil para descobrir grupos econômicos, redes de empresas e investigar laranjas.</p>

<h2>Atualização</h2>
<p>O QSA da Receita é atualizado quando há alteração contratual registrada na Junta Comercial. Mudanças informais (acordos verbais) não aparecem.</p>`,
  },
  {
    slug: "como-descobrir-telefone-email-cnpj",
    title: "Como descobrir telefone e e-mail de uma empresa pelo CNPJ",
    excerpt: "Empresas declaram telefone e e-mail na Receita Federal. Veja como consultar legalmente.",
    category: "Prospecção",
    publishedAt: "2026-02-15",
    updatedAt: new Date().toISOString().slice(0, 10),
    author: DEFAULT_AUTHOR,
    readingMinutes: 4,
    keywords: ["telefone empresa CNPJ", "e-mail empresa CNPJ", "contato empresa", "prospecção B2B"],
    body: `<p>Telefones e e-mails declarados no CNPJ são <strong>dados públicos</strong> da Receita Federal. Esses contatos foram cadastrados pelas próprias empresas no momento do registro.</p>

<h2>De onde vêm os dados?</h2>
<p>Quando uma empresa abre CNPJ, ela informa um telefone de contato e um e-mail à Receita Federal. Esses campos ficam acessíveis publicamente nos arquivos abertos do CNPJ.</p>

<h2>Como consultar?</h2>
<p>No <a href="/">Jurídico Online</a>, após criar conta grátis, você acessa:</p>
<ul>
<li>Telefone principal e secundário</li>
<li>E-mail declarado</li>
<li>Indicador se o telefone tem WhatsApp (quando disponível)</li>
</ul>

<h2>É legal usar para prospecção?</h2>
<p>Sim, com cuidados. A LGPD (Lei 13.709/2018) permite uso de dados públicos para legítimo interesse comercial, desde que:</p>
<ul>
<li>Você ofereça opt-out claro</li>
<li>Use os contatos para finalidade legítima (B2B, vendas, etc)</li>
<li>Não venda os dados como base</li>
<li>Respeite solicitações de remoção</li>
</ul>

<p>Para uso massivo (export, API), considere nosso <a href="/planos">plano Pro ou API</a>.</p>`,
  },
  {
    slug: "lgpd-empresas-cnpj-publico",
    title: "LGPD para empresas: dados do CNPJ são públicos mesmo?",
    excerpt: "Entenda o que a LGPD diz sobre dados de empresas no CNPJ e quando é permitido usá-los.",
    category: "Legal",
    publishedAt: "2026-02-22",
    updatedAt: new Date().toISOString().slice(0, 10),
    author: DEFAULT_AUTHOR,
    readingMinutes: 7,
    keywords: ["LGPD CNPJ", "LGPD empresas", "dados públicos CNPJ", "Lei 13709"],
    body: `<p>A LGPD (Lei Geral de Proteção de Dados, Lei 13.709/2018) gera dúvidas sobre o tratamento de dados de empresas. A resposta curta: <strong>CNPJ é pessoa jurídica, não está sob a LGPD</strong>. Mas sócios (pessoa física) sim.</p>

<h2>Dados da empresa (CNPJ) — públicos</h2>
<ul>
<li>Razão social</li>
<li>Nome fantasia</li>
<li>Endereço da empresa</li>
<li>Telefone e e-mail corporativos</li>
<li>CNAE e atividades</li>
<li>Capital social</li>
<li>Situação cadastral</li>
</ul>
<p>Tudo público por força da legislação tributária. <strong>Não há restrição LGPD.</strong></p>

<h2>Dados pessoais dos sócios — protegidos</h2>
<p>Nome do sócio aparece, mas o <strong>CPF é mascarado</strong> (XXX.123.456-XX) precisamente por causa da LGPD. Endereço residencial do sócio também não aparece no CNPJ público.</p>

<h2>Quando uma empresa pode pedir remoção?</h2>
<p>Mesmo sendo público, oferecemos opt-out via página <a href="/lgpd">/lgpd</a> para:</p>
<ul>
<li>Sócios PF que querem reduzir visibilidade</li>
<li>Empresas baixadas que querem evitar indexação</li>
<li>Casos de violência (ex: empresa de pessoa em situação de risco)</li>
</ul>

<h2>Resumo</h2>
<p>O Jurídico Online segue 100% a LGPD: dados de PJ públicos, dados de PF protegidos, opt-out disponível, DPO designado (dpo@juridicoonline.com.br).</p>`,
  },
  {
    slug: "due-diligence-cnpj-checklist",
    title: "Due diligence pelo CNPJ: checklist de 15 itens",
    excerpt: "Antes de fechar contrato com um fornecedor ou cliente, faça uma due diligence completa pelo CNPJ.",
    category: "Jurídico",
    publishedAt: "2026-03-01",
    updatedAt: new Date().toISOString().slice(0, 10),
    author: DEFAULT_AUTHOR,
    readingMinutes: 9,
    keywords: ["due diligence", "checklist CNPJ", "compliance", "análise empresa"],
    body: `<p>Antes de assinar um contrato, comprar uma empresa ou conceder crédito, uma due diligence rápida pelo CNPJ pode evitar grandes problemas. Aqui está nosso checklist de 15 itens.</p>

<h2>Identificação</h2>
<ol>
<li>CNPJ válido (dígito verificador)</li>
<li>Razão social bate com o contrato</li>
<li>Situação cadastral = ATIVA</li>
<li>Data de abertura compatível com histórico alegado</li>
</ol>

<h2>Operação</h2>
<ol start="5">
<li>CNAE compatível com a atividade que vai contratar</li>
<li>Endereço bate com o declarado</li>
<li>Capital social proporcional ao porte do negócio</li>
<li>Optante por Simples ou MEI = limite de faturamento</li>
</ol>

<h2>Quadro Societário</h2>
<ol start="9">
<li>Sócios identificados (CPF mascarado público)</li>
<li>Sócio-administrador presente</li>
<li>Verificar se sócios participam de outras empresas com pendências</li>
<li>Data de entrada dos sócios atuais</li>
</ol>

<h2>Risco</h2>
<ol start="13">
<li>Buscar processos no TJ do estado da sede</li>
<li>Consultar PGFN (Procuradoria Geral da Fazenda) para dívidas tributárias</li>
<li>Verificar pendências SERASA / Boa Vista</li>
</ol>

<p>O Jurídico Online cobre itens 1-12 gratuitamente. Para 13-15, integramos com bases especializadas no <a href="/planos">plano Business</a>.</p>`,
  },
  {
    slug: "cnae-codigo-atividade-economica",
    title: "CNAE: o código da atividade econômica explicado",
    excerpt: "Entenda o que é o CNAE, como funciona a hierarquia e como escolher o código correto para sua empresa.",
    category: "Tributário",
    publishedAt: "2026-03-08",
    updatedAt: new Date().toISOString().slice(0, 10),
    author: DEFAULT_AUTHOR,
    readingMinutes: 6,
    keywords: ["CNAE", "atividade econômica", "código CNAE", "Junta Comercial"],
    body: `<p>O CNAE (Classificação Nacional de Atividades Econômicas) é o código que identifica a atividade principal de uma empresa. Ele define tributos, licenças exigidas e enquadramento legal. Saber escolher o CNAE correto é crucial.</p>

<h2>Estrutura do código</h2>
<p>O CNAE tem 7 dígitos hierárquicos:</p>
<ul>
<li><strong>Seção (1 letra)</strong>: A=Agricultura, C=Indústria, G=Comércio, etc</li>
<li><strong>Divisão (2 dígitos)</strong>: ex. 47=Comércio Varejista</li>
<li><strong>Grupo (3 dígitos)</strong>: ex. 471=Comércio varejista não-especializado</li>
<li><strong>Classe (4 dígitos)</strong>: ex. 4711=Hipermercados/Supermercados</li>
<li><strong>Subclasse (7 dígitos)</strong>: ex. 4711-3/01=Comércio varejista de mercadorias em geral, com predominância de produtos alimentícios — hipermercados</li>
</ul>

<h2>Top 10 CNAEs do Brasil</h2>
<ol>
<li><a href="/cnae/4711301">4711-3/01</a> — Hipermercados</li>
<li><a href="/cnae/4751201">4751-2/01</a> — Comércio varejista de informática</li>
<li><a href="/cnae/5611201">5611-2/01</a> — Restaurantes</li>
<li><a href="/cnae/9602501">9602-5/01</a> — Salões de beleza</li>
<li><a href="/cnae/4789099">4789-0/99</a> — Comércio varejista de outros produtos</li>
<li><a href="/cnae/7319002">7319-0/02</a> — Marketing direto</li>
<li><a href="/cnae/7020400">7020-4/00</a> — Consultoria em gestão</li>
<li><a href="/cnae/4520001">4520-0/01</a> — Manutenção e reparação de veículos</li>
<li><a href="/cnae/4399103">4399-1/03</a> — Obras de alvenaria</li>
<li>4530-7/03 — Comércio a varejo de peças automotivas</li>
</ol>

<p>Use nossa <a href="/cnae/4711301">página de CNAE</a> para listar todas as empresas de um setor.</p>`,
  },
  {
    slug: "junta-comercial-vs-receita-federal",
    title: "Junta Comercial × Receita Federal: qual a diferença?",
    excerpt: "Entenda os papéis de cada órgão no ciclo de vida de uma empresa brasileira.",
    category: "Empreendedorismo",
    publishedAt: "2026-03-15",
    updatedAt: new Date().toISOString().slice(0, 10),
    author: DEFAULT_AUTHOR,
    readingMinutes: 5,
    keywords: ["Junta Comercial", "Receita Federal", "JUCESP", "JUCESC", "abrir empresa"],
    body: `<p>Muitos empreendedores confundem Junta Comercial e Receita Federal. São órgãos com papéis distintos no ciclo de vida de uma empresa.</p>

<h2>Junta Comercial</h2>
<ul>
<li><strong>Esfera</strong>: Estadual (uma por UF — JUCESP, JUCESC, JUCEMG, etc)</li>
<li><strong>Função</strong>: Registrar atos da empresa (contrato social, alterações, transformações, dissolução)</li>
<li><strong>Prazo médio</strong>: 2-7 dias úteis para registro de uma LTDA</li>
<li><strong>Custo</strong>: Taxa estadual (R$ 50 a R$ 500 dependendo da UF)</li>
</ul>

<h2>Receita Federal</h2>
<ul>
<li><strong>Esfera</strong>: Federal</li>
<li><strong>Função</strong>: Emitir o CNPJ, controlar situação cadastral, integrar com tributos federais</li>
<li><strong>Prazo</strong>: 24-48h após aprovação na Junta</li>
<li><strong>Custo</strong>: Grátis</li>
</ul>

<h2>Ordem do processo</h2>
<ol>
<li>Junta Comercial aprova o registro da empresa</li>
<li>REDESIM integra automaticamente com Receita Federal</li>
<li>RFB emite o CNPJ</li>
<li>Prefeitura emite alvará (se necessário)</li>
<li>Empresa pode operar</li>
</ol>

<h2>Por que isso importa?</h2>
<p>Para due diligence: dados de <strong>composição societária histórica</strong> ficam na Junta Comercial; dados <strong>atuais e cadastrais</strong> na Receita Federal. O Jurídico Online consome a base RFB diretamente.</p>`,
  },
];

export function getPost(slug: string): BlogPost | null {
  return POSTS.find((p) => p.slug === slug) || null;
}

export function getAllPosts(): BlogPost[] {
  return POSTS.slice().sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getPostsByCategory(category: string): BlogPost[] {
  return POSTS.filter((p) => p.category === category);
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const current = getPost(slug);
  if (!current) return [];
  return POSTS.filter((p) => p.slug !== slug && p.category === current.category)
    .concat(POSTS.filter((p) => p.slug !== slug && p.category !== current.category))
    .slice(0, limit);
}

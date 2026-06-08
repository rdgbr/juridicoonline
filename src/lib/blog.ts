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

/**
 * Authors with rich bio for E-E-A-T schema.org Person + visual byline.
 * Add new authors here and reference by slug in posts.
 */
export const AUTHORS = {
  equipe: {
    slug: "equipe",
    name: "Equipe Jurídico Online",
    role: "Time editorial",
    bio: "Time editorial Jurídico Online — especializado em dados públicos do CNPJ, tributário e direito societário. Curadoria e checagem de fontes oficiais (Receita Federal, Juntas Comerciais, ANPD).",
    avatarInitial: "J",
    sameAs: ["https://juridicoonline.com.br"],
  },
} as const;

const DEFAULT_AUTHOR = AUTHORS.equipe;

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
  {
    slug: "preciso-de-contador-para-abrir-empresa",
    title: "Preciso de contador para abrir empresa? Entenda quando é obrigatório",
    excerpt: "MEI pode abrir empresa sem contador. LTDA, ME e EPP precisam. Veja o que o contador faz e os riscos de não ter um.",
    category: "Empreendedorismo",
    publishedAt: "2026-03-20",
    updatedAt: new Date().toISOString().slice(0, 10),
    author: DEFAULT_AUTHOR,
    readingMinutes: 7,
    keywords: ["preciso de contador para abrir empresa", "contador para abrir empresa", "contador MEI", "contador LTDA", "honorários contador"],
    body: `<p>A pergunta "preciso de contador para abrir empresa?" tem uma resposta direta: depende do tipo de empresa. Para MEI, não há obrigação legal. Para todos os outros tipos — ME, EPP, LTDA, SLU, SA — a lei exige que haja um contador responsável pela escrituração contábil. Mas mesmo o MEI pode se beneficiar imensamente de suporte especializado.</p>

<h2>MEI: não é obrigado, mas pode precisar</h2>
<p>O Microempreendedor Individual foi criado justamente para simplificar a vida do pequeno empreendedor. A legislação do MEI dispensa a obrigação de escrituração contábil formal e de contador registrado no CRC. Mas isso não significa que você não vai errar sem um.</p>
<ul>
<li><strong>DAS-MEI</strong>: o boleto mensal precisa ser emitido e pago corretamente. Atrasos geram multa.</li>
<li><strong>DASN anual</strong>: a declaração de faturamento anual tem prazo fixo (maio). Quem não entrega fica com o CNPJ suspenso.</li>
<li><strong>Limite de faturamento</strong>: ultrapassar R$ 81.000/ano sem planejamento pode gerar desenquadramento compulsório com tributação retroativa.</li>
<li><strong>CNAE correto</strong>: algumas atividades não são permitidas para MEI. Escolher o CNAE errado invalida o registro.</li>
</ul>
<p>Se você está próximo do limite de faturamento ou tem dúvidas sobre CNAE, vale investir em pelo menos uma consultoria pontual com contador especializado em MEI.</p>

<h2>ME, EPP e LTDA: contador é obrigação legal</h2>
<p>O <strong>Decreto-Lei 9.295/46</strong> e o <strong>Código Civil</strong> estabelecem que todas as sociedades empresariais devem ter um contador responsável pela escrituração contábil. A ausência de contador gera:</p>
<ol>
<li>Multas da Receita Federal por escrituração irregular</li>
<li>Impedimento para declarar SPED (Sistema Público de Escrituração Digital)</li>
<li>Dificuldade em comprovar faturamento para financiamentos e licitações</li>
<li>Risco de responsabilidade pessoal dos sócios em caso de auditoria</li>
</ol>

<h2>O que o contador faz na abertura da empresa?</h2>
<p>Quando você contrata um contador para abrir sua empresa, ele cuida de:</p>
<ul>
<li><strong>Definição da natureza jurídica</strong>: ME, EPP, LTDA, SLU — cada uma tem implicações tributárias diferentes.</li>
<li><strong>Escolha do regime tributário</strong>: Simples Nacional, Lucro Presumido ou Lucro Real. Essa decisão pode significar dezenas de milhares de reais de diferença por ano.</li>
<li><strong>CNAE correto</strong>: impacta tributos, alvará e enquadramento no Simples.</li>
<li><strong>Registro na Junta Comercial e Receita Federal</strong>: ele elabora o contrato social e submete os documentos.</li>
<li><strong>Alvará e licenças</strong>: coordena com a prefeitura o licenciamento necessário para sua atividade.</li>
<li><strong>Inscrição estadual</strong>: para atividades sujeitas a ICMS.</li>
</ul>

<h2>O que o contador faz no dia a dia da empresa?</h2>
<p>Além da abertura, o contador garante a saúde fiscal mensal:</p>
<ul>
<li>Apuração de impostos (DAS, DARF, GPS, ISS, ICMS)</li>
<li>Escrituração contábil e financeira</li>
<li>Folha de pagamento e eSocial</li>
<li>Declarações acessórias (DCTF, ECF, EFD-REINF, SPED)</li>
<li>Emissão de certidões negativas para licitações e financiamentos</li>
<li>Planejamento tributário para reduzir carga fiscal legalmente</li>
</ul>

<h2>Quanto custa um contador?</h2>
<p>Os honorários variam muito por região e porte da empresa:</p>
<ul>
<li><strong>MEI com suporte</strong>: R$ 60 a R$ 150/mês</li>
<li><strong>ME/EPP no Simples</strong>: R$ 250 a R$ 600/mês</li>
<li><strong>LTDA média</strong>: R$ 500 a R$ 1.200/mês</li>
<li><strong>Empresas com folha de pagamento e NF-e em volume</strong>: R$ 1.000 a R$ 3.000/mês</li>
</ul>

<h2>Riscos de não ter contador</h2>
<p>Empreendedores que dispensam o contador frequentemente enfrentam:</p>
<ol>
<li><strong>CNPJ inapto</strong> por não entregar declarações (DCTF, ECF, DEFIS). Saiba como <a href="/blog/como-regularizar-empresa-inapta">regularizar um CNPJ inapto</a>.</li>
<li><strong>Pagamento de imposto errado</strong> — geralmente a mais, por escolha inadequada do regime tributário.</li>
<li><strong>Problemas com eSocial e INSS</strong> de funcionários.</li>
<li><strong>Perda do Simples Nacional</strong> por não renovar no prazo correto.</li>
</ol>

<p>Antes de abrir sua empresa, <a href="/buscar">consulte o CNPJ</a> de concorrentes para entender o porte e regime tributário mais comum no seu setor.</p>

<div class="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-6"><h3 class="font-semibold text-slate-900 mb-2">Precisa de ajuda com isso?</h3><p class="text-sm text-slate-700">Nossa rede de parceiros conta com contadores e advogados verificados em todo o Brasil. <a href="/parceiros" class="text-[#0F4C81] font-medium hover:underline">Fale com um especialista →</a></p></div>`,
  },
  {
    slug: "quando-contratar-advogado-empresarial",
    title: "Quando contratar um advogado empresarial? 7 situações que exigem",
    excerpt: "Abertura de holding, disputa societária, M&A, compliance, licitação: conheça as 7 situações em que advogado empresarial é indispensável.",
    category: "Societário",
    publishedAt: "2026-03-27",
    updatedAt: new Date().toISOString().slice(0, 10),
    author: DEFAULT_AUTHOR,
    readingMinutes: 8,
    keywords: ["quando contratar advogado empresarial", "advogado empresarial", "direito societário", "assessoria jurídica empresa"],
    body: `<p>Muitos empresários só procuram um advogado quando o problema já está instaurado — uma disputa societária, um processo trabalhista, um contrato rompido. A assessoria jurídica preventiva custa uma fração do que custa resolver um litígio. Neste guia, mapeamos as 7 situações em que contratar um advogado empresarial é indispensável.</p>

<h2>1. Abertura de empresa com sócios</h2>
<p>Um contrato social mal redigido é a origem de 80% das disputas societárias. O advogado garante que o documento cubra:</p>
<ul>
<li>Regras de saída de sócios (drag-along, tag-along)</li>
<li>Mecanismo de resolução de impasse (deadlock)</li>
<li>Restrições de concorrência e confidencialidade</li>
<li>Critérios de distribuição de resultados</li>
<li>Direito de preferência na compra de cotas</li>
</ul>
<p>Antes da reunião com o advogado, <a href="/buscar">pesquise os sócios no CNPJ</a> para verificar se participam de outras sociedades que possam conflitar.</p>

<h2>2. Estruturação de holding familiar</h2>
<p>A <a href="/blog/holding-familiar-o-que-e-vale-a-pena">holding familiar</a> é um instrumento poderoso de planejamento sucessório e proteção patrimonial, mas exige estruturação jurídica cuidadosa. Erros na constituição podem invalidar benefícios fiscais e gerar problemas na herança.</p>

<h2>3. Disputas e dissoluções societárias</h2>
<p>Quando sócios entram em conflito, três cenários exigem representação jurídica:</p>
<ol>
<li><strong>Dissolução parcial</strong> — saída do sócio com apuração de haveres</li>
<li><strong>Dissolução total</strong> — liquidação e partilha de ativos</li>
<li><strong>Exclusão de sócio</strong> — prevista no art. 1.085 do Código Civil, exige justa causa</li>
</ol>

<h2>4. Contratos de alto valor ou complexidade</h2>
<p>Contratos de fornecimento, joint ventures, parcerias, contratos de exclusividade, licenciamento de software, franquias — qualquer acordo com impacto financeiro ou de longo prazo merece revisão jurídica. O advogado identifica cláusulas abusivas e lacunas que podem se tornar litígios futuros.</p>

<h2>5. Participação em licitações</h2>
<p>Licitações públicas têm regras rígidas: habilitação documental, certidões negativas, capacidade técnica, regularidade fiscal. Um advogado especializado em licitações aumenta significativamente as chances de sucesso e evita inabilitação por erro processual. Use nossa busca de empresas para verificar os <a href="/socios">sócios de empresas concorrentes</a>.</p>

<h2>6. Compliance e LGPD</h2>
<p>Desde a entrada em vigor da <strong>LGPD (Lei 13.709/2018)</strong>, empresas que tratam dados pessoais de clientes e funcionários podem ser multadas em até R$ 50 milhões por violação. O advogado de compliance estrutura:</p>
<ul>
<li>Política de privacidade e termos de uso</li>
<li>Nomeação e atribuições do DPO</li>
<li>Contratos com operadores de dados</li>
<li>Procedimentos de resposta a incidentes</li>
</ul>

<h2>7. M&A (fusões e aquisições) e due diligence</h2>
<p>Comprar ou vender uma empresa é a operação empresarial mais complexa que existe. O advogado coordena a <a href="/blog/due-diligence-compra-empresa-checklist">due diligence</a> jurídica, negocia termos de compra, estrutura representations & warranties e garante que o vendedor assuma riscos históricos. Qualquer M&A sem assessoria jurídica é risco inaceitável.</p>

<h2>E recuperação judicial?</h2>
<p>A <strong>recuperação judicial (Lei 11.101/2005)</strong> é um procedimento judicial complexo que exige advogado habilitado em direito falimentar. A tentativa de recuperação sem suporte jurídico especializado quase sempre termina em falência.</p>

<h2>Quanto custa um advogado empresarial?</h2>
<ul>
<li><strong>Consulta pontual</strong>: R$ 300 a R$ 800/hora dependendo da complexidade e região</li>
<li><strong>Contrato de elaboração</strong>: R$ 1.500 a R$ 10.000 por contrato</li>
<li><strong>Assessoria mensal (retainer)</strong>: R$ 1.500 a R$ 8.000/mês para PMEs</li>
<li><strong>M&A</strong>: geralmente success fee de 1-3% do valor da operação</li>
</ul>

<p>O custo de não ter advogado é sempre maior. Um contrato social bem feito economiza anos de disputas. Verifique os dados societários de qualquer empresa em negociação diretamente em <a href="/buscar">nossa busca de CNPJ</a>.</p>

<div class="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-6"><h3 class="font-semibold text-slate-900 mb-2">Precisa de ajuda com isso?</h3><p class="text-sm text-slate-700">Nossa rede de parceiros conta com contadores e advogados verificados em todo o Brasil. <a href="/parceiros" class="text-[#0F4C81] font-medium hover:underline">Fale com um especialista →</a></p></div>`,
  },
  {
    slug: "certificado-digital-empresa-o-que-e",
    title: "Certificado digital para empresa: o que é, para que serve e como obter",
    excerpt: "e-CNPJ A1 vs A3, obrigatoriedade em 2026, como emitir e custo. Tudo sobre certificado digital PJ.",
    category: "Tributário",
    publishedAt: "2026-04-03",
    updatedAt: new Date().toISOString().slice(0, 10),
    author: DEFAULT_AUTHOR,
    readingMinutes: 6,
    keywords: ["certificado digital empresa", "e-CNPJ", "certificado digital cnpj", "A1 A3 diferença", "ICP-Brasil empresa"],
    body: `<p>O certificado digital é a identidade eletrônica da empresa — equivale à assinatura com firma reconhecida, mas com validade legal plena em ambiente digital. Em 2026, é praticamente impossível operar uma empresa sem ele. Veja o que é, os tipos disponíveis e como obter.</p>

<h2>O que é o certificado digital para empresa (e-CNPJ)?</h2>
<p>O <strong>e-CNPJ</strong> é o certificado digital vinculado ao CNPJ da empresa. Ele é emitido por Autoridades Certificadoras credenciadas pelo <strong>ICP-Brasil</strong> (Infraestrutura de Chaves Públicas Brasileira), órgão vinculado ao ITI (Instituto Nacional de Tecnologia da Informação).</p>
<p>Com o e-CNPJ, a empresa pode:</p>
<ul>
<li>Emitir Notas Fiscais eletrônicas (NF-e, NFS-e, CT-e)</li>
<li>Acessar o eSocial e enviar eventos de folha de pagamento</li>
<li>Assinar documentos eletrônicos com validade jurídica</li>
<li>Acessar o SPED Contábil e SPED Fiscal</li>
<li>Consultar débitos e negociar com a Receita Federal pelo e-CAC</li>
<li>Participar de licitações eletrônicas</li>
<li>Acessar gov.br com nível de confiança máximo</li>
</ul>

<h2>e-CNPJ A1 × A3: qual a diferença?</h2>
<p>Os certificados ICP-Brasil se dividem principalmente entre A1 e A3:</p>

<h3>e-CNPJ A1</h3>
<ul>
<li><strong>Formato</strong>: arquivo digital (.pfx) instalado no computador</li>
<li><strong>Validade</strong>: 1 ano</li>
<li><strong>Custo médio</strong>: R$ 150 a R$ 300</li>
<li><strong>Vantagem</strong>: acesso imediato, pode ser copiado para outros computadores</li>
<li><strong>Desvantagem</strong>: se o arquivo vazar, a chave privada pode ser comprometida</li>
</ul>

<h3>e-CNPJ A3</h3>
<ul>
<li><strong>Formato</strong>: token USB criptográfico ou cartão smartcard</li>
<li><strong>Validade</strong>: 3 anos</li>
<li><strong>Custo médio</strong>: R$ 250 a R$ 500 (inclui token)</li>
<li><strong>Vantagem</strong>: chave privada nunca sai do dispositivo — muito mais seguro</li>
<li><strong>Desvantagem</strong>: precisa do token físico sempre que for usar</li>
</ul>

<h2>Quem é obrigado a ter certificado digital?</h2>
<p>Na prática, toda empresa que:</p>
<ol>
<li>Emite NF-e (obrigatório para atividades de comércio e indústria)</li>
<li>Tem funcionários com registro em carteira (eSocial obrigatório)</li>
<li>Está obrigada ao SPED Contábil ou SPED Fiscal (ME, EPP, LTDA, SA)</li>
<li>Participa de licitações eletrônicas (portais como Comprasnet, BEC/SP, etc)</li>
</ol>
<p>Na prática, apenas o MEI que presta serviços informais e não emite NF-e fica dispensado — e mesmo assim está perdendo oportunidades ao não ter.</p>

<h2>Como obter o certificado digital?</h2>
<ol>
<li><strong>Escolha uma Autoridade Certificadora (AC)</strong>: Serasa, Valid, Soluti, SafeID, CertiSign são as principais credenciadas pelo ICP-Brasil</li>
<li><strong>Escolha A1 ou A3</strong> — para a maioria das PMEs, o A1 é suficiente</li>
<li><strong>Validação presencial ou por videoconferência</strong>: a AC precisa verificar a identidade do representante legal e os documentos da empresa (CNPJ ativo, contrato social, RG/CNH)</li>
<li><strong>Pagamento e emissão</strong>: após validação, o A1 é emitido imediatamente; o A3 depende do recebimento do token</li>
</ol>

<h2>Custo total do certificado</h2>
<ul>
<li>A1 anual: R$ 150 a R$ 300</li>
<li>A3 por 3 anos: R$ 250 a R$ 500 (token incluso)</li>
<li>Renovação A3 (sem trocar token): R$ 150 a R$ 250</li>
</ul>

<p>Consulte a situação cadastral do seu CNPJ em <a href="/buscar">nossa busca</a> antes de solicitar o certificado — AC rejeitam emissão para CNPJs inaptos. Veja também como <a href="/blog/como-abrir-empresa-passo-a-passo">abrir sua empresa</a> corretamente desde o início.</p>

<div class="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-6"><h3 class="font-semibold text-slate-900 mb-2">Precisa de ajuda com isso?</h3><p class="text-sm text-slate-700">Nossa rede de parceiros conta com contadores e advogados verificados em todo o Brasil. <a href="/parceiros" class="text-[#0F4C81] font-medium hover:underline">Fale com um especialista →</a></p></div>`,
  },
  {
    slug: "quanto-custa-abrir-empresa-2026",
    title: "Quanto custa abrir uma empresa em 2026? Tabela por tipo",
    excerpt: "MEI é gratuito. LTDA custa R$ 500 a R$ 2.000. SA começa em R$ 5.000. Veja tabela completa de custos de abertura por tipo de empresa.",
    category: "Empreendedorismo",
    publishedAt: "2026-04-10",
    updatedAt: new Date().toISOString().slice(0, 10),
    author: DEFAULT_AUTHOR,
    readingMinutes: 7,
    keywords: ["quanto custa abrir empresa 2026", "custo abertura empresa", "taxa junta comercial", "honorários contador abertura"],
    body: `<p>Um dos maiores medos de quem quer empreender é não saber quanto vai custar para formalizar o negócio. A resposta varia enormemente dependendo do tipo de empresa, da UF e se você contrata um profissional. Neste guia, detalhamos todos os custos envolvidos.</p>

<h2>Tabela de custos por tipo de empresa</h2>
<ul>
<li><strong>MEI</strong>: R$ 0 — registro 100% gratuito pelo portal gov.br/mei</li>
<li><strong>EI (Empresa Individual)</strong>: R$ 300 a R$ 800 (taxas + contador)</li>
<li><strong>SLU (Sociedade Limitada Unipessoal)</strong>: R$ 500 a R$ 1.500</li>
<li><strong>LTDA (Sociedade Limitada)</strong>: R$ 500 a R$ 2.000</li>
<li><strong>SA (Sociedade Anônima)</strong>: R$ 5.000 a R$ 20.000+</li>
<li><strong>Holding Familiar</strong>: R$ 3.000 a R$ 15.000+ (inclui advogado)</li>
</ul>

<h2>Componentes do custo de abertura</h2>

<h3>1. Taxa da Junta Comercial</h3>
<p>Cada UF tem sua tabela. Exemplos:</p>
<ul>
<li><strong>SP (JUCESP)</strong>: R$ 180 a R$ 360 para LTDA</li>
<li><strong>RJ (JUCERJA)</strong>: R$ 220 a R$ 420 para LTDA</li>
<li><strong>MG (JUCEMG)</strong>: R$ 150 a R$ 300 para LTDA</li>
<li><strong>SC (JUCESC)</strong>: R$ 120 a R$ 250 para LTDA</li>
</ul>
<p>MEI é isento de taxas na Junta — o registro é direto no Portal do Empreendedor.</p>

<h3>2. Honorários do contador para abertura</h3>
<ul>
<li>MEI: R$ 0 a R$ 150 (muitos contadores fazem grátis para conquistar o cliente mensal)</li>
<li>EI/SLU: R$ 300 a R$ 800</li>
<li>LTDA simples: R$ 500 a R$ 1.200</li>
<li>LTDA complexa ou holding: R$ 1.500 a R$ 5.000</li>
</ul>

<h3>3. Advogado (quando necessário)</h3>
<p>Para empresas simples sem cláusulas especiais, o contador faz o contrato social. Para sociedades com múltiplos sócios, holdigns ou cláusulas de governance, um <a href="/blog/quando-contratar-advogado-empresarial">advogado empresarial</a> é recomendado: R$ 800 a R$ 5.000 pela elaboração do contrato.</p>

<h3>4. Alvará municipal</h3>
<p>Obrigatório para atividades físicas (lojas, restaurantes, clínicas). Custo varia por município:</p>
<ul>
<li>Municípios pequenos: R$ 50 a R$ 200</li>
<li>Capitais: R$ 200 a R$ 800</li>
<li>Algumas prefeituras cobram por m² do estabelecimento</li>
</ul>

<h3>5. Licenças específicas (quando aplicável)</h3>
<ul>
<li>Vigilância Sanitária (alimentos, saúde): R$ 300 a R$ 2.000</li>
<li>Bombeiros (AVCB): R$ 500 a R$ 3.000</li>
<li>Licença ambiental (IBAMA/estadual): R$ 500 a R$ 10.000+</li>
</ul>

<h3>6. Certificado digital</h3>
<p>Necessário para emitir NF-e. Custo: R$ 150 a R$ 300 para A1 anual. Saiba mais em <a href="/blog/certificado-digital-empresa-o-que-e">certificado digital para empresa</a>.</p>

<h2>Custo mensal após abertura</h2>
<p>Além dos custos de abertura, considere os custos recorrentes:</p>
<ul>
<li>Honorários do contador: R$ 250 a R$ 1.200/mês</li>
<li>Renovação do certificado digital: R$ 150/ano</li>
<li>Taxa de renovação da Junta (anual): R$ 0 a R$ 150 dependendo da UF</li>
</ul>

<h2>Dica: pesquise antes de decidir o tipo</h2>
<p>Use nossa base de dados para <a href="/buscar">consultar empresas similares</a> no seu setor e verificar qual natureza jurídica é mais comum. Para MEIs, acesse <a href="/empresas-mei/sp">a lista de MEIs por estado</a>. Isso ajuda a entender o padrão do mercado antes de decidir.</p>

<div class="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-6"><h3 class="font-semibold text-slate-900 mb-2">Precisa de ajuda com isso?</h3><p class="text-sm text-slate-700">Nossa rede de parceiros conta com contadores e advogados verificados em todo o Brasil. <a href="/parceiros" class="text-[#0F4C81] font-medium hover:underline">Fale com um especialista →</a></p></div>`,
  },
  {
    slug: "como-regularizar-empresa-inapta",
    title: "Como regularizar empresa inapta: passo a passo completo",
    excerpt: "CNPJ inapto bloqueia NF-e e acesso a crédito. Saiba as causas, como regularizar e quanto custa.",
    category: "Tributário",
    publishedAt: "2026-04-17",
    updatedAt: new Date().toISOString().slice(0, 10),
    author: DEFAULT_AUTHOR,
    readingMinutes: 6,
    keywords: ["como regularizar empresa inapta", "cnpj inapto regularizar", "empresa inapta como resolver", "regularizar cnpj receita federal"],
    body: `<p>O status <strong>INAPTA</strong> no CNPJ é um dos mais graves que uma empresa pode ter. Ele impede a emissão de notas fiscais, bloqueia acesso a crédito bancário e pode inviabilizar contratos com clientes que exigem regularidade fiscal. A boa notícia: na maioria dos casos, é possível regularizar.</p>

<h2>O que é empresa inapta?</h2>
<p>A Instrução Normativa RFB 1.863/2018 define os critérios de inapt. Uma empresa é declarada inapta quando:</p>
<ol>
<li>Deixou de entregar declarações obrigatórias por <strong>2 ou mais exercícios consecutivos</strong> (antigamente eram 5 anos — mudou)</li>
<li>Localização não confirmada em fiscalização</li>
<li>Omissão de informações em declaração</li>
<li>Prática de crimes como fraude ou falsidade</li>
</ol>
<p>As causas mais comuns são declarações não entregues: <strong>DCTF</strong> (Declaração de Débitos e Créditos Tributários Federais), <strong>ECF</strong> (Escrituração Contábil Fiscal) e <strong>DEFIS</strong> (para empresas do Simples Nacional).</p>

<h2>Consequências do CNPJ inapto</h2>
<ul>
<li>Bloqueio imediato na emissão de NF-e (o sistema da SEFAZ rejeita)</li>
<li>Impossibilidade de emitir certidões negativas (CND) para licitações e financiamentos</li>
<li>Bloqueio de conta PJ em muitos bancos</li>
<li>Inscrição automática em dívida ativa estadual em alguns estados</li>
<li>Responsabilização dos sócios por dívidas da empresa</li>
</ul>
<p>Você pode verificar a situação atual do seu CNPJ diretamente em <a href="/buscar">nossa busca gratuita</a>.</p>

<h2>Passo a passo para regularizar</h2>

<h3>Passo 1: Identifique as declarações em atraso</h3>
<p>Acesse o e-CAC (Centro Virtual de Atendimento) com certificado digital e vá em "Declarações e Demonstrativos" para ver o histórico de obrigações e omissões.</p>

<h3>Passo 2: Entregue as declarações atrasadas</h3>
<ul>
<li><strong>DCTF</strong> (Simples Doméstico): entregue pelo PGD DCTF (programa da Receita)</li>
<li><strong>ECF</strong> (lucro presumido/real): entregue pelo SPED Contábil</li>
<li><strong>DEFIS</strong> (Simples Nacional): entregue pelo Portal do Simples Nacional</li>
<li><strong>DASN</strong> (MEI): entregue no portal do Empreendedor</li>
</ul>

<h3>Passo 3: Pague os débitos com multa por atraso</h3>
<p>Cada declaração entregue em atraso gera multa automática:</p>
<ul>
<li>DCTF: mínimo de R$ 500 por declaração</li>
<li>ECF: 0,25% da receita bruta (mínimo R$ 500)</li>
<li>DEFIS: R$ 50 a R$ 100 por mês em atraso (para Simples Nacional)</li>
</ul>
<p>Um contador experiente pode impugnar multas abusivas via processo administrativo, reduzindo significativamente o custo total.</p>

<h3>Passo 4: Aguarde a regularização automática</h3>
<p>Após entrega de todas as declarações pendentes e quitação (ou parcelamento) dos débitos, o sistema da Receita atualiza o status do CNPJ automaticamente em <strong>1 a 5 dias úteis</strong>.</p>

<h3>Passo 5: Verifique a regularização</h3>
<p>Após o prazo, consulte novamente em <a href="/buscar">nossa busca de CNPJ</a> para confirmar que a situação voltou a "ATIVA". Emita também a CND federal para garantir que não há débitos remanescentes.</p>

<h2>Posso parcelar as dívidas?</h2>
<p>Sim. A Receita Federal tem o <strong>Parcelamento Simplificado</strong> (até 60x via e-CAC) e, periodicamente, programas de renegociação como o REFIS e o PERT. Seu contador pode orientar sobre o melhor programa vigente.</p>

<h2>E se a empresa nunca funcionou de verdade?</h2>
<p>Se a empresa foi aberta mas nunca operou, pode ser mais simples <a href="/blog/como-fechar-empresa-baixar-cnpj">dar baixa no CNPJ</a> e abrir um novo do que regularizar. Avalie com seu contador.</p>

<div class="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-6"><h3 class="font-semibold text-slate-900 mb-2">Precisa de ajuda com isso?</h3><p class="text-sm text-slate-700">Nossa rede de parceiros conta com contadores e advogados verificados em todo o Brasil. <a href="/parceiros" class="text-[#0F4C81] font-medium hover:underline">Fale com um especialista →</a></p></div>`,
  },
  {
    slug: "conta-pj-qual-banco-cnpj",
    title: "Conta PJ: qual banco escolher para seu CNPJ em 2026?",
    excerpt: "Quando conta PJ é obrigatória, como escolher entre banco digital e tradicional, documentos necessários e integração contábil.",
    category: "Empreendedorismo",
    publishedAt: "2026-04-24",
    updatedAt: new Date().toISOString().slice(0, 10),
    author: DEFAULT_AUTHOR,
    readingMinutes: 5,
    keywords: ["conta pj qual banco", "conta pj cnpj", "conta corrente empresa", "banco digital pj", "abrir conta pj"],
    body: `<p>Uma das primeiras dúvidas de quem abre empresa é: "Preciso mesmo de conta PJ?" A resposta depende do tipo de empresa — mas na prática, para qualquer negócio que vai crescer, ter uma conta separada é fundamental. Veja tudo o que você precisa saber.</p>

<h2>Conta PJ é obrigatória?</h2>
<p>Para <strong>MEI</strong>: não há obrigação legal explícita. Mas misturar conta pessoal e empresarial complica a prestação de contas e pode gerar problemas no Imposto de Renda do sócio.</p>
<p>Para <strong>ME, EPP e LTDA</strong>: o Código Civil (art. 1.066) e as obrigações de escrituração contábil tornam a conta PJ praticamente obrigatória na prática. Sem ela, é impossível manter a escrituração separada exigida pela legislação.</p>

<h2>Bancos digitais vs tradicionais: o que avaliar?</h2>

<h3>Bancos digitais para PJ</h3>
<p>Principais opções em 2026: Nubank PJ, Mercado Pago PJ, Asaas, PagBank, C6 Business, Conta Simples, Neon PJ, Conta Azul.</p>
<ul>
<li><strong>Prós</strong>: abertura 100% online, sem anuidade, integração com emissão de NF-e, boleto e Pix gratuitos</li>
<li><strong>Contras</strong>: limite de crédito menor, ausência de gerente dedicado, alguns sem integração com ERPs</li>
<li><strong>Ideal para</strong>: MEI, prestadores de serviço, e-commerce pequeno e médio</li>
</ul>

<h3>Bancos tradicionais para PJ</h3>
<p>Principais opções: Itaú, Bradesco, Santander, Banco do Brasil, Caixa Econômica.</p>
<ul>
<li><strong>Prós</strong>: maior limite de crédito, folha de pagamento integrada, consórcio e financiamento PJ, gerente dedicado</li>
<li><strong>Contras</strong>: taxas de manutenção (R$ 50 a R$ 200/mês), abertura presencial ou digital mais burocrática</li>
<li><strong>Ideal para</strong>: empresas com folha de pagamento, que precisam de crédito, que participam de licitações</li>
</ul>

<h2>O que avaliar na escolha</h2>
<ol>
<li><strong>Integração contábil</strong>: verifique se o banco exporta extrato no formato OFX para seu sistema contábil. Isso economiza horas do contador.</li>
<li><strong>Tarifas de TED/PIX/boleto</strong>: para quem recebe muitos boletos, bancos com boleto gratuito fazem grande diferença.</li>
<li><strong>Limite de Pix</strong>: bancos digitais têm limites menores no início. Para empresas com transações grandes, confirme o limite.</li>
<li><strong>Crédito e capital de giro</strong>: se precisará de financiamento nos próximos 12 meses, banco tradicional tem mais opções.</li>
<li><strong>Integração com marketplace</strong>: para e-commerce, verifique se o banco integra com sua plataforma (Shopify, WooCommerce, VTEX).</li>
</ol>

<h2>Documentos para abrir conta PJ</h2>
<ul>
<li>CNPJ ativo (verifique situação em <a href="/buscar">nossa busca</a>)</li>
<li>Contrato Social (LTDA) ou Certificado do MEI (CCMEI)</li>
<li>RG e CPF de todos os sócios com participação acima de 25%</li>
<li>Comprovante de endereço da empresa</li>
<li>Faturamento estimado mensal (alguns bancos pedem)</li>
</ul>

<h2>Integração com a contabilidade</h2>
<p>Se você usa <a href="/blog/preciso-de-contador-para-abrir-empresa">contador</a>, escolha um banco que permita ao escritório acessar o extrato diretamente ou que exporte em OFX/CSV. Isso reduz erros e economiza tempo na conciliação bancária.</p>
<p>Bancos como Conta Azul e Asaas têm integrações nativas com sistemas de gestão. Verifique se seu escritório contábil tem preferência.</p>

<div class="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-6"><h3 class="font-semibold text-slate-900 mb-2">Precisa de ajuda com isso?</h3><p class="text-sm text-slate-700">Nossa rede de parceiros conta com contadores e advogados verificados em todo o Brasil. <a href="/parceiros" class="text-[#0F4C81] font-medium hover:underline">Fale com um especialista →</a></p></div>`,
  },
  {
    slug: "holding-familiar-o-que-e-vale-a-pena",
    title: "Holding familiar: o que é, como funciona e vale a pena?",
    excerpt: "Proteção patrimonial, redução de ITCMD e planejamento sucessório: entenda quando a holding familiar compensa.",
    category: "Societário",
    publishedAt: "2026-05-01",
    updatedAt: new Date().toISOString().slice(0, 10),
    author: DEFAULT_AUTHOR,
    readingMinutes: 8,
    keywords: ["holding familiar", "holding familiar o que é", "planejamento sucessório holding", "proteção patrimonial empresa", "ITCMD holding"],
    body: `<p>A holding familiar deixou de ser exclusividade de grandes fortunas. Para patrimônios acima de R$ 500 mil em imóveis e participações societárias, os benefícios já superam os custos de estruturação. Entenda o que é, como funciona e quando realmente vale a pena.</p>

<h2>O que é holding familiar?</h2>
<p>Uma <strong>holding familiar</strong> é uma empresa — geralmente uma LTDA ou SA — criada com o objetivo de concentrar e administrar o patrimônio de uma família: imóveis, participações em outras empresas, investimentos financeiros e outros bens. Em vez de cada membro da família possuir bens diretamente, eles possuem cotas da holding, que por sua vez possui os bens.</p>

<h2>Quais são as vantagens?</h2>

<h3>1. Planejamento sucessório</h3>
<p>Com a holding, os pais podem transferir cotas para os filhos ainda em vida (doação de cotas), com ou sem reserva de usufruto. Isso significa que:</p>
<ul>
<li>O processo de herança é simplificado — em vez de inventário de cada bem, há transferência de cotas</li>
<li>Reduz drasticamente o tempo e custo do inventário</li>
<li>Evita disputas sobre a divisão de cada bem individualmente</li>
</ul>

<h3>2. Redução do ITCMD</h3>
<p>O <strong>ITCMD (Imposto sobre Transmissão Causa Mortis e Doação)</strong> incide sobre heranças e doações. Em estados como SP, a alíquota é de 4%. Em outros (RJ, CE, BA) pode chegar a 8%. Com planejamento via holding:</p>
<ul>
<li>A base de cálculo pode ser o <strong>valor patrimonial das cotas</strong> (às vezes menor que o valor de mercado dos imóveis)</li>
<li>Doações parceladas de cotas ao longo dos anos aproveitam as isenções anuais</li>
<li>Cláusulas de impenhorabilidade e incomunicabilidade protegem o patrimônio de cônjuges e credores dos filhos</li>
</ul>

<h3>3. Proteção patrimonial</h3>
<p>Bens dentro da holding são patrimônio da empresa, não dos sócios individualmente. Na prática:</p>
<ul>
<li>Credores dos sócios não podem penhorar bens da holding diretamente (exceto em fraude à execução)</li>
<li>Separação clara entre patrimônio pessoal e empresarial</li>
<li>Proteção em caso de divórcio dos filhos (com cláusula de incomunicabilidade)</li>
</ul>

<h3>4. Gestão centralizada</h3>
<p>Imóveis alugados, participações em múltiplas empresas, dividendos — tudo administrado por uma única entidade, com contabilidade centralizada.</p>

<h2>Quem deve ter uma holding familiar?</h2>
<p>Avalie a holding se você tem:</p>
<ul>
<li>Patrimônio imobiliário acima de R$ 500 mil</li>
<li>Participação em 2+ empresas operacionais</li>
<li>Filhos maiores ou próximos da maioridade</li>
<li>Receio de conflito na divisão de herança</li>
<li>Negócio familiar que precisa de governança estruturada</li>
</ul>

<h2>Quanto custa estruturar uma holding familiar?</h2>
<ul>
<li><strong>Honorários do advogado</strong>: R$ 3.000 a R$ 15.000 (depende da complexidade e do patrimônio)</li>
<li><strong>Honorários do contador</strong>: R$ 1.500 a R$ 5.000 para estruturar + R$ 500 a R$ 1.500/mês de manutenção</li>
<li><strong>ITBI (imóveis)</strong>: a integralização de imóveis na holding pode gerar ITBI (2-3% do valor) — mas há decisões judiciais reconhecendo isenção para holdings sem atividade imobiliária principal</li>
<li><strong>Registro e taxas</strong>: R$ 200 a R$ 600</li>
</ul>

<h2>Riscos e limitações</h2>
<p>A holding familiar não é mágica. Atenção para:</p>
<ul>
<li><strong>Fraude à execução</strong>: transferir bens para a holding para escapar de dívidas já existentes é crime</li>
<li><strong>Custo de manutenção</strong>: a holding tem obrigações contábeis e fiscais mensais mesmo sem movimentação</li>
<li><strong>Mudança na legislação do ITCMD</strong>: há projetos em tramitação para tributar holdings mais agressivamente</li>
</ul>

<p>Antes de contratar, pesquise os dados das empresas do advogado e contador na nossa base: <a href="/buscar">busca de CNPJ</a>. Verifique também o <a href="/socios">quadro societário</a> para entender a experiência do profissional.</p>

<div class="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-6"><h3 class="font-semibold text-slate-900 mb-2">Precisa de ajuda com isso?</h3><p class="text-sm text-slate-700">Nossa rede de parceiros conta com contadores e advogados verificados em todo o Brasil. <a href="/parceiros" class="text-[#0F4C81] font-medium hover:underline">Fale com um especialista →</a></p></div>`,
  },
  {
    slug: "como-fechar-empresa-baixar-cnpj",
    title: "Como fechar empresa e baixar o CNPJ: guia completo 2026",
    excerpt: "Baixa simples vs distrato formal, documentos necessários, prazo, custo e o que acontece com as dívidas da empresa.",
    category: "Empreendedorismo",
    publishedAt: "2026-05-08",
    updatedAt: new Date().toISOString().slice(0, 10),
    author: DEFAULT_AUTHOR,
    readingMinutes: 6,
    keywords: ["como fechar empresa", "baixar cnpj", "encerrar empresa", "distrato social", "baixa cnpj receita federal"],
    body: `<p>Fechar uma empresa no Brasil é menos simples do que abrir — mas ficou muito mais fácil depois das reformas de desburocratização dos últimos anos. Entenda o processo, os custos e o que acontece com as dívidas.</p>

<h2>Situações que levam ao encerramento</h2>
<ul>
<li>Negócio não foi adiante</li>
<li>Venda da empresa (sem continuidade do CNPJ)</li>
<li>Aposentadoria ou incapacidade do sócio único</li>
<li>Dissolução por desavenças entre sócios</li>
<li>Impossibilidade de cumprir o objeto social</li>
</ul>

<h2>Tipos de encerramento</h2>

<h3>MEI: baixa simplificada</h3>
<p>Para MEI, o processo é 100% online pelo Portal do Empreendedor (gov.br/mei). Basta acessar com sua conta gov.br, ir em "Cancelar CNPJ" e confirmar. O CNPJ fica com status BAIXADA em poucos dias. Não é necessário contador ou advogado.</p>

<h3>ME, EPP, EI: baixa simplificada (Lei 140/2018)</h3>
<p>A <strong>Lei Complementar 140/2018</strong> permite que empresas de pequeno porte encerrem as atividades mesmo com pendências, desde que os sócios assinem declaração de responsabilidade pelas dívidas. O processo é:</p>
<ol>
<li>Declaração de encerramento no Portal REDESIM (gov.br/redesim)</li>
<li>Os sócios assumem responsabilidade pessoal por dívidas futuras</li>
<li>Baixa expedida em até 60 dias</li>
</ol>

<h3>LTDA: distrato social formal</h3>
<p>Para LTDAs com múltiplos sócios, o encerramento requer:</p>
<ol>
<li>Assembleia de sócios deliberando o encerramento (ata registrada)</li>
<li>Distrato social elaborado por advogado ou contador</li>
<li>Registro do distrato na Junta Comercial</li>
<li>Baixa nas fazendas estadual e municipal</li>
<li>Baixa na Receita Federal</li>
</ol>
<p>Custo: R$ 500 a R$ 2.000 em honorários + taxas da Junta (R$ 100 a R$ 400).</p>

<h2>Documentos necessários (LTDA)</h2>
<ul>
<li>Ata de dissolução ou instrumento de distrato</li>
<li>Certidões negativas federais, estaduais e municipais</li>
<li>Declaração de quitação do FGTS (Caixa Econômica)</li>
<li>Comprovante de encerramento das obrigações trabalhistas</li>
<li>Últimas declarações entregues (ECF, DCTF, DEFIS)</li>
</ul>

<h2>O que acontece com as dívidas?</h2>
<p>Este é o ponto mais importante. A baixa do CNPJ <strong>não extingue as dívidas</strong>:</p>
<ul>
<li><strong>Dívidas tributárias</strong>: permanecem e podem ser cobradas dos sócios-administradores (art. 135 do CTN)</li>
<li><strong>Dívidas trabalhistas</strong>: sócios respondem ilimitadamente em alguns casos</li>
<li><strong>Dívidas civis</strong>: credores podem recorrer ao Judiciário para responsabilizar sócios</li>
</ul>
<p>Por isso, o ideal é quitar todas as obrigações antes de dar baixa, ou negociar parcelamentos.</p>

<h2>Prazo médio para encerramento</h2>
<ul>
<li>MEI: 3 a 10 dias úteis</li>
<li>ME/EPP via REDESIM: 30 a 60 dias</li>
<li>LTDA com distrato formal: 60 a 120 dias</li>
</ul>

<p>Verifique a situação cadastral atual do seu CNPJ em <a href="/buscar">nossa busca</a>. Se já estiver INAPTA, leia sobre <a href="/blog/como-regularizar-empresa-inapta">como regularizar</a> antes de dar baixa, pois a regularização pode ser mais vantajosa.</p>

<div class="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-6"><h3 class="font-semibold text-slate-900 mb-2">Precisa de ajuda com isso?</h3><p class="text-sm text-slate-700">Nossa rede de parceiros conta com contadores e advogados verificados em todo o Brasil. <a href="/parceiros" class="text-[#0F4C81] font-medium hover:underline">Fale com um especialista →</a></p></div>`,
  },
  {
    slug: "simples-nacional-como-aderir",
    title: "Simples Nacional: quem pode aderir e como fazer em 2026",
    excerpt: "Quem pode entrar no Simples Nacional, período de adesão (janeiro), alíquotas por anexo e vantagens em relação ao Lucro Presumido.",
    category: "Tributário",
    publishedAt: "2026-05-15",
    updatedAt: new Date().toISOString().slice(0, 10),
    author: DEFAULT_AUTHOR,
    readingMinutes: 7,
    keywords: ["simples nacional como aderir", "quem pode aderir simples nacional", "adesão simples nacional", "alíquotas simples nacional 2026"],
    body: `<p>O <strong>Simples Nacional</strong> é o regime tributário mais utilizado pelas micro e pequenas empresas brasileiras. Com uma alíquota unificada que reúne até 8 tributos em uma única guia, ele simplifica a vida do empresário e pode significar grande economia dependendo da atividade. Mas há regras estritas de adesão que muita gente desconhece.</p>

<h2>Quem pode optar pelo Simples Nacional?</h2>
<p>Para aderir ao Simples Nacional, a empresa deve:</p>
<ul>
<li><strong>Faturamento</strong>: ter receita bruta anual de até R$ 4.800.000,00 (incluindo todos os estabelecimentos)</li>
<li><strong>Natureza jurídica</strong>: ME (Microempresa) ou EPP (Empresa de Pequeno Porte)</li>
<li><strong>Regularidade fiscal</strong>: não ter débitos com a Receita Federal, FGTS, estados e municípios</li>
<li><strong>CNAE permitido</strong>: não exercer atividade vedada pelo Simples</li>
</ul>

<h2>Atividades vedadas no Simples Nacional</h2>
<p>Algumas atividades são proibidas no Simples por lei:</p>
<ul>
<li>Bancos, financeiras e seguradoras</li>
<li>Empresas com sócio domiciliado no exterior</li>
<li>SA (Sociedade Anônima)</li>
<li>Cooperativas (exceto agropecuárias)</li>
<li>Certas atividades de saúde (medicina, odontologia, psicologia em alguns casos)</li>
<li>Empresas com receita de exportação de combustíveis</li>
</ul>
<p>Para verificar se seu CNAE é permitido, consulte o Anexo da Resolução CGSN 140/2018 ou pergunte ao seu contador.</p>

<h2>Quando fazer a adesão?</h2>
<p>A adesão ao Simples Nacional <strong>só pode ser feita em janeiro de cada ano</strong>, com efeitos a partir de 1º de janeiro. O prazo costuma ser até o último dia útil de janeiro.</p>
<p><strong>Exceção</strong>: empresas recém-abertas têm prazo de 30 dias após a data de registro para optar pelo Simples (com efeito retroativo à data de abertura).</p>

<h2>Como fazer a adesão</h2>
<ol>
<li>Acesse o <strong>Portal do Simples Nacional</strong> (simples.receita.fazenda.gov.br) com certificado digital ou conta gov.br</li>
<li>Vá em "Simples Nacional" → "Opção pelo Simples Nacional"</li>
<li>Verifique pendências bloqueadoras (o sistema mostra automaticamente)</li>
<li>Regularize pendências e retorne para confirmar a opção</li>
<li>Imprima o comprovante de opção</li>
</ol>

<h2>Alíquotas por Anexo em 2026</h2>
<p>O Simples tem 6 anexos com alíquotas diferentes:</p>
<ul>
<li><strong>Anexo I</strong>: Comércio — 4% a 19%</li>
<li><strong>Anexo II</strong>: Indústria — 4,5% a 30%</li>
<li><strong>Anexo III</strong>: Serviços (locação, academias, transporte, escritórios) — 6% a 33%</li>
<li><strong>Anexo IV</strong>: Serviços (construção civil, vigilância, limpeza) — 4,5% a 33%</li>
<li><strong>Anexo V</strong>: Serviços especializados (medicina, engenharia, TI, publicidade) — 15,5% a 30,5%</li>
</ul>

<h2>Simples vs Lucro Presumido: quando o Simples perde?</h2>
<p>Atenção: para empresas com alto fator-R (folha de pagamento alta em relação ao faturamento) enquadradas no Anexo V, o Lucro Presumido pode ser mais vantajoso. Peça a seu contador uma simulação dos dois regimes antes de aderir.</p>

<p>Para verificar o regime tributário de empresas concorrentes, consulte <a href="/buscar">nossa busca de CNPJ</a> — mostramos se a empresa é optante pelo Simples e pelo MEI. Veja também a <a href="/blog/mei-simples-lucro-real-diferencas">comparação entre MEI, Simples e Lucro Real</a>.</p>

<div class="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-6"><h3 class="font-semibold text-slate-900 mb-2">Precisa de ajuda com isso?</h3><p class="text-sm text-slate-700">Nossa rede de parceiros conta com contadores e advogados verificados em todo o Brasil. <a href="/parceiros" class="text-[#0F4C81] font-medium hover:underline">Fale com um especialista →</a></p></div>`,
  },
  {
    slug: "contrato-social-o-que-e-como-alterar",
    title: "Contrato social: o que é, o que deve conter e como alterar",
    excerpt: "O contrato social é a certidão de nascimento da LTDA. Veja o que deve conter e como fazer alteração de sócio, endereço ou objeto social.",
    category: "Societário",
    publishedAt: "2026-05-20",
    updatedAt: new Date().toISOString().slice(0, 10),
    author: DEFAULT_AUTHOR,
    readingMinutes: 7,
    keywords: ["contrato social empresa", "o que é contrato social", "alterar contrato social", "alteração contratual junta comercial"],
    body: `<p>O contrato social é o documento fundador de uma Sociedade Limitada (LTDA) — equivale à certidão de nascimento da empresa. Ele define as regras do jogo entre os sócios, a atividade da empresa e as condições de funcionamento. Entenda o que deve conter e como alterar quando necessário.</p>

<h2>O que é o contrato social?</h2>
<p>O contrato social é um instrumento público ou particular que formaliza a criação da sociedade e estabelece os direitos e obrigações dos sócios. Ele é registrado na <strong>Junta Comercial</strong> do estado onde a empresa tem sede, e seu número de registro (NIRE) é o que dá personalidade jurídica à empresa antes mesmo do CNPJ.</p>

<h2>O que o contrato social deve obrigatoriamente conter</h2>
<p>O <strong>art. 997 do Código Civil</strong> estabelece os elementos essenciais:</p>
<ol>
<li>Nome, qualificação e domicílio de cada sócio</li>
<li>Denominação social (razão social) e sede da sociedade</li>
<li>Objeto social — atividade que a empresa vai exercer</li>
<li>Capital social e a participação de cada sócio (em R$ e/ou porcentagem)</li>
<li>Forma de administração — quem pode assinar pela empresa</li>
<li>Participação de cada sócio nos lucros e perdas</li>
<li>Se os sócios respondem ou não pelas dívidas além do capital social</li>
<li>Prazo de duração — geralmente indeterminado</li>
</ol>

<h2>Cláusulas recomendadas (além das obrigatórias)</h2>
<ul>
<li><strong>Direito de preferência</strong>: sócios têm preferência na compra de cotas antes de terceiros</li>
<li><strong>Restrição de transferência</strong>: impede que sócio venda cotas sem aprovação dos demais</li>
<li><strong>Cláusula de resolução de impasse</strong>: o que fazer quando não há acordo (arbitragem, compra obrigatória)</li>
<li><strong>Non-compete</strong>: sócio que sair não pode abrir empresa concorrente por X anos</li>
<li><strong>Vesting</strong>: cotas do sócio sendo adquiridas ao longo do tempo</li>
</ul>

<h2>Quando é necessário alterar o contrato social?</h2>
<p>A alteração contratual (aditamento) é obrigatória quando há:</p>
<ul>
<li>Entrada ou saída de sócio</li>
<li>Mudança de endereço da sede</li>
<li>Alteração do objeto social (atividade)</li>
<li>Mudança da razão social</li>
<li>Aumento ou redução do capital social</li>
<li>Mudança na administração (quem gerencia a empresa)</li>
<li>Transformação societária (LTDA para SA, por exemplo)</li>
</ul>

<h2>Como fazer a alteração contratual</h2>
<ol>
<li><strong>Elaborar o instrumento de alteração</strong>: um contador ou advogado rédige a "Alteração Contratual" ou "Consolidação do Contrato Social"</li>
<li><strong>Coletar assinaturas</strong>: todos os sócios devem assinar (ou a maioria conforme previsto no contrato original)</li>
<li><strong>Registro na Junta Comercial</strong>: o documento é protocolado na Junta do estado. Algumas Juntas aceitam digital com certificado e-CNPJ</li>
<li><strong>Atualização na Receita Federal</strong>: automática via REDESIM em 1-5 dias após aprovação da Junta</li>
</ol>

<h2>Prazos e custos</h2>
<ul>
<li><strong>Elaboração por contador</strong>: R$ 200 a R$ 600</li>
<li><strong>Elaboração por advogado</strong>: R$ 500 a R$ 2.000 (para alterações complexas)</li>
<li><strong>Taxa da Junta</strong>: R$ 50 a R$ 200 dependendo da UF</li>
<li><strong>Prazo na Junta</strong>: 2 a 10 dias úteis</li>
</ul>

<p>Após a alteração, consulte em <a href="/buscar">nossa busca de CNPJ</a> para verificar se os dados foram atualizados. A atualização dos sócios no QSA pode ser verificada na <a href="/socios">busca de sócios</a>. Para quem está comprando ou vendendo empresa, leia nosso guia de <a href="/blog/due-diligence-compra-empresa-checklist">due diligence em M&A</a>.</p>

<div class="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-6"><h3 class="font-semibold text-slate-900 mb-2">Precisa de ajuda com isso?</h3><p class="text-sm text-slate-700">Nossa rede de parceiros conta com contadores e advogados verificados em todo o Brasil. <a href="/parceiros" class="text-[#0F4C81] font-medium hover:underline">Fale com um especialista →</a></p></div>`,
  },
  {
    slug: "como-consultar-socios-empresa-cnpj",
    title: "Como consultar sócios de uma empresa pelo CNPJ",
    excerpt: "O QSA (Quadro de Sócios e Administradores) é público. Veja o que ele revela e como usar para due diligence.",
    category: "Consulta CNPJ",
    publishedAt: "2026-03-22",
    updatedAt: new Date().toISOString().slice(0, 10),
    author: DEFAULT_AUTHOR,
    readingMinutes: 5,
    keywords: ["como consultar sócios empresa cnpj", "quadro societário consulta", "sócios empresa cnpj grátis", "QSA consulta"],
    body: `<p>Saber quem são os sócios de uma empresa é informação pública, acessível a qualquer pessoa. O <strong>QSA (Quadro de Sócios e Administradores)</strong> está disponível na base de dados abertos da Receita Federal e pode ser consultado gratuitamente. Veja como fazer e o que essa informação revela.</p>

<h2>O que é o QSA?</h2>
<p>O Quadro de Sócios e Administradores (QSA) é a lista oficial de quem participa do capital social de uma empresa e quem a administra. Toda empresa brasileira — exceto o MEI — tem um QSA registrado na Receita Federal, que é atualizado sempre que há alteração no contrato social.</p>

<h2>O que o QSA revela?</h2>
<ul>
<li><strong>Nome completo do sócio</strong>: pessoa física (PF) ou jurídica (PJ)</li>
<li><strong>CPF/CNPJ mascarado</strong>: parcialmente oculto por força da LGPD, mas suficiente para identificação combinada com nome</li>
<li><strong>Qualificação</strong>: sócio-administrador, sócio quotista, diretor, presidente, representante legal, etc.</li>
<li><strong>Data de entrada na sociedade</strong>: quando o sócio entrou na empresa</li>
<li><strong>País de domicílio</strong>: relevante para verificar sócios estrangeiros</li>
</ul>

<h2>Como consultar os sócios de uma empresa</h2>
<p>Há três formas principais:</p>

<h3>1. Jurídico Online (mais completo)</h3>
<p>Em <a href="/socios">nossa busca de sócios</a>, você pode pesquisar tanto por CNPJ da empresa quanto pelo nome do sócio. Ao clicar no nome de um sócio, vê <strong>todas as empresas onde ele aparece como sócio ou administrador</strong> — funcionalidade essencial para mapear grupos econômicos.</p>

<h3>2. Receita Federal (oficial, mas limitado)</h3>
<p>O portal da Receita exibe o QSA na consulta de CNPJ, mas não permite busca por nome de sócio nem cruzamento de vínculos.</p>

<h3>3. Base de dados abertos (para desenvolvedores)</h3>
<p>A Receita disponibiliza os arquivos brutos do CNPJ em arquivos.receitafederal.gov.br — mas processar 50 GB de CSVs não é trivial.</p>

<h2>Para que serve consultar o QSA?</h2>

<h3>Due diligence antes de assinar contratos</h3>
<p>Antes de fechar um contrato com um fornecedor ou parceiro, verifique:</p>
<ul>
<li>O sócio-administrador é a mesma pessoa com quem você está negociando?</li>
<li>O representante tem poderes para assinar o contrato (gerente × sócio-administrador)?</li>
<li>Há sócios em outras empresas com histórico ruim (inaptas, baixadas com dívidas)?</li>
</ul>

<h3>Análise de crédito</h3>
<p>Bancos e financeiras usam o QSA para mapear o grupo econômico do devedor — se uma empresa entra em default, o banco verifica se o sócio tem outras empresas que possam honrar a dívida.</p>

<h3>Investigação de redes corporativas</h3>
<p>Cruzar sócios entre empresas revela grupos econômicos que se declaram independentes mas têm o mesmo controlador — informação valiosa para licitações, concorrência e jornalismo investigativo.</p>

<h2>Limitações do QSA</h2>
<ul>
<li>O QSA não mostra a <strong>participação percentual</strong> de cada sócio (isso não está nos dados abertos da Receita)</li>
<li>Mudanças recentes podem levar até 30 dias para aparecer (prazo de registro na Junta + atualização RFB)</li>
<li>Acordos de sócios paralelos (acordo de quotistas) não aparecem</li>
</ul>

<p>Use <a href="/buscar">nossa busca de CNPJ</a> para pesquisar a empresa e acesse diretamente a seção de sócios. Para buscar todas as empresas de uma pessoa, use <a href="/socios">a busca por sócio</a>. Para uma due diligence completa em compra de empresa, veja nosso <a href="/blog/due-diligence-compra-empresa-checklist">checklist de M&A</a>.</p>`,
  },
  {
    slug: "certidao-negativa-pj-como-obter",
    title: "Certidão negativa para empresa (PJ): como obter cada uma",
    excerpt: "CND federal, estadual, municipal e trabalhista (FGTS): onde emitir, prazo de validade e quando é exigida cada certidão.",
    category: "Tributário",
    publishedAt: "2026-03-29",
    updatedAt: new Date().toISOString().slice(0, 10),
    author: DEFAULT_AUTHOR,
    readingMinutes: 6,
    keywords: ["certidão negativa empresa", "CND empresa", "certidão negativa federal", "certidão negativa FGTS", "certidão negativa trabalhista"],
    body: `<p>A certidão negativa (ou certidão positiva com efeito de negativa) é o comprovante de que a empresa está em dia com suas obrigações tributárias e trabalhistas. Ela é exigida em licitações, financiamentos, contratos com órgãos públicos e diversas outras situações. Saiba onde obter cada uma e quanto tempo de validade têm.</p>

<h2>Por que as certidões são exigidas?</h2>
<p>Qualquer empresa que queira contratar com o governo, obter financiamento bancário ou crédito de fornecedores estratégicos precisa demonstrar regularidade fiscal. As certidões negativas são o instrumento oficial para isso.</p>

<h2>1. Certidão de Débitos Relativos a Créditos Tributários Federais (CND Federal)</h2>
<ul>
<li><strong>O que comprova</strong>: ausência de débitos com a Receita Federal (IRPJ, CSLL, PIS/COFINS, IPI, ITR, etc.) e PGFN (dívida ativa)</li>
<li><strong>Onde emitir</strong>: sítio da Receita Federal → "Certidões e Situação Fiscal" ou certidao.fazenda.gov.br</li>
<li><strong>Prazo de validade</strong>: 6 meses</li>
<li><strong>Custo</strong>: gratuito</li>
<li><strong>Quando é exigida</strong>: licitações federais, financiamentos do BNDES, Simples Nacional, contratos com a União</li>
</ul>
<p>Antes de emitir, verifique se seu CNPJ está ATIVO em <a href="/buscar">nossa busca</a> — CNPJs inaptos têm a certidão bloqueada.</p>

<h2>2. Certidão Negativa Estadual (CND Estadual / SEFAZ)</h2>
<ul>
<li><strong>O que comprova</strong>: regularidade com o ICMS e demais tributos estaduais</li>
<li><strong>Onde emitir</strong>: portal da Secretaria da Fazenda do estado onde a empresa está sediada (SEFAZ-SP, SEFAZ-RJ, SEF-MG, etc.)</li>
<li><strong>Prazo de validade</strong>: 30 a 60 dias (varia por estado)</li>
<li><strong>Custo</strong>: gratuito</li>
<li><strong>Quando é exigida</strong>: licitações estaduais, contratos com estados, transferência de imóveis, financiamentos estaduais</li>
</ul>

<h2>3. Certidão Negativa Municipal (ISS)</h2>
<ul>
<li><strong>O que comprova</strong>: regularidade com o ISS (Imposto Sobre Serviços) e outros tributos municipais</li>
<li><strong>Onde emitir</strong>: portal da Prefeitura do município sede da empresa</li>
<li><strong>Prazo de validade</strong>: 30 a 90 dias (varia por município)</li>
<li><strong>Custo</strong>: gratuito na maioria dos municípios</li>
<li><strong>Quando é exigida</strong>: licitações municipais, alvarás de funcionamento, contratos com prefeituras</li>
</ul>

<h2>4. Certidão de Regularidade do FGTS (CRF)</h2>
<ul>
<li><strong>O que comprova</strong>: regularidade nos recolhimentos do FGTS dos trabalhadores</li>
<li><strong>Onde emitir</strong>: portal da Caixa Econômica Federal (consulta.caixa.gov.br/cauc) ou app FGTS Empresas</li>
<li><strong>Prazo de validade</strong>: 30 dias</li>
<li><strong>Custo</strong>: gratuito</li>
<li><strong>Quando é exigida</strong>: toda licitação pública (obrigatória por lei), financiamentos habitacionais, contratos CLT</li>
</ul>

<h2>5. Certidão Negativa de Débitos Trabalhistas (CNDT)</h2>
<ul>
<li><strong>O que comprova</strong>: ausência de condenações trabalhistas não pagas (TST)</li>
<li><strong>Onde emitir</strong>: aplicativo TST ou tst.jus.br/certidao</li>
<li><strong>Prazo de validade</strong>: 180 dias</li>
<li><strong>Custo</strong>: gratuito</li>
<li><strong>Quando é exigida</strong>: licitações (Lei 12.440/2011 — obrigatória), grandes contratos privados</li>
</ul>

<h2>Certidão positiva com efeito de negativa</h2>
<p>Se houver débito mas ele estiver parcelado, suspenso ou garantido por seguro, a certidão é emitida com a designação "Positiva com Efeitos de Negativa" — tem o mesmo efeito legal da certidão negativa para fins de licitação e contratação.</p>

<p>Para verificar rapidamente a situação cadastral da sua empresa antes de emitir as certidões, use <a href="/buscar">nossa busca de CNPJ gratuita</a>. Se a empresa estiver <a href="/blog/como-regularizar-empresa-inapta">inapta</a>, regularize antes de solicitar as certidões.</p>

<div class="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-6"><h3 class="font-semibold text-slate-900 mb-2">Precisa de ajuda com isso?</h3><p class="text-sm text-slate-700">Nossa rede de parceiros conta com contadores e advogados verificados em todo o Brasil. <a href="/parceiros" class="text-[#0F4C81] font-medium hover:underline">Fale com um especialista →</a></p></div>`,
  },
  {
    slug: "mei-desenquadramento-o-que-fazer",
    title: "MEI desenquadramento: o que fazer quando sai do MEI?",
    excerpt: "Faturou acima de R$ 81 mil ou contratou mais funcionários? Veja o processo de desenquadramento do MEI e como migrar para ME ou EPP.",
    category: "Tributário",
    publishedAt: "2026-04-06",
    updatedAt: new Date().toISOString().slice(0, 10),
    author: DEFAULT_AUTHOR,
    readingMinutes: 6,
    keywords: ["mei desenquadramento", "saiu do mei o que fazer", "limite faturamento mei", "migração mei me", "mei virou me"],
    body: `<p>Crescer é ótimo — mas para o MEI, crescer além do limite pode trazer complicações tributárias se não for bem planejado. Entenda quando ocorre o desenquadramento, como o processo funciona e o que fazer para evitar surpresas fiscais.</p>

<h2>Quando ocorre o desenquadramento do MEI?</h2>
<p>O MEI é obrigado a se desenquadrar quando ocorre qualquer das seguintes situações:</p>
<ol>
<li><strong>Faturamento anual acima de R$ 81.000</strong> — ou R$ 135.000 para MEI transportador de passageiro (novo limite 2023, mantido em 2026)</li>
<li><strong>Contratação de mais de 1 funcionário</strong></li>
<li><strong>Abertura de filial</strong></li>
<li><strong>Entrada de sócio</strong></li>
<li><strong>Prática de atividade não permitida para MEI</strong></li>
<li><strong>Participação em outra empresa como sócio ou titular</strong></li>
</ol>

<h2>O que acontece no desenquadramento?</h2>

<h3>Caso 1: Faturou acima do limite em apenas 1 mês</h3>
<p>Se o excesso foi <strong>menor que 20% do limite anual</strong> (R$ 16.200), o MEI fica no regime até o fim do ano e se desenquadra apenas no próximo exercício (janeiro do ano seguinte), sem tributação retroativa sobre o excesso.</p>

<h3>Caso 2: Faturou acima do limite (excesso acima de 20%)</h3>
<p>Se o faturamento acumulado ultrapassar R$ 97.200 (limite + 20%), o MEI é tributado <strong>retroativamente desde 1º de janeiro daquele ano</strong> pelas alíquotas do Simples Nacional (ou outro regime). Isso pode gerar um imposto adicional significativo.</p>

<h3>Caso 3: Contratou mais de 1 funcionário</h3>
<p>O desenquadramento é imediato. O MEI vira ME no mês seguinte ao da infração.</p>

<h2>Processo de desenquadramento</h2>
<ol>
<li>O MEI (ou contador) acessa o Portal do Simples Nacional</li>
<li>Solicita o desenquadramento voluntário (recomendado fazer antes de ultrapassar o limite)</li>
<li>O CNPJ muda de MEI para ME</li>
<li>A empresa deve optar pelo Simples Nacional se elegível (dentro do prazo de janeiro)</li>
<li>Contratar contador — agora obrigatório para ME</li>
</ol>

<h2>Impacto tributário do desenquadramento</h2>
<p>A diferença é grande. Como MEI, o tributo é um valor fixo mensal. Como ME no Simples:</p>
<ul>
<li>Comércio (Anexo I): alíquota de 4% sobre o faturamento</li>
<li>Serviços (Anexo III): alíquota de 6% sobre o faturamento</li>
<li>Mais INSS proporcional à folha de pagamento</li>
</ul>
<p>Para um faturamento de R$ 100 mil/ano em serviços: MEI pagaria ~R$ 780/ano em DAS. ME no Simples: ~R$ 6.000/ano. A diferença é relevante — mas o ME tem mais benefícios: pode faturar até R$ 360 mil/ano, contratar mais funcionários e emitir mais NF-es.</p>

<h2>Como se preparar antes de ultrapassar o limite</h2>
<ul>
<li>Acompanhe mensalmente o faturamento acumulado</li>
<li>Quando atingir 70% do limite (R$ 56.700), procure um contador para planejar a transição</li>
<li>Solicite o desenquadramento voluntário antes de ultrapassar o limite para evitar retroatividade</li>
<li>Abra conta PJ em banco que suporte ME/EPP se ainda usa conta MEI simples</li>
</ul>

<p>Verifique seu CNPJ em <a href="/buscar">nossa busca</a> para confirmar se ainda aparece como MEI ou se já foi alterado. Se estiver próximo do limite, leia <a href="/blog/mei-simples-lucro-real-diferencas">as diferenças entre MEI, Simples e Lucro Real</a> para entender para onde migrar. Para buscar <a href="/empresas-mei/sp">empresas MEI por estado</a>, acesse nosso diretório.</p>

<div class="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-6"><h3 class="font-semibold text-slate-900 mb-2">Precisa de ajuda com isso?</h3><p class="text-sm text-slate-700">Nossa rede de parceiros conta com contadores e advogados verificados em todo o Brasil. <a href="/parceiros" class="text-[#0F4C81] font-medium hover:underline">Fale com um especialista →</a></p></div>`,
  },
  {
    slug: "due-diligence-compra-empresa-checklist",
    title: "Due diligence na compra de empresa: checklist de 12 itens",
    excerpt: "Checklist completo para M&A: situação cadastral, QSA, licitações, passivo trabalhista, dívidas fiscais e mais. Com links para consulta direta.",
    category: "Due Diligence",
    publishedAt: "2026-04-13",
    updatedAt: new Date().toISOString().slice(0, 10),
    author: DEFAULT_AUTHOR,
    readingMinutes: 8,
    keywords: ["due diligence compra empresa", "checklist due diligence empresa", "due diligence M&A", "comprar empresa due diligence"],
    body: `<p>Comprar uma empresa sem fazer due diligence é como comprar um carro sem verificar o motor. A due diligence (DD) é o processo de investigação aprofundada que precede qualquer aquisição ou investimento em empresa. Este checklist de 12 itens cobre os pontos críticos que todo comprador deve verificar.</p>

<h2>O que é due diligence?</h2>
<p>Due diligence (diligência prévia) é um conjunto estruturado de verificações sobre a situação jurídica, fiscal, trabalhista, operacional e financeira da empresa-alvo. O objetivo é identificar riscos ocultos que possam afetar o valor do negócio ou gerar passivos futuros para o comprador.</p>

<h2>Checklist de 12 itens para due diligence</h2>

<h3>1. Situação cadastral do CNPJ</h3>
<p>Primeiro passo: verifique se o CNPJ está <strong>ATIVO</strong> na Receita Federal. CNPJs inaptos, suspensos ou em processo de baixa têm passivos que podem não estar visíveis nos balanços.</p>
<p>Consulte diretamente em <a href="/buscar">nossa busca de CNPJ gratuita</a>.</p>

<h3>2. Quadro de Sócios e Administradores (QSA)</h3>
<p>Verifique:</p>
<ul>
<li>Os sócios atuais coincidem com o que o vendedor declarou?</li>
<li>Há sócios ocultos ou administradores não declarados?</li>
<li>Algum sócio participa de empresas com processos fiscais ou falimentares?</li>
</ul>
<p>Use <a href="/socios">nossa busca de sócios</a> para cruzar vínculos.</p>

<h3>3. Histórico de alterações societárias</h3>
<p>Solicite as certidões da Junta Comercial com o histórico completo de alterações contratuais. Mudanças frequentes de sócios ou objeto social podem sinalizar instabilidade.</p>

<h3>4. Certidões negativas (fiscais)</h3>
<p>Exija as quatro certidões:</p>
<ul>
<li>CND Federal (Receita Federal + PGFN)</li>
<li>Certidão Estadual (SEFAZ)</li>
<li>Certidão Municipal (ISS)</li>
<li>CRF do FGTS (Caixa Econômica)</li>
</ul>
<p>Saiba como obter cada uma em <a href="/blog/certidao-negativa-pj-como-obter">nosso guia de certidões</a>.</p>

<h3>5. Certidão de Débitos Trabalhistas (CNDT)</h3>
<p>Emita no portal do TST. Processos trabalhistas não pagos são passivo do comprador se não houver cláusula de representação e garantia no contrato de compra.</p>

<h3>6. Passivo fiscal oculto</h3>
<p>Além das certidões, solicite:</p>
<ul>
<li>Extrato CADIN (Cadastro Informativo de Créditos não Quitados do Setor Público Federal)</li>
<li>Consulta à dívida ativa dos estados onde a empresa operou</li>
<li>Confirmação de que todas as declarações dos últimos 5 anos foram entregues</li>
</ul>

<h3>7. Situação trabalhista</h3>
<ul>
<li>Lista completa de funcionários com salário, data de admissão e cargo</li>
<li>Contratos com terceirizados e prestadores PJ</li>
<li>Acordos coletivos vigentes</li>
<li>Reclamações trabalhistas em curso (consultar no TRT da região)</li>
</ul>

<h3>8. Contratos em vigor</h3>
<ul>
<li>Contratos com clientes (receita garantida)</li>
<li>Contratos com fornecedores (cláusulas de exclusividade, multas)</li>
<li>Contratos de locação</li>
<li>Contratos de financiamento e garantias</li>
</ul>

<h3>9. Propriedade intelectual</h3>
<ul>
<li>Marcas registradas (INPI)</li>
<li>Patentes</li>
<li>Domínios e ativos digitais</li>
<li>Software desenvolvido internamente — está sob licença adequada?</li>
</ul>

<h3>10. Licitações ganhas e em execução</h3>
<p>Empresas com contratos públicos têm receita garantida, mas também obrigações rígidas. Verifique:</p>
<ul>
<li>Contratos com órgãos públicos vigentes e valores</li>
<li>Histórico de penalizações em licitações</li>
<li>Certidão de inidoneidade (TCU, portais de transparência estaduais)</li>
</ul>

<h3>11. Regularidade societária</h3>
<p>O <a href="/blog/contrato-social-o-que-e-como-alterar">contrato social</a> deve estar atualizado com o quadro societário atual. Verifique se há cláusulas que impedem a transferência das cotas ou que dão direito de preferência a terceiros.</p>

<h3>12. Valuation e auditoria financeira</h3>
<ul>
<li>Balanços dos últimos 3 exercícios auditados por contador independente</li>
<li>Demonstração de resultados (DRE) detalhada</li>
<li>Fluxo de caixa histórico</li>
<li>Dívidas bancárias e garantias prestadas</li>
<li>Estoque (inventário físico ou laudos)</li>
</ul>

<h2>Estrutura do processo de M&A</h2>
<p>A due diligence se insere em um processo maior:</p>
<ol>
<li><strong>NDA</strong> (acordo de confidencialidade)</li>
<li><strong>LOI</strong> (carta de intenções com termos preliminares)</li>
<li><strong>Due diligence</strong> (este checklist)</li>
<li><strong>Negociação final</strong> (ajuste de preço por riscos encontrados)</li>
<li><strong>SPA</strong> (contrato de compra e venda de cotas)</li>
<li><strong>Fechamento e registro na Junta</strong></li>
</ol>

<p>Inicie a due diligence sempre pela consulta do CNPJ em <a href="/buscar">nossa plataforma</a> — em segundos você tem situação cadastral, sócios e CNAE. Para guidance jurídico completo em M&A, veja <a href="/blog/quando-contratar-advogado-empresarial">quando contratar advogado empresarial</a>.</p>

<div class="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-6"><h3 class="font-semibold text-slate-900 mb-2">Precisa de ajuda com isso?</h3><p class="text-sm text-slate-700">Nossa rede de parceiros conta com contadores e advogados verificados em todo o Brasil. <a href="/parceiros" class="text-[#0F4C81] font-medium hover:underline">Fale com um especialista →</a></p></div>`,
  },
  {
    slug: "empresa-individual-ou-socio-como-decidir",
    title: "Empresa individual ou com sócio: como decidir?",
    excerpt: "SLU/EI vs LTDA com sócio: quando ter sócio agrega, como formalizar e as armadilhas do contrato de sociedade.",
    category: "Societário",
    publishedAt: "2026-04-20",
    updatedAt: new Date().toISOString().slice(0, 10),
    author: DEFAULT_AUTHOR,
    readingMinutes: 7,
    keywords: ["empresa individual ou com sócio", "SLU vs LTDA", "abrir empresa com sócio", "sócio empresa vantagens desvantagens"],
    body: `<p>Uma das decisões mais importantes ao abrir empresa é: vou sozinho ou com sócio? Não há resposta universal — cada modelo tem vantagens e riscos que variam conforme o seu negócio, personalidade e momento de vida. Veja um guia honesto para essa decisão.</p>

<h2>Tipos de empresa individual (sem sócio)</h2>

<h3>MEI — Microempreendedor Individual</h3>
<p>Para autônomos com faturamento até R$ 81 mil/ano. Nenhum sócio permitido. Simples, barato e sem burocracia. Mas muito limitado em porte e atividade. Verifique empresas MEI em <a href="/empresas-mei/sp">nossa lista por estado</a>.</p>

<h3>EI — Empresa Individual</h3>
<p>Empresário individual registrado na Junta Comercial. <strong>Responde ilimitadamente pelas dívidas</strong> da empresa — patrimônio pessoal está em risco. Pouco usado desde o surgimento da SLU.</p>

<h3>SLU — Sociedade Limitada Unipessoal</h3>
<p>Criada em 2019 pela Lei 13.874. Permite abrir uma LTDA com apenas <strong>um sócio</strong>, com responsabilidade limitada ao capital social. É o melhor formato para quem quer trabalhar sozinho com proteção patrimonial. Veja como funciona em <a href="/blog/como-abrir-empresa-passo-a-passo">nosso guia de abertura de empresa</a>.</p>

<h2>LTDA com sócios: quando faz sentido?</h2>
<p>A Sociedade Limitada com múltiplos sócios faz sentido quando:</p>
<ul>
<li>Um sócio traz capital que você não tem</li>
<li>Um sócio traz competência complementar (técnica, comercial, operacional)</li>
<li>Um sócio traz relacionamentos (clientes, fornecedores, governo)</li>
<li>Divisão do risco operacional e financeiro é estratégica</li>
<li>A atividade exige presença simultânea em múltiplos locais</li>
</ul>

<h2>Quando sócio é armadilha?</h2>
<ul>
<li><strong>Sócio "de fachada"</strong> para cumprir requisito mínimo da antiga lei: desde 2019 a SLU eliminou essa necessidade</li>
<li><strong>Sócio sem alinhamento de valores e objetivos</strong>: a maioria das disputas societárias vem de expectativas não alinhadas desde o início</li>
<li><strong>Sócio sem contribuição real</strong>: sócio que não traz capital, trabalho nem relacionamentos dilui sua participação sem contrapartida</li>
<li><strong>Divisão 50/50</strong> sem mecanismo de desempate: impasse que pode paralisar a empresa</li>
</ul>

<h2>Como formalizar corretamente uma sociedade</h2>
<p>Se decidiu ter sócio, o <a href="/blog/contrato-social-o-que-e-como-alterar">contrato social</a> precisa cobrir:</p>
<ol>
<li><strong>Contribuição de cada sócio</strong>: capital, trabalho (pró-labore), clientes, IP</li>
<li><strong>Distribuição de lucros</strong>: proporcional às cotas ou diferente?</li>
<li><strong>Regras de saída</strong>: quanto o sócio leva se sair? Quem compra as cotas?</li>
<li><strong>Vesting</strong>: cotas são adquiridas ao longo do tempo ou imediatamente?</li>
<li><strong>Non-compete</strong>: ex-sócio pode abrir empresa concorrente?</li>
<li><strong>Mecanismo de deadlock</strong>: o que fazer quando os dois sócios discordam?</li>
</ol>

<h2>Investidor × Sócio operacional</h2>
<p>Se você precisa de capital, avalie as diferenças:</p>
<ul>
<li><strong>Sócio com cotas</strong>: fica permanentemente na empresa, participa de decisões, divide lucros indefinidamente</li>
<li><strong>Mútuo (empréstimo)</strong>: simples, o investidor recebe de volta com juros, sem interferência operacional</li>
<li><strong>Investidor com cotas preferenciais</strong>: entra e tem direito a dividendos prioritários, mas geralmente sem voto</li>
</ul>

<h2>Pesquisa antes de decidir</h2>
<p>Antes de formalizar a sociedade, pesquise as empresas anteriores dos potenciais sócios:</p>
<ul>
<li>Em quais empresas ele já foi sócio? Use <a href="/socios">nossa busca de sócios</a></li>
<li>Essas empresas estão ativas, baixadas ou inaptas?</li>
<li>Há padrão de abandono ou encerramento problemático?</li>
</ul>
<p>Também consulte o CNPJ das empresas anteriores em <a href="/buscar">nossa busca</a> para ver situação cadastral e histórico.</p>

<div class="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-6"><h3 class="font-semibold text-slate-900 mb-2">Precisa de ajuda com isso?</h3><p class="text-sm text-slate-700">Nossa rede de parceiros conta com contadores e advogados verificados em todo o Brasil. <a href="/parceiros" class="text-[#0F4C81] font-medium hover:underline">Fale com um especialista →</a></p></div>`,
  },
  // ─── Posts de jornalismo de dados — gerados da base de 65M empresas ───────

  {
    slug: "quantas-empresas-existem-no-brasil-2026",
    title: "Quantas empresas existem no Brasil em 2026? Os números reais",
    excerpt: "65,7 milhões de CNPJs registrados, mas só 40% estão ativos. Veja o raio-x completo das empresas brasileiras por estado, porte e regime tributário — dados diretos da Receita Federal.",
    category: "Dados e Estatísticas",
    publishedAt: "2026-06-06",
    updatedAt: "2026-06-06",
    author: DEFAULT_AUTHOR,
    readingMinutes: 7,
    keywords: ["quantas empresas existem no brasil", "número de empresas brasil 2026", "empresas ativas brasil", "cnpj brasil estatísticas"],
    body: `<p>O Brasil tem <strong>65,7 milhões de CNPJs registrados</strong> na Receita Federal. Mas esse número esconde uma realidade surpreendente: menos da metade das empresas que já existiram no país ainda estão funcionando. Este é o raio-x completo, com dados extraídos diretamente da base oficial em junho de 2026.</p>

<h2>Situação cadastral: só 40% estão ativas</h2>
<p>Do total de CNPJs registrados na Receita Federal:</p>
<ul>
<li><strong>26,6 milhões (40,5%) estão ATIVAS</strong> — operando regularmente</li>
<li><strong>30,3 milhões (46,1%) estão BAIXADAS</strong> — encerradas formal ou informalmente</li>
<li><strong>8,5 milhões (12,9%) estão INAPTAS</strong> — abandonadas sem baixa formal, sem declarar impostos há mais de 2 anos</li>
<li><strong>270 mil (0,4%) estão SUSPENSAS</strong> — com irregularidade cadastral em apuração</li>
</ul>

<p>Em outras palavras: <strong>para cada empresa ativa no Brasil, há 1,5 empresa que já fechou ou foi abandonada.</strong></p>

<h2>Regimes tributários das empresas ativas</h2>
<p>Das 26,6 milhões de empresas ativas:</p>
<ul>
<li><strong>20 milhões (75%) optam pelo Simples Nacional</strong> — o regime unificado para pequenas empresas</li>
<li><strong>13 milhões (49%) são MEI</strong> (Microempreendedor Individual) — incluídos no Simples</li>
<li><strong>6,6 milhões (25%) estão no Lucro Presumido, Real ou outro regime</strong></li>
</ul>
<p>O Brasil é, na prática, um país de microempreendedores: metade de todas as empresas ativas são MEI — uma pessoa só, com faturamento até R$ 81.000 por ano.</p>

<h2>Por porte das empresas ativas</h2>
<ul>
<li><strong>Microempresas (ME):</strong> 49 milhões de CNPJs registrados historicamente</li>
<li><strong>Empresas de Pequeno Porte (EPP):</strong> 1,9 milhões</li>
<li><strong>Demais (médio e grande porte):</strong> 14,7 milhões</li>
</ul>

<h2>Ranking por estado: onde há mais e menos empresas ativas</h2>
<p>São Paulo concentra quase 8 milhões de empresas ativas — mais que os 26 estados restantes combinados em vários casos. Mas quando se olha para a <em>qualidade</em> do cadastro — ou seja, a taxa de empresas inaptas — o mapa muda:</p>

<table style="width:100%;border-collapse:collapse;font-size:14px;margin:16px 0">
<thead>
<tr style="background:#f8fafc;border-bottom:2px solid #e2e8f0">
<th style="text-align:left;padding:8px 12px">Estado</th>
<th style="text-align:right;padding:8px 12px">Empresas ativas</th>
<th style="text-align:right;padding:8px 12px">Inaptas</th>
<th style="text-align:right;padding:8px 12px">% inapta</th>
</tr>
</thead>
<tbody>
<tr style="border-bottom:1px solid #f1f5f9"><td style="padding:7px 12px">🔴 Pará</td><td style="text-align:right;padding:7px 12px">491.721</td><td style="text-align:right;padding:7px 12px">235.745</td><td style="text-align:right;padding:7px 12px;color:#dc2626;font-weight:600">17,8%</td></tr>
<tr style="border-bottom:1px solid #f1f5f9"><td style="padding:7px 12px">🔴 Rio de Janeiro</td><td style="text-align:right;padding:7px 12px">2.210.659</td><td style="text-align:right;padding:7px 12px">938.982</td><td style="text-align:right;padding:7px 12px;color:#dc2626;font-weight:600">16,7%</td></tr>
<tr style="border-bottom:1px solid #f1f5f9"><td style="padding:7px 12px">🔴 Maranhão</td><td style="text-align:right;padding:7px 12px">346.186</td><td style="text-align:right;padding:7px 12px">153.565</td><td style="text-align:right;padding:7px 12px;color:#dc2626;font-weight:600">15,8%</td></tr>
<tr style="border-bottom:1px solid #f1f5f9"><td style="padding:7px 12px">🟡 São Paulo</td><td style="text-align:right;padding:7px 12px">7.844.975</td><td style="text-align:right;padding:7px 12px">2.276.899</td><td style="text-align:right;padding:7px 12px;color:#d97706">12,2%</td></tr>
<tr style="border-bottom:1px solid #f1f5f9"><td style="padding:7px 12px">🟡 Rio Grande do Sul</td><td style="text-align:right;padding:7px 12px">1.652.558</td><td style="text-align:right;padding:7px 12px">544.694</td><td style="text-align:right;padding:7px 12px;color:#d97706">12,1%</td></tr>
<tr style="border-bottom:1px solid #f1f5f9"><td style="padding:7px 12px">🟡 Minas Gerais</td><td style="text-align:right;padding:7px 12px">2.757.164</td><td style="text-align:right;padding:7px 12px">750.110</td><td style="text-align:right;padding:7px 12px;color:#d97706">10,5%</td></tr>
<tr style="border-bottom:1px solid #f1f5f9"><td style="padding:7px 12px">🟢 Paraná</td><td style="text-align:right;padding:7px 12px">1.786.659</td><td style="text-align:right;padding:7px 12px">504.144</td><td style="text-align:right;padding:7px 12px;color:#059669">11,6%</td></tr>
<tr><td style="padding:7px 12px">🟢 Santa Catarina</td><td style="text-align:right;padding:7px 12px">1.419.497</td><td style="text-align:right;padding:7px 12px">306.388</td><td style="text-align:right;padding:7px 12px;color:#059669;font-weight:600">9,8%</td></tr>
</tbody>
</table>

<p><strong>Santa Catarina tem a menor taxa de inaptas do Brasil</strong> (9,8%) e a maior proporção de empresas ativas (45,2% do total cadastrado). O Pará lidera negativamente: quase 1 em cada 5 CNPJs está inapto.</p>

<h2>O que é uma empresa INAPTA e por que importa</h2>
<p>Uma empresa torna-se inapta quando não entrega declarações obrigatórias à Receita Federal por dois anos consecutivos. Isso significa que ela:</p>
<ul>
<li><strong>Não pode emitir nota fiscal válida</strong> — qualquer NF emitida por empresa inapta pode ser glosada</li>
<li><strong>Não pode obter certidão negativa</strong></li>
<li><strong>Não pode participar de licitações públicas</strong></li>
<li>Os sócios ficam impedidos de abrir novas empresas em alguns casos</li>
</ul>
<p>Antes de fechar negócio com qualquer empresa, verifique a situação cadastral pelo CNPJ. <a href="/buscar">Consulte gratuitamente no Jurídico Online</a>.</p>

<h2>Metodologia</h2>
<p>Dados extraídos da base pública do CNPJ (Receita Federal), processada e atualizada diariamente pelo Jurídico Online. Total de 65.731.428 registros analisados em junho de 2026. Atualização: diária.</p>`,
  },

  {
    slug: "empresas-mais-antigas-ativas-brasil",
    title: "As empresas mais antigas ainda ativas no Brasil",
    excerpt: "A empresa ativa mais antiga do Brasil abriu em 1891 — tem 135 anos e ainda opera. Conheça as empresas brasileiras com mais de um século de história, verificadas pela Receita Federal.",
    category: "Dados e Estatísticas",
    publishedAt: "2026-06-06",
    updatedAt: "2026-06-06",
    author: DEFAULT_AUTHOR,
    readingMinutes: 5,
    keywords: ["empresa mais antiga do brasil", "empresas centenárias brasil", "cnpj mais antigo brasil", "empresa mais velha brasil ativa"],
    body: `<p>Entre os 65 milhões de CNPJs registrados na Receita Federal, existem empresas abertas antes da República, antes da invenção do avião, antes do automóvel. Filtrando apenas as que estão com situação <strong>ATIVA</strong> hoje — em plena operação — encontramos histórias surpreendentes de longevidade empresarial brasileira.</p>

<h2>A empresa ativa mais antiga do Brasil</h2>
<p>Fundada em <strong>23 de outubro de 1891</strong>, a <strong>Companhia de Tecidos Santanense</strong>, de Minas Gerais, aparece na base da Receita Federal como a empresa com data de início de atividade mais antiga entre as que ainda têm CNPJ registrado. Com 135 anos de história, ela atravessou dois regimes políticos, duas guerras mundiais e diversas crises econômicas.</p>

<p>Curiosamente, ela consta atualmente <em>em recuperação judicial</em> — o que explica por que o CNPJ ainda está ativo mesmo com a empresa em dificuldades financeiras. A recuperação judicial é exatamente o instrumento criado para tentar salvar empresas como essa.</p>

<h2>As 5 empresas ativas com data de início mais antiga</h2>
<table style="width:100%;border-collapse:collapse;font-size:14px;margin:16px 0">
<thead>
<tr style="background:#f8fafc;border-bottom:2px solid #e2e8f0">
<th style="text-align:left;padding:8px 12px">Fundação</th>
<th style="text-align:left;padding:8px 12px">Empresa</th>
<th style="text-align:center;padding:8px 12px">UF</th>
<th style="text-align:center;padding:8px 12px">Anos</th>
</tr>
</thead>
<tbody>
<tr style="border-bottom:1px solid #f1f5f9"><td style="padding:7px 12px">23/10/1891</td><td style="padding:7px 12px"><a href="/empresa/17314033000167-companhia-de-tecidos-santanense" class="text-[#0F4C81] hover:underline">Companhia de Tecidos Santanense</a></td><td style="text-align:center;padding:7px 12px">MG</td><td style="text-align:center;padding:7px 12px;font-weight:600">135</td></tr>
<tr style="border-bottom:1px solid #f1f5f9"><td style="padding:7px 12px">05/07/1893</td><td style="padding:7px 12px">Junta Comercial do Estado de Minas Gerais</td><td style="text-align:center;padding:7px 12px">MG</td><td style="text-align:center;padding:7px 12px;font-weight:600">133</td></tr>
<tr style="border-bottom:1px solid #f1f5f9"><td style="padding:7px 12px">19/04/1899</td><td style="padding:7px 12px"><a href="/empresa/89355099000106-klabin-sa" class="text-[#0F4C81] hover:underline">Klabin S.A.</a></td><td style="text-align:center;padding:7px 12px">SP</td><td style="text-align:center;padding:7px 12px;font-weight:600">127</td></tr>
<tr style="border-bottom:1px solid #f1f5f9"><td style="padding:7px 12px">16/10/1899</td><td style="padding:7px 12px">Transportes e Carruagens Ltda.</td><td style="text-align:center;padding:7px 12px">RJ</td><td style="text-align:center;padding:7px 12px;font-weight:600">127</td></tr>
<tr><td style="padding:7px 12px">01/01/1901</td><td style="padding:7px 12px">Registro de Imóveis, Títulos e Documentos</td><td style="text-align:center;padding:7px 12px">MG</td><td style="text-align:center;padding:7px 12px;font-weight:600">125</td></tr>
</tbody>
</table>

<h2>Klabin: 127 anos e ainda na bolsa</h2>
<p>Fundada em 19 de abril de 1899 pelos irmãos Klabin — imigrantes lituanos — a <strong>Klabin S.A.</strong> é hoje a maior produtora e exportadora de papéis, cartões e embalagens do Brasil. Com capital aberto na B3, ela é um dos casos mais extraordinários de longevidade empresarial no país.</p>
<p>Em 1899, o Brasil tinha menos de 20 anos de República. O avião seria inventado apenas 4 anos depois. A Klabin estava lá antes de tudo isso — e segue ativa.</p>

<h2>Por que Minas Gerais concentra as empresas mais antigas?</h2>
<p>Três das cinco empresas mais antigas são mineiras. Isso reflete a história econômica do Brasil: Minas Gerais foi o epicentro da mineração colonial e, por isso, desenvolveu estruturas comerciais e institucionais antes de outros estados. O setor têxtil mineiro, como a Santanense, floresceu no final do século XIX quando o país tentava industrializar-se.</p>

<h2>Empresas centenárias por setor</h2>
<p>Entre as empresas com mais de 100 anos ainda ativas no Brasil, predominam:</p>
<ul>
<li><strong>Setor financeiro e bancário</strong> — bancos como Bradesco (1943) e Itaú (1924) são jovens comparados aos mais antigos, mas o setor tem forte longevidade</li>
<li><strong>Indústria têxtil e de papel</strong> — Klabin, Santanense e similares</li>
<li><strong>Registro e cartórios</strong> — entidades com natureza quase institucional</li>
<li><strong>Cooperativas agrícolas</strong> — especialmente no Sul do país</li>
</ul>

<h2>Como verificar a data de fundação de qualquer empresa</h2>
<p>A <strong>data de início de atividade</strong> declarada na Receita Federal aparece em qualquer consulta de CNPJ — é o dado mais próximo da data de fundação disponível publicamente. Vale notar que algumas empresas antigas migraram de tipo jurídico ao longo dos anos e podem ter datas mais recentes que sua fundação real.</p>

<p>Para consultar: acesse <a href="/buscar">nossa busca</a>, informe o CNPJ ou razão social e veja a data de abertura na ficha da empresa.</p>

<h2>Metodologia</h2>
<p>Dados extraídos da base pública do CNPJ (Receita Federal), atualização junho de 2026. Filtro aplicado: situação = ATIVA, ordenação por data_inicio_atividade crescente. A data registrada é a declarada pela empresa à Receita Federal, que pode diferir da data de fundação histórica em casos de reestruturações societárias.</p>`,
  },

  // ─── Posts novos Jun/2026 — oportunidades identificadas via SERP Finder ───

  {
    slug: "como-pesquisar-empresa-por-telefone",
    title: "Como pesquisar empresa pelo telefone e descobrir o CNPJ",
    excerpt: "Tem um número de telefone e quer saber qual empresa está por trás? Veja como encontrar o CNPJ, razão social e situação cadastral pelo telefone em segundos.",
    category: "Consulta CNPJ",
    publishedAt: "2026-06-06",
    updatedAt: "2026-06-06",
    author: DEFAULT_AUTHOR,
    readingMinutes: 5,
    keywords: ["pesquisar empresa por telefone", "encontrar cnpj pelo telefone", "buscar empresa pelo número", "telefone cnpj receita federal"],
    body: `<p>Você recebeu uma ligação de um número desconhecido ou tem o telefone de uma empresa mas não sabe o CNPJ? Dá pra descobrir — e é mais simples do que parece. Os dados de contato de empresas brasileiras ficam registrados na Receita Federal junto ao CNPJ, e dá pra fazer essa busca de forma reversa.</p>

<h2>Como funciona a busca por telefone no Jurídico Online</h2>
<p>O <a href="/buscar">buscador do Jurídico Online</a> permite pesquisar diretamente pelo número de telefone. Basta digitar o número (com ou sem DDD, com ou sem formatação) e o sistema busca em toda a base de 65 milhões de empresas brasileiras.</p>

<p>Exemplos que funcionam:</p>
<ul>
<li><strong>11 3000-1234</strong></li>
<li><strong>(11) 30001234</strong></li>
<li><strong>1130001234</strong></li>
</ul>

<p>O resultado mostra razão social, CNPJ completo, situação cadastral, endereço e CNAE da empresa vinculada ao número.</p>

<h2>O que você consegue ver pelo telefone</h2>
<ul>
<li><strong>Razão social e nome fantasia</strong> — nome oficial da empresa</li>
<li><strong>CNPJ completo</strong> — para consultas futuras</li>
<li><strong>Situação cadastral</strong> — ativa, baixada, suspensa ou inapta</li>
<li><strong>Endereço</strong> — onde a empresa está registrada</li>
<li><strong>CNAE</strong> — o que a empresa faz oficialmente</li>
<li><strong>Capital social e porte</strong></li>
</ul>

<p>Com cadastro grátis, você também vê o <strong>quadro societário completo</strong> — quem são os sócios da empresa por trás do número.</p>

<h2>Por que o telefone aparece no CNPJ?</h2>
<p>Quando uma empresa abre ou atualiza seu cadastro na Receita Federal, ela declara telefone de contato. Esse dado é público e faz parte dos dados cadastrais do CNPJ. Nem toda empresa mantém o número atualizado, então é normal não encontrar todos os números — mas a maioria das empresas ativas com mais de 2 anos de operação tem ao menos um telefone registrado.</p>

<h2>Casos em que a busca por telefone é útil</h2>
<ul>
<li><strong>Recebeu uma ligação suspeita</strong> — verifique se é empresa ativa ou se o número está associado a uma empresa baixada</li>
<li><strong>Quer fechar negócio</strong> — confirme se a empresa que te ligou existe e está regular</li>
<li><strong>Cobrança ou financeiro</strong> — identifique a empresa antes de pagar qualquer boleto</li>
<li><strong>Due diligence rápida</strong> — valide o fornecedor antes de assinar contrato</li>
</ul>

<h2>E se não encontrar o número?</h2>
<p>Nem todo telefone está cadastrado na Receita Federal. Se não aparecer resultado, tente:</p>
<ul>
<li>Buscar só com o DDD + número sem formatação</li>
<li>Buscar com variações (fixo vs celular)</li>
<li>Buscar pelo nome fantasia da empresa se você tiver alguma pista</li>
</ul>
<p>Empresas MEI e microempresas abertas recentemente às vezes ainda não têm telefone atualizado na base da Receita.</p>

<h2>Perguntas frequentes</h2>

<h3>Dá pra pesquisar qualquer número de telefone?</h3>
<p>Sim, desde que o número esteja declarado no cadastro da Receita Federal. São dados públicos, disponíveis a qualquer cidadão. A busca funciona para fixos e celulares.</p>

<h3>Precisa pagar para fazer a busca por telefone?</h3>
<p>A busca básica e a identificação da empresa são gratuitas. Com <a href="/cadastro">cadastro grátis</a> você acessa também o telefone completo (não mascarado) e o quadro societário.</p>

<h3>Posso descobrir quem é o sócio pelo telefone da empresa?</h3>
<p>Sim. Após identificar a empresa pelo telefone, acesse a <a href="/buscar">página da empresa</a> para ver o quadro societário com nome dos sócios, qualificação e data de entrada — dados da Receita Federal.</p>

<p><a href="/buscar" class="inline-block mt-4 bg-[#0F4C81] text-white rounded-lg px-5 py-2 font-medium text-sm hover:bg-[#0a3a66] transition">Pesquisar empresa por telefone →</a></p>`,
  },

  {
    slug: "mesmos-socios-empresas-diferentes-permitido",
    title: "Mesmos sócios em empresas diferentes: é permitido?",
    excerpt: "Uma pessoa pode ser sócia de várias empresas ao mesmo tempo? Entenda as regras, exceções e como consultar todas as empresas de um sócio pelo CPF ou nome.",
    category: "Sócios e QSA",
    publishedAt: "2026-06-06",
    updatedAt: "2026-06-06",
    author: DEFAULT_AUTHOR,
    readingMinutes: 6,
    keywords: ["mesmos sócios em empresas diferentes", "sócio em várias empresas", "consultar empresas de um sócio", "sócio múltiplas empresas permitido"],
    body: `<p>Sim, é permitido. Uma mesma pessoa física pode ser sócia de quantas empresas quiser ao mesmo tempo — não há limite legal no Brasil. Mas há situações específicas onde isso gera impedimentos, restrições fiscais ou riscos que valem conhecer.</p>

<h2>O que a lei diz</h2>
<p>Não existe lei brasileira que proíba uma pessoa de ser sócia de múltiplas empresas simultaneamente. O Código Civil (Lei 10.406/2002) e a Lei das Sociedades Anônimas (Lei 6.404/1976) não estabelecem esse limite.</p>

<p>Na prática, é comum encontrar empreendedores com 3, 5 ou até dezenas de empresas abertas no CNPJ — especialmente holdings, grupos empresariais e estruturas de planejamento tributário.</p>

<h2>Quando ser sócio de várias empresas gera problema</h2>

<h3>Empresas no Simples Nacional</h3>
<p>Aqui existe uma regra importante: se um sócio tiver participação em outras empresas e a <strong>soma do faturamento de todas ultrapassar R$ 4,8 milhões por ano</strong>, nenhuma delas pode optar pelo Simples Nacional. O fisco olha para o conjunto, não para cada empresa separadamente.</p>

<h3>MEI especificamente</h3>
<p>O MEI tem restrição mais rígida: o titular de uma empresa individual de microempreendedor individual <strong>não pode ser sócio, administrador ou titular de outra empresa</strong>. Se quiser abrir uma segunda empresa, precisa primeiro desenquadrar o MEI.</p>

<h3>Licitações públicas</h3>
<p>Em alguns processos licitatórios, empresas com sócios comuns são impedidas de participar simultaneamente do mesmo certame — para evitar conluio entre concorrentes do mesmo grupo.</p>

<h3>Dívidas e responsabilidade</h3>
<p>Em empresas limitadas (LTDA), a responsabilidade dos sócios é limitada ao capital social. Mas em caso de desconsideração da personalidade jurídica por fraude, o patrimônio pessoal do sócio pode responder — e se ele for sócio de outras empresas, essas também podem ser afetadas.</p>

<h2>Como consultar todas as empresas de um sócio</h2>
<p>O Quadro de Sócios e Administradores (QSA) da Receita Federal é público. No Jurídico Online, você pode:</p>
<ol>
<li>Buscar o nome da pessoa em <a href="/socios">nossa busca de sócios</a></li>
<li>Ver todas as empresas onde ela figura como sócia ou representante</li>
<li>Verificar a situação cadastral de cada empresa (ativa, baixada, inapta)</li>
<li>Ver a qualificação (sócio-administrador, diretor, etc.) e data de entrada em cada empresa</li>
</ol>

<p>Esse cruzamento é valioso para due diligence: antes de contratar um fornecedor ou fechar uma parceria, verifique se os sócios têm histórico de empresas inaptas, baixadas irregularmente ou com padrão de abandono.</p>

<h2>Como identificar grupos empresariais pelo QSA</h2>
<p>Quando várias empresas têm os mesmos sócios, isso frequentemente indica:</p>
<ul>
<li><strong>Holding</strong> — empresa que controla as demais</li>
<li><strong>Grupo econômico</strong> — empresas do mesmo dono em setores diferentes</li>
<li><strong>Estrutura de proteção patrimonial</strong> — separação de riscos entre CNPJs</li>
<li><strong>Fraude</strong> (mais raro) — uso de laranjas para esconder o real controlador</li>
</ul>

<h2>Perguntas frequentes</h2>

<h3>Posso ser sócio de uma empresa concorrente?</h3>
<p>Depende do contrato social e de acordos de acionistas. Não há lei geral proibindo, mas muitos contratos incluem cláusula de não-concorrência entre sócios. Verifique o contrato social da empresa.</p>

<h3>Ser sócio de empresa inativa prejudica minha outra empresa?</h3>
<p>Não diretamente, mas pode afetar a pontuação em análises de crédito e licitações. Empresas cujos sócios têm histórico de CNPJs baixados irregularmente ou inaptos podem ter dificuldade em abrir contas PJ ou obter crédito.</p>

<h3>Como saber quantas empresas tenho abertas no meu CPF?</h3>
<p>Consulte diretamente no <a href="/socios">Jurídico Online</a> buscando pelo seu nome. Todos os vínculos societários registrados na Receita Federal aparecem — incluindo empresas que você esqueceu de baixar.</p>

<p><a href="/socios" class="inline-block mt-4 bg-[#0F4C81] text-white rounded-lg px-5 py-2 font-medium text-sm hover:bg-[#0a3a66] transition">Consultar empresas de um sócio →</a></p>`,
  },

  {
    slug: "como-saber-se-empresa-e-confiavel",
    title: "Como saber se uma empresa é confiável antes de fechar negócio",
    excerpt: "Antes de pagar, assinar contrato ou fechar parceria, verifique esses 7 pontos no CNPJ da empresa. Dados públicos que revelam se a empresa é séria ou um risco.",
    category: "Due Diligence",
    publishedAt: "2026-06-06",
    updatedAt: "2026-06-06",
    author: DEFAULT_AUTHOR,
    readingMinutes: 7,
    keywords: ["como saber se empresa é confiável", "verificar empresa antes de fechar negócio", "empresa confiável cnpj", "como verificar idoneidade empresa"],
    body: `<p>Antes de pagar um fornecedor, contratar um prestador de serviço ou fechar uma parceria comercial, existe uma verificação que leva menos de 5 minutos e pode evitar uma dor de cabeça enorme: checar o CNPJ da empresa. Os dados públicos da Receita Federal revelam mais sobre uma empresa do que muita gente imagina.</p>

<h2>7 pontos para verificar no CNPJ</h2>

<h3>1. Situação cadastral — o mais importante</h3>
<p>Uma empresa com situação <strong>ATIVA</strong> está regularmente registrada na Receita Federal. Qualquer outro status é sinal de alerta:</p>
<ul>
<li><strong>INAPTA</strong> — não entregou declarações por 2 anos ou mais. Não pode emitir nota fiscal válida.</li>
<li><strong>SUSPENSA</strong> — irregularidade cadastral em apuração</li>
<li><strong>BAIXADA</strong> — encerrada. Qualquer contrato assinado com uma empresa baixada é problemático.</li>
</ul>
<p>Se a empresa que está te vendendo algo está INAPTA, as notas fiscais que ela emite podem ser glosadas pela Receita — e o prejuízo pode ser seu, não dela.</p>

<h3>2. Tempo de operação</h3>
<p>Empresas com mais de 3 anos de atividade têm mais credibilidade do que empresas abertas há 2 meses. Veja a <strong>data de abertura</strong> no CNPJ. Uma empresa nova não é necessariamente desonesta, mas merece mais cautela e verificação de referências.</p>

<h3>3. CNAE — o que a empresa faz de fato</h3>
<p>O CNAE (Código Nacional de Atividade Econômica) diz qual é a atividade oficial da empresa. Desconfie quando o CNAE não bate com o serviço oferecido. Uma empresa com CNAE de "comércio de alimentos" que oferece serviços de TI é um sinal de irregularidade — ela provavelmente não tem o registro adequado para o que faz.</p>

<h3>4. Quadro societário — quem está por trás</h3>
<p>Verifique os sócios. Com <a href="/cadastro">cadastro grátis no Jurídico Online</a>, você vê nome completo, qualificação e data de entrada de cada sócio. Daí pesquise os sócios:</p>
<ul>
<li>Eles têm outras empresas abertas? Em que situação estão?</li>
<li>Alguma empresa anterior desses sócios foi encerrada com irregularidade?</li>
<li>O sócio-administrador é a mesma pessoa que assina os contratos?</li>
</ul>

<h3>5. Endereço — existe de verdade?</h3>
<p>O endereço no CNPJ é declarado pela empresa. Não é raro encontrar empresas com endereço em coworking, endereço fiscal inexistente ou o mesmo endereço compartilhado com dezenas de outras empresas. Para contratos de valor alto, vale confirmar o endereço físico antes de assinar.</p>

<h3>6. Capital social — comprometimento financeiro</h3>
<p>O capital social declarado indica o quanto os sócios investiram formalmente na empresa. Uma empresa com capital social de R$ 1.000 que te vende um projeto de R$ 500.000 não tem lastro financeiro proporcional ao risco que você está assumindo.</p>

<h3>7. Porte da empresa</h3>
<p>ME (Microempresa), EPP (Empresa de Pequeno Porte) ou Demais — o porte informa a faixa de faturamento declarada. Desconfie quando o serviço ou produto oferecido parece muito grande para o porte da empresa.</p>

<h2>Como fazer essa verificação em 5 minutos</h2>
<ol>
<li>Acesse <a href="/buscar">Jurídico Online</a></li>
<li>Digite o CNPJ ou razão social da empresa</li>
<li>Verifique situação, data de abertura, CNAE e endereço (gratuito, sem login)</li>
<li><a href="/cadastro">Crie sua conta grátis</a> para ver os sócios completos</li>
<li>Pesquise os sócios em <a href="/socios">nossa busca de sócios</a> para ver outras empresas vinculadas</li>
</ol>

<h2>Além do CNPJ: outras fontes para verificar</h2>
<ul>
<li><strong>Reclame Aqui</strong> — reclamações de consumidores</li>
<li><strong>Cadastro de Empregadores do MTE</strong> — empresas com histórico de trabalho análogo à escravidão</li>
<li><strong>CEIS (gov.br)</strong> — empresas sancionadas por contratos com o governo</li>
<li><strong>Protestos e SPC/Serasa</strong> — dívidas comerciais (requer consulta paga)</li>
<li><strong>Jurídico em Pauta</strong> — atos em diários oficiais envolvendo a empresa</li>
</ul>

<h2>Sinais de alerta que combinados indicam risco alto</h2>
<p>Nenhum sinal isolado significa necessariamente que a empresa é desonesta. Mas quando vários aparecem juntos, redobre a cautela:</p>
<ul>
<li>Empresa aberta há menos de 6 meses</li>
<li>Capital social abaixo de R$ 1.000</li>
<li>CNAE não condiz com o serviço</li>
<li>Sócio com outras empresas baixadas ou inaptas</li>
<li>Endereço compartilhado com mais de 10 empresas</li>
<li>Situação INAPTA ou SUSPENSA</li>
</ul>

<h2>Perguntas frequentes</h2>

<h3>Empresa com situação ativa é garantia de que é confiável?</h3>
<p>Não é garantia total, mas é o pré-requisito mínimo. Situação ATIVA significa que a empresa está em dia com suas obrigações cadastrais na Receita Federal. Isso não impede que ela tenha dívidas privadas, processos trabalhistas ou má reputação comercial.</p>

<h3>Consigo verificar se a empresa tem dívidas pelo CNPJ?</h3>
<p>Dívidas com a Receita Federal (Dívida Ativa) aparecem na <strong>Certidão Negativa de Débitos (CND)</strong>, obtida gratuitamente no portal da Receita. Já dívidas privadas (fornecedores, bancos) exigem consulta ao SPC/Serasa, que é paga.</p>

<h3>O que fazer se a empresa não tem CNPJ ou o CNPJ é falso?</h3>
<p>Não feche negócio. Toda empresa brasileira que emite nota fiscal precisa de CNPJ. Pessoa física que presta serviços pode usar CPF, mas deve emitir recibo ou RPA. Qualquer empresa que se recuse a informar CNPJ é um sinal vermelho.</p>

<p><a href="/buscar" class="inline-block mt-4 bg-[#0F4C81] text-white rounded-lg px-5 py-2 font-medium text-sm hover:bg-[#0a3a66] transition">Verificar uma empresa agora →</a></p>`,
  },

  // ─── Post 1: Consultar QSA — SD 14, 5400/mês ─────────────────────────────
  {
    slug: "consultar-qsa-quadro-societario-guia",
    title: "Como consultar o QSA (Quadro Societário) de qualquer empresa — guia 2026",
    excerpt: "Aprenda a consultar o QSA de uma empresa em segundos. Descubra os sócios, administradores e qualificações pelo CNPJ, gratuitamente.",
    category: "Consulta CNPJ",
    publishedAt: "2026-06-08",
    updatedAt: "2026-06-08",
    author: DEFAULT_AUTHOR,
    readingMinutes: 7,
    keywords: ["consultar qsa", "quadro societario cnpj", "qsa cnpj", "quadro de socios e administradores", "consulta qsa gratis"],
    body: `<p>O <strong>QSA (Quadro de Sócios e Administradores)</strong> é o registro oficial de todos os sócios, diretores e representantes legais de uma empresa no Brasil. Ele faz parte do CNPJ cadastrado na Receita Federal e é público — qualquer pessoa pode consultar gratuitamente.</p>

<p>Neste guia você vai aprender a consultar o QSA de qualquer empresa em segundos, sem burocracia.</p>

<p><a href="/buscar" class="inline-block my-4 bg-[#0F4C81] text-white rounded-lg px-5 py-2 font-medium text-sm hover:bg-[#0a3a66] transition">Pesquisar QSA grátis agora →</a></p>

<h2>O que é o QSA?</h2>
<p>QSA significa <strong>Quadro de Sócios e Administradores</strong>. É a lista oficial, mantida pela Receita Federal, com todos os responsáveis por uma empresa: quem são os sócios, qual a qualificação de cada um (sócio-administrador, sócio-cotista, diretor, presidente, etc.) e desde quando cada pessoa faz parte da sociedade.</p>

<p>Toda empresa com CNPJ ativo no Brasil tem um QSA registrado. Empresas individuais (MEI, EI) têm apenas o titular. Empresas maiores podem ter dezenas de sócios ou fundos de investimento como cotistas.</p>

<h2>Para que serve consultar o QSA?</h2>
<ul>
<li><strong>Due diligence</strong> — antes de fechar contrato, confirmar quem realmente controla a empresa</li>
<li><strong>Verificar se um sócio tem outras empresas</strong> — detectar conflitos de interesse ou histórico</li>
<li><strong>Cobrança e execução judicial</strong> — identificar os responsáveis legais para ações na Justiça</li>
<li><strong>Compliance e KYC</strong> — bancos e fintechs consultam o QSA como parte da verificação de clientes PJ</li>
<li><strong>Recrutamento</strong> — verificar o histórico societário de um candidato a executivo</li>
</ul>

<h2>Como consultar o QSA pelo CNPJ gratuitamente</h2>
<p>Existem três formas principais:</p>

<h3>1. Jurídico Online (recomendado — mais rápido)</h3>
<p>Digite o CNPJ ou nome da empresa no <a href="/buscar">Jurídico Online</a>. O QSA completo aparece imediatamente na página da empresa: nome de cada sócio, qualificação, data de entrada e, quando disponível, o link para o perfil completo do sócio com todas as empresas que ele participa.</p>
<p>Diferencial: você vê o histórico de participações do sócio — todas as empresas em que ele aparece como QSA, ativas ou baixadas.</p>

<h3>2. Receita Federal (oficial, com captcha)</h3>
<p>Acesse o <a href="https://solucoes.receita.fazenda.gov.br/servicos/cnpjreva/cnpjreva_solicitacao.asp" target="_blank" rel="nofollow noopener">Comprovante de Situação Cadastral</a> da Receita Federal, informe o CNPJ e resolva o captcha. O PDF gerado contém o QSA. É oficial mas não permite buscar por nome do sócio.</p>

<h3>3. Junta Comercial</h3>
<p>Para dados mais detalhados (CPF integrais, percentual de participação), acesse a Junta Comercial do estado da empresa. A certidão simplificada é paga (R$ 20-50) mas contém o contrato social completo.</p>

<h2>O que aparece no QSA?</h2>
<ul>
<li><strong>Nome do sócio ou administrador</strong> (pessoa física ou jurídica)</li>
<li><strong>Qualificação</strong> — sócio-administrador, sócio, diretor, presidente, representante legal etc.</li>
<li><strong>Data de entrada</strong> na sociedade</li>
<li><strong>País de origem</strong> — para sócios estrangeiros</li>
</ul>

<p>O QSA da Receita Federal <strong>não</strong> mostra percentual de cotas, CPF/CNPJ dos sócios na versão pública, remuneração dos administradores nem histórico de alterações anteriores. Para isso é preciso a certidão da Junta Comercial.</p>

<h2>Quantas empresas um sócio pode ter no Brasil?</h2>
<p>Não há limite legal. Uma pessoa física pode ser sócia ou administradora de quantas empresas quiser. Com os dados do Jurídico Online — que reúne 27 milhões de registros de sócios da Receita Federal — é possível ver todas as empresas de qualquer pessoa em segundos.</p>

<p>Empresas com sócios em comum formam o que chamamos de <strong>grupo econômico</strong>. Identificar esses grupos é essencial em due diligence, crédito e litígios.</p>

<h2>QSA desatualizado — o que fazer?</h2>
<p>Alterações no quadro societário registradas na Junta Comercial podem levar até 30 dias para refletir na base da Receita Federal. Se o QSA parecer desatualizado, consulte diretamente a Junta Comercial do estado ou acesse o <a href="https://redesim.gov.br" target="_blank" rel="nofollow noopener">REDESIM</a>.</p>

<h2>Perguntas frequentes sobre QSA</h2>

<h3>QSA e quadro societário são a mesma coisa?</h3>
<p>Sim. QSA (Quadro de Sócios e Administradores) é o nome técnico usado pela Receita Federal. "Quadro societário" é o termo popular. Ambos se referem à mesma lista de responsáveis pela empresa.</p>

<h3>Como consultar o QSA pelo nome do sócio?</h3>
<p>A Receita Federal só permite busca por CNPJ. Para buscar pelo nome do sócio e ver todas as empresas que ele participa, use o <a href="/buscar">Jurídico Online</a> — a busca por sócio retorna todas as empresas vinculadas àquele nome.</p>

<h3>É possível consultar QSA de empresa baixada?</h3>
<p>Sim. Empresas baixadas, suspensas ou inaptas continuam com CNPJ registrado na Receita Federal. O QSA da data do encerramento fica disponível para consulta.</p>

<h3>Consultar o QSA é gratuito?</h3>
<p>Sim. O QSA é dado público por natureza — faz parte do CNPJ que é obrigatório divulgar. A consulta básica é gratuita na Receita Federal e no Jurídico Online. Apenas a certidão física da Junta Comercial tem custo.</p>

<p><a href="/buscar" class="inline-block mt-6 bg-[#0F4C81] text-white rounded-lg px-6 py-3 font-semibold text-sm hover:bg-[#0a3a66] transition">Consultar QSA grátis agora →</a></p>`,
  },

  // ─── Post 2: Como saber sócios de uma empresa — SD 17 ────────────────────
  {
    slug: "como-saber-socios-de-uma-empresa-2026",
    title: "Como saber os sócios de uma empresa em 2026 — 3 formas grátis",
    excerpt: "Descubra os sócios de qualquer empresa brasileira gratuitamente: pelo CNPJ, pelo nome ou pelo CPF do sócio. Guia completo e atualizado.",
    category: "Consulta CNPJ",
    publishedAt: "2026-06-08",
    updatedAt: "2026-06-08",
    author: DEFAULT_AUTHOR,
    readingMinutes: 6,
    keywords: ["como saber socios de uma empresa", "consulta socios cnpj", "como descobrir socios empresa", "pesquisar socios pelo cnpj", "ver socios empresa gratis"],
    body: `<p>Descobrir os sócios de uma empresa é simples e gratuito no Brasil. Todas as informações sobre quadro societário são <strong>dados públicos</strong> — qualquer cidadão pode acessar sem precisar de advogado, cartório ou pagar nada.</p>

<p><a href="/buscar" class="inline-block my-4 bg-[#0F4C81] text-white rounded-lg px-5 py-2 font-medium text-sm hover:bg-[#0a3a66] transition">Pesquisar sócios grátis →</a></p>

<h2>Por que consultar os sócios de uma empresa?</h2>
<p>Antes de fechar qualquer negócio — contrato de fornecimento, parceria, investimento ou contratação — saber quem está por trás de uma empresa é essencial:</p>
<ul>
<li>Evitar negociar com empresas de fachada ou laranjas</li>
<li>Verificar se o sócio tem histórico de empresas encerradas por dívidas</li>
<li>Confirmar se a pessoa que diz ser "dono" realmente aparece no CNPJ</li>
<li>Identificar grupos econômicos e conflitos de interesse</li>
<li>Due diligence antes de M&A ou investimento</li>
</ul>

<h2>3 formas de descobrir os sócios de uma empresa</h2>

<h3>Forma 1 — Jurídico Online (mais rápido, com histórico)</h3>
<p>O <a href="/">Jurídico Online</a> reúne 65 milhões de empresas e 27 milhões de registros de sócios da Receita Federal. Para consultar:</p>
<ol>
<li>Acesse <a href="/buscar">juridicoonline.com.br/buscar</a></li>
<li>Digite o CNPJ, razão social ou nome do sócio</li>
<li>Veja o quadro societário completo: nome, qualificação, data de entrada</li>
<li>Clique no sócio para ver todas as outras empresas que ele participa</li>
</ol>
<p>É a única plataforma que permite busca pelo <strong>nome do sócio</strong> e retorna todas as empresas vinculadas — útil para rastrear grupos econômicos.</p>

<h3>Forma 2 — Receita Federal (oficial)</h3>
<p>Acesse o Comprovante de Situação Cadastral da Receita Federal, informe o CNPJ e resolva o captcha. O documento PDF gerado contém o QSA. Limitação: não há busca por nome do sócio e o processo é manual (um CNPJ por vez).</p>

<h3>Forma 3 — Junta Comercial do Estado</h3>
<p>Para informações mais detalhadas — como CPF integral dos sócios, percentual de participação e histórico de alterações — acesse a Junta Comercial do estado onde a empresa está registrada. A certidão simplificada custa entre R$ 20 e R$ 50 mas é o documento mais completo.</p>

<h2>Como pesquisar pelo nome do sócio</h2>
<p>A Receita Federal <strong>não permite</strong> buscar pelo nome da pessoa — apenas pelo CNPJ. Para encontrar todas as empresas de uma pessoa pelo nome, use o <a href="/buscar">Jurídico Online</a>: digite o nome completo na busca e o sistema retorna o perfil do sócio com todas as empresas em que ele aparece como QSA.</p>

<p>Essa funcionalidade é especialmente útil para:</p>
<ul>
<li>Verificar se um candidato a executivo já foi sócio de empresas problemáticas</li>
<li>Rastrear se um devedor tem empresas ativas em seu nome</li>
<li>Identificar se um fornecedor tem empresas relacionadas que poderiam criar conflito de interesse</li>
</ul>

<h2>O que o QSA não mostra</h2>
<p>Importante saber o que a consulta básica <em>não</em> inclui:</p>
<ul>
<li><strong>CPF dos sócios</strong> — protegido pela LGPD na consulta pública</li>
<li><strong>Percentual de cotas</strong> — só na Junta Comercial ou contrato social</li>
<li><strong>Dívidas dos sócios</strong> — exige consulta ao SPC/Serasa</li>
<li><strong>Histórico de alterações</strong> — quem entrou e saiu da sociedade ao longo do tempo</li>
</ul>

<h2>Perguntas frequentes</h2>

<h3>Como saber se o sócio de uma empresa tem outras empresas?</h3>
<p>No <a href="/buscar">Jurídico Online</a>, clique no nome do sócio dentro da página da empresa. O sistema mostra o perfil completo do sócio com todas as empresas vinculadas a ele na Receita Federal — ativas, baixadas ou suspensas.</p>

<h3>Posso consultar os sócios de uma empresa pelo CPF?</h3>
<p>A consulta pública por CPF não está disponível por restrições da LGPD. A busca é feita por nome completo ou por CNPJ da empresa.</p>

<h3>Quanto tempo demora para um sócio aparecer no QSA?</h3>
<p>Após o registro na Junta Comercial, leva em média 15 a 30 dias para a alteração refletir na base da Receita Federal. Atualizações urgentes podem ser solicitadas diretamente na Receita.</p>

<h3>É possível ver sócios de empresa baixada?</h3>
<p>Sim. Empresas baixadas mantêm o CNPJ registrado e o QSA fica disponível para consulta — útil para rastrear histórico de inadimplência ou fraudes.</p>

<p><a href="/buscar" class="inline-block mt-6 bg-[#0F4C81] text-white rounded-lg px-6 py-3 font-semibold text-sm hover:bg-[#0a3a66] transition">Ver sócios de qualquer empresa grátis →</a></p>`,
  },

  // ─── Post 3: Descobrir CNPJ pelo nome — SD 20 ────────────────────────────
  {
    slug: "como-descobrir-cnpj-empresa-pelo-nome",
    title: "Como descobrir o CNPJ de uma empresa pelo nome — pesquisa grátis 2026",
    excerpt: "Saiba como encontrar o CNPJ de qualquer empresa brasileira apenas pelo nome. Pesquisa rápida, gratuita e sem captcha.",
    category: "Consulta CNPJ",
    publishedAt: "2026-06-08",
    updatedAt: "2026-06-08",
    author: DEFAULT_AUTHOR,
    readingMinutes: 5,
    keywords: ["descobrir cnpj pelo nome", "pesquisar empresa pelo nome", "buscar cnpj por nome", "encontrar cnpj empresa", "consulta cnpj nome fantasia"],
    body: `<p>Precisa encontrar o CNPJ de uma empresa mas só tem o nome? É possível e gratuito. Neste guia mostramos as formas mais rápidas de pesquisar o CNPJ de qualquer empresa brasileira pelo nome — sem burocracia e sem captcha.</p>

<p><a href="/buscar" class="inline-block my-4 bg-[#0F4C81] text-white rounded-lg px-5 py-2 font-medium text-sm hover:bg-[#0a3a66] transition">Pesquisar CNPJ por nome grátis →</a></p>

<h2>Como buscar CNPJ pelo nome no Jurídico Online</h2>
<p>A forma mais rápida é usar o <a href="/buscar">Jurídico Online</a>:</p>
<ol>
<li>Acesse <strong>juridicoonline.com.br/buscar</strong></li>
<li>Digite o nome da empresa (razão social ou nome fantasia)</li>
<li>O sistema busca em mais de 65 milhões de empresas cadastradas na Receita Federal</li>
<li>Veja o CNPJ, situação cadastral, endereço, sócios e contatos</li>
</ol>

<p>A busca funciona com parte do nome — você não precisa digitar o nome completo. "Magazine Lu" encontra "Magazine Luiza S.A.", por exemplo.</p>

<h2>Diferença entre razão social e nome fantasia</h2>
<p>Muitas empresas são conhecidas pelo <strong>nome fantasia</strong> mas o CNPJ está registrado pela <strong>razão social</strong>. Exemplos:</p>
<ul>
<li>Nome fantasia: "Boticário" → Razão social: "O Boticário do Brasil Ltda"</li>
<li>Nome fantasia: "iFood" → Razão social: "iFood.com Agência de Restaurantes Online S.A."</li>
<li>Nome fantasia: "Casas Bahia" → Razão social: "Via Varejo S.A."</li>
</ul>
<p>O Jurídico Online busca tanto pela razão social quanto pelo nome fantasia quando disponível na base da Receita Federal.</p>

<h2>Empresa com várias unidades — qual CNPJ usar?</h2>
<p>Grandes redes têm um CNPJ para cada unidade (filial). A <strong>matriz</strong> tem o CNPJ base (os 8 primeiros dígitos + 0001). As filiais têm o mesmo CNPJ base mas com sufixo diferente (0002, 0003...).</p>
<p>Para nota fiscal, usar o CNPJ da filial que faz o atendimento. Para verificar a saúde da empresa, consulte a matriz.</p>

<h2>Não encontrei a empresa — o que pode ter acontecido?</h2>
<ul>
<li><strong>Empresa recente</strong> — novos CNPJs levam até 24h para aparecer na base</li>
<li><strong>Nome digitado errado</strong> — tente partes menores do nome</li>
<li><strong>Empresa informal</strong> — sem CNPJ, trabalha "no negro" (sinal de alerta)</li>
<li><strong>Empresa baixada</strong> — CNPJ cancelado mas ainda consultável</li>
</ul>

<h2>Por que confirmar o CNPJ antes de pagar?</h2>
<p>Golpistas criam empresas falsas com nomes parecidos aos de grandes marcas. Antes de fazer qualquer pagamento para uma empresa nova, confirme que:</p>
<ul>
<li>O CNPJ existe e está <strong>ativo</strong> na Receita Federal</li>
<li>A razão social bate com o contrato ou nota fiscal</li>
<li>O endereço registrado faz sentido para o tipo de negócio</li>
<li>Os sócios são pessoas reais (não laranjas)</li>
</ul>

<h2>Perguntas frequentes</h2>

<h3>Como pesquisar CNPJ pelo nome fantasia?</h3>
<p>A Receita Federal usa a razão social como base, mas o <a href="/buscar">Jurídico Online</a> permite busca por nome fantasia quando disponível. Se não encontrar pelo nome fantasia, tente a razão social ou parte do nome.</p>

<h3>É possível encontrar o CNPJ pelo endereço?</h3>
<p>Diretamente não — a Receita Federal não disponibiliza busca por endereço. Mas pelo Jurídico Online você pode filtrar empresas por cidade, estado e CNAE (tipo de atividade), o que ajuda a identificar empresas num endereço específico.</p>

<h3>Como saber se uma empresa tem CNPJ ativo?</h3>
<p>Na página de resultado do Jurídico Online a situação cadastral aparece em destaque: <strong>ATIVA</strong> (verde), INAPTA, SUSPENSA ou BAIXADA. Empresas inaptas ou baixadas não podem emitir nota fiscal válida.</p>

<h3>Posso buscar o CNPJ pelo CPF do sócio?</h3>
<p>Não diretamente — a consulta pública por CPF é restrita pela LGPD. A alternativa é buscar pelo nome completo da pessoa no Jurídico Online, que retorna todas as empresas onde ela aparece como sócia.</p>

<p><a href="/buscar" class="inline-block mt-6 bg-[#0F4C81] text-white rounded-lg px-6 py-3 font-semibold text-sm hover:bg-[#0a3a66] transition">Pesquisar empresa pelo nome agora →</a></p>`,
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

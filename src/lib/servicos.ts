export type Servico = {
  slug: string;
  titulo: string;
  subtitulo: string;
  descricao: string; // 2-3 frases
  icone: string; // emoji
  categoria: "contabilidade" | "advocacia" | "financeiro" | "digital";
  keywords: string[];
  faqs: { pergunta: string; resposta: string }[];
  blogRelacionado: string[]; // slugs de posts do blog
  ctaTexto: string;
  ctaSubtexto: string;
};

export const SERVICOS: Servico[] = [
  {
    slug: "contabilidade-para-mei",
    titulo: "Contabilidade para MEI",
    subtitulo: "Gestão fiscal descomplicada para Microempreendedores Individuais",
    descricao: "MEI não é obrigado a ter contador, mas ter suporte especializado evita erros no DAS, DASN e enquadramento correto no CNAE. Nossa rede tem contadores experientes em MEI.",
    icone: "🧾",
    categoria: "contabilidade",
    keywords: ["contabilidade para mei", "contador para mei", "das mei", "dasn mei"],
    faqs: [
      { pergunta: "MEI é obrigado a ter contador?", resposta: "Não é obrigação legal, mas é recomendado para evitar erros no DAS e na DASN anual, e para monitorar se está próximo do limite de faturamento." },
      { pergunta: "Quanto custa um contador para MEI?", resposta: "Contadores especializados em MEI cobram entre R$60 e R$150/mês. Muitos escritórios parceiros oferecem pacotes específicos." },
      { pergunta: "O que o contador faz para o MEI?", resposta: "Emite DAS, preenche DASN, orienta sobre limite de faturamento, alerta sobre desenquadramento e auxilia na migração para ME quando necessário." },
    ],
    blogRelacionado: ["mei-simples-lucro-real-diferencas", "mei-desenquadramento-o-que-fazer", "preciso-de-contador-para-abrir-empresa"],
    ctaTexto: "Falar com contador especialista em MEI",
    ctaSubtexto: "Atendimento em todo o Brasil · Resposta em até 24h",
  },
  {
    slug: "contabilidade-para-empresa",
    titulo: "Contabilidade para Empresas",
    subtitulo: "Gestão contábil completa para ME, EPP, LTDA e SA",
    descricao: "Empresas além do MEI têm obrigação legal de manter escrituração contábil. Nossa rede conecta você a escritórios de contabilidade especializados por segmento e porte.",
    icone: "📊",
    categoria: "contabilidade",
    keywords: ["contabilidade para empresa", "escritório de contabilidade", "contador online", "contabilidade ltda"],
    faqs: [
      { pergunta: "Toda empresa precisa de contador?", resposta: "Sim, com exceção do MEI. ME, EPP, LTDA, SLU e SA são obrigadas por lei a manter escrituração contábil e ter contador responsável." },
      { pergunta: "Quanto custa contabilidade para LTDA?", resposta: "Varia por porte e atividade. Pequenas LTDAs do Simples: R$250-600/mês. Empresas maiores ou com muitas notas fiscais: R$800-2000/mês." },
      { pergunta: "Posso trocar de contador?", resposta: "Sim, a qualquer momento. O novo contador solicita os livros e documentos ao anterior. Verifique multas contratuais antes." },
    ],
    blogRelacionado: ["simples-nacional-como-aderir", "quanto-custa-abrir-empresa-2026", "como-abrir-empresa-passo-a-passo"],
    ctaTexto: "Encontrar contador para minha empresa",
    ctaSubtexto: "Especialistas por segmento · Orçamento gratuito",
  },
  {
    slug: "advocacia-empresarial",
    titulo: "Advocacia Empresarial",
    subtitulo: "Assessoria jurídica para contratos, societário e compliance",
    descricao: "Do contrato social à recuperação judicial, nossa rede de advogados empresariais atende PMEs e grandes empresas em todas as UFs.",
    icone: "⚖️",
    categoria: "advocacia",
    keywords: ["advogado empresarial", "advocacia empresarial", "assessoria jurídica empresa", "direito societário"],
    faqs: [
      { pergunta: "Quando preciso de advogado empresarial?", resposta: "Na abertura de sociedade, na entrada ou saída de sócio, em contratos de alto valor, em disputas societárias, na participação em licitações e em processos de M&A." },
      { pergunta: "Qual a diferença entre advogado empresarial e trabalhista?", resposta: "O empresarial cuida de contratos, societário, compliance e operações da empresa. O trabalhista foca em relações de emprego e reclamações na Justiça do Trabalho." },
      { pergunta: "Advogado empresarial cobra por hora ou mensalidade?", resposta: "Ambos. Consultorias pontuais costumam cobrar por hora (R$200-800/h). Assessoria contínua tem mensalidade (R$500-5000/mês dependendo do porte)." },
    ],
    blogRelacionado: ["quando-contratar-advogado-empresarial", "holding-familiar-o-que-e-vale-a-pena", "contrato-social-o-que-e-como-alterar", "due-diligence-cnpj-checklist"],
    ctaTexto: "Falar com advogado empresarial",
    ctaSubtexto: "Atendimento em todo o Brasil · Primeira consulta gratuita",
  },
  {
    slug: "abertura-de-empresa",
    titulo: "Abertura de Empresa",
    subtitulo: "Abra sua empresa rápido, sem burocracia e sem erro",
    descricao: "Contador + advogado trabalhando juntos para registrar sua empresa na Junta Comercial e na Receita Federal com o enquadramento tributário correto desde o início.",
    icone: "🚀",
    categoria: "contabilidade",
    keywords: ["abrir empresa", "abertura de empresa online", "como abrir cnpj", "registrar empresa"],
    faqs: [
      { pergunta: "Quanto tempo leva para abrir uma empresa?", resposta: "Com a integração REDESIM, hoje leva entre 1 e 5 dias úteis para LTDA em boa parte do Brasil. Municípios menores podem demorar até 15 dias para emissão do alvará." },
      { pergunta: "Qual o tipo de empresa ideal para quem está começando?", resposta: "Depende da atividade e da presença ou não de sócio. MEI é o mais simples, mas tem limitações. Para autônomos sem sócios, a SLU (Sociedade Limitada Unipessoal) é uma boa opção." },
      { pergunta: "Preciso de advogado para abrir empresa?", resposta: "Não é obrigatório para empresas simples. Mas para holdings, sociedades complexas ou inclusão de cláusulas específicas no contrato social, um advogado protege seus interesses." },
    ],
    blogRelacionado: ["como-abrir-empresa-passo-a-passo", "quanto-custa-abrir-empresa-2026", "preciso-de-contador-para-abrir-empresa"],
    ctaTexto: "Abrir minha empresa com suporte especializado",
    ctaSubtexto: "Processo 100% digital · Acompanhamento do início ao fim",
  },
  {
    slug: "certificado-digital",
    titulo: "Certificado Digital para Empresa",
    subtitulo: "e-CNPJ A1 e A3 para emitir NF-e, acessar gov.br e assinar documentos",
    descricao: "Em 2026 o certificado digital é infraestrutura básica de qualquer negócio. Emita NF-e, acesse o eSocial, assine contratos e cumpra obrigações fiscais com validade legal.",
    icone: "🔐",
    categoria: "digital",
    keywords: ["certificado digital empresa", "e-cnpj", "certificado digital cnpj", "icp brasil empresa"],
    faqs: [
      { pergunta: "Qual a diferença entre A1 e A3?", resposta: "O A1 é um arquivo instalado no computador (validade 1 ano). O A3 fica em token USB ou cartão (validade 3 anos). A3 é mais seguro pois a chave privada nunca sai do token." },
      { pergunta: "Todo CNPJ precisa de certificado digital?", resposta: "Empresas obrigadas ao eSocial, SPED, NF-e e obrigações acessórias digitais precisam. Na prática, toda empresa com funcionários ou que emite NF-e precisa." },
      { pergunta: "Qual o custo do certificado digital PJ?", resposta: "e-CNPJ A1 (1 ano): R$150-300. e-CNPJ A3 (3 anos): R$250-500 incluindo token. Reconhecida pela ICP-Brasil." },
    ],
    blogRelacionado: ["certificado-digital-empresa-o-que-e", "como-abrir-empresa-passo-a-passo"],
    ctaTexto: "Emitir certificado digital para minha empresa",
    ctaSubtexto: "Validação presencial ou videoconferência · Entrega imediata A1",
  },
  {
    slug: "regularizacao-cnpj",
    titulo: "Regularização de CNPJ",
    subtitulo: "Resolva situação inapta, suspensa ou irregular do seu CNPJ",
    descricao: "CNPJ inapto ou suspenso bloqueia emissão de NF-e, acesso a crédito e participação em licitações. Nossa rede resolve de forma rápida e sem multa adicional quando possível.",
    icone: "🔄",
    categoria: "contabilidade",
    keywords: ["regularizar cnpj", "cnpj inapto regularizar", "empresa inapta como resolver", "cnpj suspenso"],
    faqs: [
      { pergunta: "Quanto tempo leva para regularizar um CNPJ inapto?", resposta: "Após entrega das declarações atrasadas (DCTF, ECF, DEFIS), a regularização ocorre em 1 a 5 dias úteis automaticamente no sistema da Receita Federal." },
      { pergunta: "Tem custo para regularizar?", resposta: "O principal custo são as declarações atrasadas e eventuais multas por atraso. Um contador experiente pode reduzir as multas usando recursos administrativos." },
      { pergunta: "CNPJ inapto pode emitir nota fiscal?", resposta: "Não. O sistema de NF-e bloqueia a emissão para CNPJs em situação irregular. Regularizar é urgente para não interromper as operações." },
    ],
    blogRelacionado: ["como-regularizar-empresa-inapta", "situacao-cadastral-cnpj-ativa-baixada", "certidao-negativa-pj-como-obter"],
    ctaTexto: "Regularizar meu CNPJ agora",
    ctaSubtexto: "Análise gratuita da situação · Resolução em até 48h",
  },
  {
    slug: "holding-familiar",
    titulo: "Holding Familiar",
    subtitulo: "Proteção patrimonial e planejamento sucessório via holding",
    descricao: "A holding familiar concentra patrimônio familiar em uma empresa, reduzindo ITCMD na herança, protegendo ativos de credores e facilitando a transmissão de patrimônio entre gerações.",
    icone: "🏛️",
    categoria: "advocacia",
    keywords: ["holding familiar", "holding patrimonial", "planejamento sucessório holding", "proteção patrimonial empresa"],
    faqs: [
      { pergunta: "Holding familiar é só para ricos?", resposta: "Não mais. Para patrimônios acima de R$500k (imóveis, participações societárias), os benefícios já superam os custos de manutenção. Consulte um advogado para o seu caso." },
      { pergunta: "Quanto economiza no ITCMD com holding?", resposta: "O ITCMD sobre heranças chega a 8% em alguns estados. Com holding, a transmissão de cotas segue regras mais favoráveis e planejadas, podendo reduzir significativamente o imposto." },
      { pergunta: "Preciso de advogado e contador para abrir holding?", resposta: "Sim, dos dois. O advogado estrutura o contrato social e o planejamento sucessório. O contador trata do regime tributário e das obrigações fiscais da holding." },
    ],
    blogRelacionado: ["holding-familiar-o-que-e-vale-a-pena", "quando-contratar-advogado-empresarial", "contrato-social-o-que-e-como-alterar"],
    ctaTexto: "Estruturar minha holding familiar",
    ctaSubtexto: "Advogados e contadores especializados · Avaliação inicial gratuita",
  },
  {
    slug: "conta-pj",
    titulo: "Conta PJ para Empresas",
    subtitulo: "Conta corrente para CNPJ: digital, sem mensalidade e com crédito",
    descricao: "Separar finanças pessoais e empresariais é obrigação legal e boa prática. Nossa rede de parceiros bancários oferece conta PJ digital com abertura 100% online.",
    icone: "🏦",
    categoria: "financeiro",
    keywords: ["conta pj", "conta pj empresa", "conta corrente cnpj", "banco digital pj"],
    faqs: [
      { pergunta: "Conta PJ é obrigatória?", resposta: "Para MEI não há obrigação legal explícita, mas misturar contas pessoal e empresarial causa problemas na declaração do IRPF e dificulta o controle financeiro. Para ME, EPP e LTDA é praticamente obrigatório na prática." },
      { pergunta: "Banco digital PJ tem desvantagens?", resposta: "Bancos digitais têm taxas menores, mas alguns não têm limite de crédito robusto ou integração com sistemas ERP. Para empresas com folha de pagamento e crédito, avalie também bancos tradicionais." },
      { pergunta: "Quais documentos preciso para abrir conta PJ?", resposta: "CNPJ ativo, contrato social ou CCMEI, RG/CNH dos sócios, comprovante de endereço da empresa. Bancos digitais fazem isso 100% online." },
    ],
    blogRelacionado: ["conta-pj-qual-banco-cnpj", "como-abrir-empresa-passo-a-passo", "mei-simples-lucro-real-diferencas"],
    ctaTexto: "Abrir conta PJ para minha empresa",
    ctaSubtexto: "Abertura 100% digital · Sem mensalidade nos primeiros 12 meses",
  },
];

export function getServico(slug: string): Servico | undefined {
  return SERVICOS.find((s) => s.slug === slug);
}

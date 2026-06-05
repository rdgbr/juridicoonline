import { Meilisearch } from "meilisearch";

const HOST = process.env.MEILI_HOST || "http://195.35.40.29:7700";
const KEY = process.env.MEILI_KEY || "masterKey";
const INDEX = process.env.MEILI_INDEX || "empresas";

export const meili = new Meilisearch({ host: HOST, apiKey: KEY });
export const empresasIndex = meili.index(INDEX);

export type Empresa = {
  id: string;
  cnpj_completo: string;
  razao_social: string;
  nome_fantasia?: string | null;
  natureza_juridica?: string | null;
  capital_social?: number | null;
  data_situacao?: string | null;
  data_inicio_atividade?: string | null;
  cnae_principal?: string | null;
  cnae_descricao?: string | null;
  tipo_logradouro?: string | null;
  logradouro?: string | null;
  numero?: string | null;
  complemento?: string | null;
  bairro?: string | null;
  cep?: string | null;
  uf?: string | null;
  municipio_nome?: string | null;
  telefone1?: string | null;
  telefone2?: string | null;
  email?: string | null;
  opcao_simples?: string | null;
  opcao_mei?: string | null;
  situacao?: string | null;
  porte?: string | null;
  tem_whatsapp?: boolean;
};

export type SearchResult = {
  hits: Empresa[];
  estimatedTotalHits: number;
  processingTimeMs: number;
  query: string;
};

type SearchOpts = {
  q?: string;
  limit?: number;
  offset?: number;
  filter?: string | string[];
  facets?: string[];
  sort?: string[];
};

export async function searchEmpresas(opts: SearchOpts): Promise<SearchResult> {
  try {
    // Smarter default sort: when user provides a text query (not pure CNPJ),
    // tiebreak by capital_social desc so the main legal entity (e.g. BANCO DO
    // BRASIL SA with R$120B capital) ranks above peripheral branches (e.g.
    // "BANCO DO BRASIL AG SUCURSAL ITALIA"). Meili applies sort AFTER relevance,
    // so this only changes order between equally-relevant results.
    let sort = opts.sort;
    const q = (opts.q || "").trim();
    const isPureCnpj = q && /^\d{8,14}$/.test(q.replace(/\D/g, ""));
    if (!sort && q && !isPureCnpj) {
      sort = ["capital_social:desc"];
    }

    const res = await empresasIndex.search<Empresa>(q, {
      limit: opts.limit ?? 20,
      offset: opts.offset ?? 0,
      filter: opts.filter,
      facets: opts.facets,
      sort,
    });
    return {
      hits: res.hits,
      estimatedTotalHits: res.estimatedTotalHits ?? 0,
      processingTimeMs: res.processingTimeMs ?? 0,
      query: res.query ?? "",
    };
  } catch (e) {
    console.error("[meili] search error", e);
    return { hits: [], estimatedTotalHits: 0, processingTimeMs: 0, query: opts.q || "" };
  }
}

export async function getEmpresaByCNPJ(cnpj: string): Promise<Empresa | null> {
  const clean = cnpj.replace(/\D/g, "");
  if (clean.length !== 14) return null;
  try {
    const doc = await empresasIndex.getDocument<Empresa>(clean);
    return doc;
  } catch {
    return null;
  }
}

export async function countByUF(uf: string, ativasOnly = true): Promise<number> {
  const filter: string[] = [`uf = "${uf.toUpperCase()}"`];
  if (ativasOnly) filter.push('situacao = "ATIVA"');
  const res = await searchEmpresas({ q: "", limit: 1, filter });
  return res.estimatedTotalHits;
}

export async function listByUF(uf: string, page = 1, perPage = 50, municipio?: string) {
  const filter: string[] = [`uf = "${uf.toUpperCase()}"`, 'situacao = "ATIVA"'];
  if (municipio) filter.push(`municipio_nome = "${municipio}"`);
  return searchEmpresas({
    q: "",
    limit: perPage,
    offset: (page - 1) * perPage,
    filter,
    sort: ["capital_social:desc"],
  });
}

export async function listMunicipiosByUF(uf: string): Promise<{ name: string; count: number }[]> {
  try {
    const res = await empresasIndex.search("", {
      limit: 0,
      filter: [`uf = "${uf.toUpperCase()}"`, 'situacao = "ATIVA"'],
      facets: ["municipio_nome"],
    });
    const facets = (res.facetDistribution?.municipio_nome ?? {}) as Record<string, number>;
    return Object.entries(facets)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  } catch (e) {
    console.error("[meili] facets error", e);
    return [];
  }
}

export const UFS = [
  { sigla: "AC", nome: "Acre" },
  { sigla: "AL", nome: "Alagoas" },
  { sigla: "AP", nome: "Amapá" },
  { sigla: "AM", nome: "Amazonas" },
  { sigla: "BA", nome: "Bahia" },
  { sigla: "CE", nome: "Ceará" },
  { sigla: "DF", nome: "Distrito Federal" },
  { sigla: "ES", nome: "Espírito Santo" },
  { sigla: "GO", nome: "Goiás" },
  { sigla: "MA", nome: "Maranhão" },
  { sigla: "MT", nome: "Mato Grosso" },
  { sigla: "MS", nome: "Mato Grosso do Sul" },
  { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "PA", nome: "Pará" },
  { sigla: "PB", nome: "Paraíba" },
  { sigla: "PR", nome: "Paraná" },
  { sigla: "PE", nome: "Pernambuco" },
  { sigla: "PI", nome: "Piauí" },
  { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RN", nome: "Rio Grande do Norte" },
  { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "RO", nome: "Rondônia" },
  { sigla: "RR", nome: "Roraima" },
  { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" },
  { sigla: "SE", nome: "Sergipe" },
  { sigla: "TO", nome: "Tocantins" },
];

export function ufNome(sigla: string): string {
  return UFS.find((u) => u.sigla === sigla.toUpperCase())?.nome || sigla;
}

// ─── Gray-hat SEO helpers ───────────────────────────────────────

/**
 * Get related companies (same CNAE in same UF, optionally same municipality).
 * Used for the "Empresas relacionadas" internal-linking block.
 */
export async function getRelatedEmpresas(
  empresa: Empresa,
  limit = 24
): Promise<Empresa[]> {
  if (!empresa.cnae_principal && !empresa.uf) return [];
  const filters: string[] = ['situacao = "ATIVA"'];
  if (empresa.uf) filters.push(`uf = "${empresa.uf}"`);
  if (empresa.cnae_principal) filters.push(`cnae_principal = "${empresa.cnae_principal}"`);
  filters.push(`cnpj_completo != "${empresa.cnpj_completo}"`);

  // Run tight (same municipio) and wide (same UF) in parallel — halves latency
  const tightPromise = empresa.municipio_nome
    ? empresasIndex.search<Empresa>("", {
        limit,
        filter: [...filters, `municipio_nome = "${empresa.municipio_nome}"`],
        sort: ["capital_social:desc"],
      }).catch(() => ({ hits: [] as Empresa[] }))
    : Promise.resolve({ hits: [] as Empresa[] });

  const widePromise = empresasIndex.search<Empresa>("", {
    limit,
    filter: filters,
    sort: ["capital_social:desc"],
  }).catch(() => ({ hits: [] as Empresa[] }));

  const [tight, wide] = await Promise.all([tightPromise, widePromise]);
  return tight.hits.length >= 8 ? tight.hits : wide.hits;
}

/**
 * Get top companies for a given CNAE code (for /cnae/[cod] pages).
 */
export async function topByCnae(cnae: string, uf?: string, limit = 50): Promise<Empresa[]> {
  const filter: string[] = [`cnae_principal = "${cnae}"`, 'situacao = "ATIVA"'];
  if (uf) filter.push(`uf = "${uf.toUpperCase()}"`);
  const res = await empresasIndex.search<Empresa>("", {
    limit,
    filter,
    sort: ["capital_social:desc"],
  });
  return res.hits;
}

/**
 * Get companies by sócio name (placeholder until socios index is wired).
 * Returns empty for now — /socio/[slug] page handles empty gracefully.
 * TODO: connect to socios index or Postgres mirror.
 */
export async function getEmpresasBySocioName(_nome: string, _limit = 50): Promise<Empresa[]> {
  return [];
}

/**
 * Get top CNAEs for a UF (for /empresas/[uf]/[cnae] hub).
 */
export async function topCnaesByUF(uf: string, limit = 50): Promise<{ codigo: string; count: number }[]> {
  const res = await empresasIndex.search("", {
    limit: 0,
    filter: [`uf = "${uf.toUpperCase()}"`, 'situacao = "ATIVA"'],
    facets: ["cnae_principal"],
  });
  const facets = (res.facetDistribution?.cnae_principal ?? {}) as Record<string, number>;
  return Object.entries(facets)
    .map(([codigo, count]) => ({ codigo, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Count companies opened today/this-week (for "Atualizado hoje" badge + landing pages).
 * Uses data_inicio_atividade with format YYYYMMDD.
 */
export async function countNewCompanies(uf?: string, days = 7): Promise<number> {
  const today = new Date();
  today.setDate(today.getDate() - days);
  const cutoff =
    today.getFullYear().toString() +
    String(today.getMonth() + 1).padStart(2, "0") +
    String(today.getDate()).padStart(2, "0");
  const filter: string[] = [`data_inicio_atividade >= "${cutoff}"`];
  if (uf) filter.push(`uf = "${uf.toUpperCase()}"`);
  const res = await searchEmpresas({ q: "", limit: 1, filter });
  return res.estimatedTotalHits;
}

/**
 * List empresas filtered (maiores by capital, MEI, Simples Nacional).
 */
export async function listFilteredByUF(
  uf: string,
  filterType: "maiores" | "mei" | "simples" | "baixada",
  limit = 100
): Promise<Empresa[]> {
  // BAIXADA pede situacao diferente; demais usam ATIVA
  const situacao = filterType === "baixada" ? "BAIXADA" : "ATIVA";
  const filter: string[] = [`uf = "${uf.toUpperCase()}"`, `situacao = "${situacao}"`];
  let sort: string[] = ["capital_social:desc"];

  if (filterType === "mei") {
    filter.push('opcao_mei = "S"');
    sort = ["data_inicio_atividade:desc"];
  } else if (filterType === "simples") {
    filter.push('opcao_simples = "S"');
    sort = ["capital_social:desc"];
  } else if (filterType === "baixada") {
    // Empresas baixadas: prioriza as maiores (mais buscadas)
    sort = ["capital_social:desc"];
  }

  const res = await empresasIndex.search<Empresa>("", {
    limit,
    filter,
    sort,
  });
  return res.hits;
}

/**
 * List empresas opened in a given period (YYYY-MM format).
 * Used by /empresas-abertas/[uf]/[periodo] landings.
 */
/**
 * Stats agregados para a hub page de UF — tudo em paralelo numa chamada só.
 * Retorna: total, MEI, Simples, abertas nos últimos 30 dias, top CNAEs, municípios.
 */
export type UFStats = {
  totalAtivas: number;
  totalMei: number;
  totalSimples: number;
  abertas30d: number;
  topCnaes: { codigo: string; descricao: string; count: number }[];
  topMunicipios: { name: string; count: number }[];
};

export async function getUFStats(uf: string): Promise<UFStats> {
  const sigla = uf.toUpperCase();
  const baseFilter = [`uf = "${sigla}"`, 'situacao = "ATIVA"'];

  // Calcula cutoff dos últimos 30 dias
  const cutoff30 = new Date();
  cutoff30.setDate(cutoff30.getDate() - 30);
  const cutoffStr =
    cutoff30.getFullYear().toString() +
    String(cutoff30.getMonth() + 1).padStart(2, "0") +
    String(cutoff30.getDate()).padStart(2, "0");

  const [statsRes, meiRes, simplesRes, abertas30Res, topCnaeRes] = await Promise.all([
    // facets de município — 1 query que retorna contagem total + top municípios + CNAEs
    empresasIndex.search<Empresa>("", {
      limit: 0,
      filter: baseFilter,
      facets: ["municipio_nome", "cnae_principal"],
    }).catch(() => null),
    // MEI count
    empresasIndex.search("", { limit: 0, filter: [...baseFilter, 'opcao_mei = "S"'] })
      .catch(() => ({ estimatedTotalHits: 0 })),
    // Simples count
    empresasIndex.search("", { limit: 0, filter: [...baseFilter, 'opcao_simples = "S"'] })
      .catch(() => ({ estimatedTotalHits: 0 })),
    // Abertas últimos 30 dias
    empresasIndex.search("", {
      limit: 0,
      filter: [`uf = "${sigla}"`, `data_inicio_atividade >= "${cutoffStr}"`],
    }).catch(() => ({ estimatedTotalHits: 0 })),
    // Top CNAEs com descrição (pega 1 empresa de cada CNAE)
    empresasIndex.search<Empresa>("", {
      limit: 0, filter: baseFilter, facets: ["cnae_principal"],
    }).catch(() => null),
  ]);

  // Processa municípios
  const munFacets = (statsRes?.facetDistribution?.municipio_nome ?? {}) as Record<string, number>;
  const topMunicipios = Object.entries(munFacets)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 50);

  // Total real: soma dos municípios (mais preciso que estimatedTotalHits)
  const totalAtivas = statsRes?.estimatedTotalHits ?? 0;

  // Top CNAEs — busca descrição de cada top CNAE em paralelo (limitado a 10)
  const cnaeRaw = (topCnaeRes?.facetDistribution?.cnae_principal ?? {}) as Record<string, number>;
  const topCnaeList = Object.entries(cnaeRaw)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  // Pega descrição do primeiro CNAE batendo na empresa — em paralelo
  const topCnaes = await Promise.all(
    topCnaeList.map(async ([codigo, count]) => {
      try {
        const res = await empresasIndex.search<Empresa>("", {
          limit: 1,
          filter: [...baseFilter, `cnae_principal = "${codigo}"`],
          attributesToRetrieve: ["cnae_descricao"],
        });
        return { codigo, descricao: res.hits[0]?.cnae_descricao || codigo, count };
      } catch {
        return { codigo, descricao: codigo, count };
      }
    })
  );

  return {
    totalAtivas,
    totalMei: meiRes.estimatedTotalHits ?? 0,
    totalSimples: simplesRes.estimatedTotalHits ?? 0,
    abertas30d: abertas30Res.estimatedTotalHits ?? 0,
    topCnaes,
    topMunicipios,
  };
}

/**
 * Stats para página de CNAE — total nacional, top UFs, contagem total.
 */
export type CNAEStats = {
  totalNacional: number;
  topUFs: { uf: string; nome: string; count: number }[];
};

export async function getCNAEStats(cnae: string): Promise<CNAEStats> {
  const filter = [`cnae_principal = "${cnae}"`, 'situacao = "ATIVA"'];
  const res = await empresasIndex.search("", {
    limit: 0, filter, facets: ["uf"],
  }).catch(() => null);

  const ufFacets = (res?.facetDistribution?.uf ?? {}) as Record<string, number>;
  const topUFs = Object.entries(ufFacets)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([uf, count]) => ({
      uf,
      nome: UFS.find(u => u.sigla === uf)?.nome || uf,
      count,
    }));

  return {
    totalNacional: res?.estimatedTotalHits ?? 0,
    topUFs,
  };
}

export async function listEmpresasAbertasNoPeriodo(
  uf: string,
  ano: number,
  mes: number,
  limit = 100
): Promise<{ hits: Empresa[]; total: number }> {
  const mm = String(mes).padStart(2, "0");
  const inicio = `${ano}${mm}01`;
  const fim = `${ano}${mm}31`;
  const filter: string[] = [
    `uf = "${uf.toUpperCase()}"`,
    `data_inicio_atividade >= "${inicio}"`,
    `data_inicio_atividade <= "${fim}"`,
  ];
  const res = await empresasIndex.search<Empresa>("", {
    limit,
    filter,
    sort: ["data_inicio_atividade:desc"],
  });
  return {
    hits: res.hits,
    total: res.estimatedTotalHits ?? 0,
  };
}

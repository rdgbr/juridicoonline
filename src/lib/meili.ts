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
    const res = await empresasIndex.search<Empresa>(opts.q || "", {
      limit: opts.limit ?? 20,
      offset: opts.offset ?? 0,
      filter: opts.filter,
      facets: opts.facets,
      sort: opts.sort,
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

  // First try same UF + same CNAE + same municipality
  if (empresa.municipio_nome) {
    const tight = await empresasIndex.search<Empresa>("", {
      limit,
      filter: [...filters, `municipio_nome = "${empresa.municipio_nome}"`],
      sort: ["capital_social:desc"],
    });
    if (tight.hits.length >= 8) return tight.hits;
  }

  // Fallback: same UF + same CNAE
  const wide = await empresasIndex.search<Empresa>("", {
    limit,
    filter: filters,
    sort: ["capital_social:desc"],
  });
  return wide.hits;
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

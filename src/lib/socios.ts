/**
 * Sócios helpers — query the local Postgres mirror of RFB QSA data.
 * Imported from /root/dados_socios via scripts/import_socios.py.
 */
import { prisma } from "@/lib/db";
import { empresasIndex, type Empresa } from "@/lib/meili";
import { empresaSlug as buildSlug } from "@/lib/cnpj";

export type Socio = {
  id: string;
  cnpjBasico: string;
  identificadorTipo: number; // 1=PJ, 2=PF, 3=Estrangeiro
  nome: string;
  nomeSlug: string;
  cnpjCpfSocio: string | null;
  qualificacao: number | null;
  qualificacaoDesc: string | null;
  dataEntrada: string | null;
  pais: string | null;
  representanteCpf: string | null;
  representanteNome: string | null;
  qualifRepresent: number | null;
  faixaEtaria: number | null;
};

const QUALIFICACAO_MAP: Record<number, string> = {
  5: "Administrador",
  8: "Conselheiro de Administração",
  10: "Diretor",
  16: "Presidente",
  17: "Procurador",
  20: "Sociedade Consorciada",
  21: "Sociedade Filiada",
  22: "Sócio",
  23: "Sócio Capitalista",
  24: "Sócio Comanditado",
  25: "Sócio Comanditário",
  26: "Sócio de Indústria",
  28: "Sócio-Gerente",
  29: "Sócio Incapaz ou Relat.Incapaz (exceto menor)",
  30: "Sócio Menor (Tutelado ou Emancip.)",
  31: "Sócio Ostensivo",
  37: "Sócio Pessoa Jurídica Domiciliado no Exterior",
  38: "Sócio Pessoa Física Residente no Exterior",
  39: "Diretor não Residente",
  47: "Sócio Pessoa Física Residente no Brasil",
  48: "Sócio Pessoa Jurídica Domiciliado no Brasil",
  49: "Sócio-Administrador",
  50: "Empresário",
  52: "Sócio Residente ou Domiciliado no Exterior",
  53: "Titular Pessoa Física Residente no Brasil",
  54: "Titular Pessoa Física Residente ou Domiciliado no Exterior",
  55: "Titular Pessoa Física Incapaz ou Relat.Incapaz (exceto menor)",
  56: "Titular Pessoa Física Menor (Tutelado ou Emancip.)",
  57: "Sócio Pessoa Física",
  58: "Sócio Pessoa Jurídica",
  59: "Sócio Capitalista",
  60: "Sócio Comanditado",
  61: "Sócio Comanditário",
  62: "Sócio de Indústria",
  63: "Cotas em Tesouraria",
  64: "Sócio Ostensivo",
  65: "Titular Pessoa Jurídica Domiciliada no Brasil",
  66: "Titular Pessoa Jurídica Domiciliada no Exterior",
  67: "Pessoa Física Não-Residente",
  68: "Fundador",
  78: "Titular Pessoa Física Imigrante",
};

export function qualificacaoLabel(code: number | null): string {
  if (!code) return "Sócio";
  return QUALIFICACAO_MAP[code] || `Qualificação ${code}`;
}

/**
 * Get all sócios for a given CNPJ (uses the 8-digit base).
 */
export async function getSociosByCnpj(cnpj: string): Promise<Socio[]> {
  const cnpjBasico = cnpj.replace(/\D/g, "").slice(0, 8);
  if (cnpjBasico.length !== 8) return [];
  try {
    const rows = await prisma.socio.findMany({
      where: { cnpjBasico },
      orderBy: [{ identificadorTipo: "asc" }, { qualificacao: "asc" }],
      take: 30,
    });
    return rows.map((r) => ({
      ...r,
      qualificacaoDesc: r.qualificacaoDesc || qualificacaoLabel(r.qualificacao),
    }));
  } catch (e) {
    console.error("[socios] getSociosByCnpj error", e);
    return [];
  }
}

export type SocioSearchHit = {
  nome: string;
  nomeSlug: string;
  count: number; // quantas empresas este sócio tem
};

/**
 * Busca sócios por nome no Postgres.
 * Converte a query para slug e usa prefix scan no índice de nomeSlug (rápido).
 * Fallback: se slug completo não achar, tenta com o primeiro termo.
 */
export async function searchSociosByQuery(q: string, limit = 8): Promise<SocioSearchHit[]> {
  const rawSlug = (q || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  if (rawSlug.length < 2) return [];

  try {
    // Prefix scan — usa o índice B-tree em nomeSlug (eficiente em 25M linhas)
    const rows = await prisma.$queryRaw<Array<{ nome: string; nome_slug: string; n: bigint }>>`
      SELECT nome, "nomeSlug" AS nome_slug, COUNT(*) AS n
      FROM "Socio"
      WHERE "nomeSlug" LIKE ${rawSlug + "%"}
      GROUP BY nome, "nomeSlug"
      ORDER BY n DESC, nome ASC
      LIMIT ${limit}
    `;

    // Fallback: se não achou com slug completo, tenta só o primeiro termo
    if (rows.length === 0 && rawSlug.includes("-")) {
      const firstTerm = rawSlug.split("-")[0];
      const fallback = await prisma.$queryRaw<Array<{ nome: string; nome_slug: string; n: bigint }>>`
        SELECT nome, "nomeSlug" AS nome_slug, COUNT(*) AS n
        FROM "Socio"
        WHERE "nomeSlug" LIKE ${firstTerm + "%"}
        GROUP BY nome, "nomeSlug"
        ORDER BY n DESC, nome ASC
        LIMIT ${limit}
      `;
      return fallback.map(r => ({ nome: r.nome, nomeSlug: r.nome_slug, count: Number(r.n) }));
    }

    return rows.map(r => ({ nome: r.nome, nomeSlug: r.nome_slug, count: Number(r.n) }));
  } catch (e) {
    console.error("[socios] searchSociosByQuery error", e);
    return [];
  }
}

/**
 * Get all empresas where a person/entity is a sócio.
 * Searches by exact nomeSlug match first, then by ILIKE on nome.
 */
export async function getEmpresasBySocio(slug: string): Promise<Array<{ empresa: Empresa; socio: Socio }>> {
  try {
    const socios = await prisma.socio.findMany({
      where: { nomeSlug: slug },
      take: 50,
    });
    if (socios.length === 0) return [];

    // Get the empresas for these CNPJs from MeiliSearch (we need full data)
    const cnpjsBasicos = [...new Set(socios.map((s) => s.cnpjBasico))];

    // Parallel Meili lookups — cap at 10 concurrent to avoid saturating remote server
    const empresas: Empresa[] = [];
    const BATCH = 10;
    for (let i = 0; i < Math.min(cnpjsBasicos.length, 50); i += BATCH) {
      const chunk = cnpjsBasicos.slice(i, i + BATCH);
      const results = await Promise.all(
        chunk.map((basico) =>
          empresasIndex.search<Empresa>("", {
            limit: 1,
            filter: [`cnpj_completo >= "${basico}0000000"`, `cnpj_completo <= "${basico}9999999"`],
          }).catch(() => ({ hits: [] as Empresa[] }))
        )
      );
      results.forEach((r) => { if (r.hits[0]) empresas.push(r.hits[0]); });
    }

    // Pair each empresa with its socio
    const pairs: Array<{ empresa: Empresa; socio: Socio }> = [];
    for (const e of empresas) {
      const basico = e.cnpj_completo.slice(0, 8);
      const socio = socios.find((s) => s.cnpjBasico === basico);
      if (socio) pairs.push({ empresa: e, socio });
    }
    return pairs;
  } catch (e) {
    console.error("[socios] getEmpresasBySocio error", e);
    return [];
  }
}

export function socioSlug(nome: string): string {
  return nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .slice(0, 120);
}

export function empresaSlugFromMeili(e: Empresa): string {
  return buildSlug(e.cnpj_completo, e.razao_social);
}

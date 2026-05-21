// Curated SEO hub data — internal linking from homepage and /empresas index.
// CNPJs validated against Meili on 2026-05-21.
// All entries point to real, active companies with high capital_social.

import { empresaSlug } from "@/lib/cnpj";

export type TopEmpresa = { cnpj: string; razaoSocial: string; nomeShort: string };

/** Top 15 empresas brasileiras (validated CNPJs, sorted by capital_social). */
const TOP_EMPRESAS_RAW: TopEmpresa[] = [
  { cnpj: "33000167000101", razaoSocial: "PETROLEO BRASILEIRO S A PETROBRAS", nomeShort: "Petrobras" },
  { cnpj: "00000060872504", razaoSocial: "ITAU UNIBANCO HOLDING S.A.",        nomeShort: "Itaú Unibanco" },
  { cnpj: "00000000000191", razaoSocial: "BANCO DO BRASIL SA",                 nomeShort: "Banco do Brasil" },
  { cnpj: "60746948000112", razaoSocial: "BANCO BRADESCO S.A.",                nomeShort: "Bradesco" },
  { cnpj: "61532644000115", razaoSocial: "ITAUSA S.A.",                        nomeShort: "Itaúsa" },
  { cnpj: "33592510000154", razaoSocial: "VALE S.A.",                          nomeShort: "Vale" },
  { cnpj: "02558157000162", razaoSocial: "TELEFONICA BRASIL S.A.",             nomeShort: "Telefônica Vivo" },
  { cnpj: "07526557000100", razaoSocial: "AMBEV S.A.",                         nomeShort: "Ambev" },
  { cnpj: "33611500000119", razaoSocial: "GERDAU S.A.",                        nomeShort: "Gerdau" },
  { cnpj: "02916265000160", razaoSocial: "JBS S/A",                            nomeShort: "JBS" },
  { cnpj: "47960950000121", razaoSocial: "MAGAZINE LUIZA S/A",                 nomeShort: "Magazine Luiza" },
  { cnpj: "76483817000120", razaoSocial: "COMPANHIA PARANAENSE DE ENERGIA - COPEL", nomeShort: "Copel" },
  { cnpj: "18236120000158", razaoSocial: "NU PAGAMENTOS S.A. - INSTITUICAO DE PAGAMENTO", nomeShort: "Nubank" },
  { cnpj: "17344597000194", razaoSocial: "BB SEGURIDADE PARTICIPACOES S.A.",   nomeShort: "BB Seguridade" },
];

export const TOP_EMPRESAS = TOP_EMPRESAS_RAW.map((e) => ({
  ...e,
  slug: empresaSlug(e.cnpj, e.razaoSocial),
}));

export type TopCnae = { codigo: string; descricao: string };

/** Top CNAEs por # empresas + relevância comercial. */
export const TOP_CNAES: TopCnae[] = [
  { codigo: "6201501", descricao: "Desenvolvimento de software sob encomenda" },
  { codigo: "4711301", descricao: "Supermercados" },
  { codigo: "8630501", descricao: "Atividade médica ambulatorial" },
  { codigo: "5611201", descricao: "Restaurantes" },
  { codigo: "4751201", descricao: "Comércio varejista de informática" },
  { codigo: "7020400", descricao: "Consultoria em gestão empresarial" },
  { codigo: "9602501", descricao: "Cabeleireiros" },
  { codigo: "4399103", descricao: "Obras de instalações em construções" },
  { codigo: "4781400", descricao: "Comércio de vestuário" },
  { codigo: "4520001", descricao: "Reparação mecânica de veículos" },
  { codigo: "6920601", descricao: "Atividades de contabilidade" },
  { codigo: "7112000", descricao: "Serviços de engenharia" },
  { codigo: "6911701", descricao: "Serviços advocatícios" },
  { codigo: "4774100", descricao: "Cosméticos e perfumaria" },
  { codigo: "8511200", descricao: "Educação infantil" },
  { codigo: "4322302", descricao: "Instalação elétrica" },
];

/** Top 12 capitais brasileiras com slug URL. */
export const CAPITAIS = [
  { uf: "sp", slug: "sao-paulo",      nome: "São Paulo" },
  { uf: "rj", slug: "rio-de-janeiro", nome: "Rio de Janeiro" },
  { uf: "df", slug: "brasilia",       nome: "Brasília" },
  { uf: "mg", slug: "belo-horizonte", nome: "Belo Horizonte" },
  { uf: "ba", slug: "salvador",       nome: "Salvador" },
  { uf: "ce", slug: "fortaleza",      nome: "Fortaleza" },
  { uf: "pe", slug: "recife",         nome: "Recife" },
  { uf: "pr", slug: "curitiba",       nome: "Curitiba" },
  { uf: "rs", slug: "porto-alegre",   nome: "Porto Alegre" },
  { uf: "am", slug: "manaus",         nome: "Manaus" },
  { uf: "pa", slug: "belem",          nome: "Belém" },
  { uf: "go", slug: "goiania",        nome: "Goiânia" },
];

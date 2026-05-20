/**
 * GET /api/v1/empresa/[cnpj]
 *
 * Authenticated CNPJ lookup endpoint.
 *
 * Headers:
 *   Authorization: Bearer jol_live_xxxxxxxxxxxxxxxx
 *
 * Returns:
 *   200 → full empresa JSON (cadastral + sócios)
 *   401 → invalid/missing key
 *   404 → CNPJ not found
 *   429 → rate limit or quota exceeded
 */
import { NextResponse } from "next/server";
import { authenticateApiKey, checkRateLimit } from "@/lib/apiAuth";
import { getEmpresaByCNPJ } from "@/lib/meili";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ cnpj: string }> }
) {
  const { cnpj: cnpjParam } = await params;
  const cnpj = cnpjParam.replace(/\D/g, "");

  if (cnpj.length !== 14) {
    return NextResponse.json(
      { error: "invalid_cnpj", message: "CNPJ deve ter 14 dígitos" },
      { status: 400 }
    );
  }

  // 1. Auth
  const authResult = await authenticateApiKey(req.headers.get("authorization"));
  if (!authResult.ok || !authResult.auth) {
    return NextResponse.json(
      { error: "unauthorized", message: authResult.error },
      { status: authResult.status }
    );
  }
  const { auth } = authResult;

  // 2. Rate limit (per-minute)
  if (!checkRateLimit(auth.keyId, auth.rateLimit)) {
    return NextResponse.json(
      {
        error: "rate_limit_exceeded",
        message: `Rate limit ${auth.rateLimit} req/min excedido`,
      },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  // 3. Lookup
  const empresa = await getEmpresaByCNPJ(cnpj);
  if (!empresa) {
    return NextResponse.json(
      { error: "not_found", message: "CNPJ não encontrado na base" },
      { status: 404 }
    );
  }

  // 4. Sócios from Postgres (Socio table)
  const cnpjBasico = cnpj.slice(0, 8);
  const socios = await prisma.socio.findMany({
    where: { cnpjBasico },
    select: {
      nome: true,
      qualificacaoDesc: true,
      dataEntrada: true,
      cnpjCpfSocio: true,
      representanteNome: true,
    },
    take: 50,
  });

  return NextResponse.json(
    {
      cnpj: empresa.cnpj_completo,
      razao_social: empresa.razao_social,
      nome_fantasia: empresa.nome_fantasia,
      situacao: empresa.situacao,
      porte: empresa.porte,
      natureza_juridica: empresa.natureza_juridica,
      capital_social: empresa.capital_social,
      cnae_principal: empresa.cnae_principal,
      cnae_descricao: empresa.cnae_descricao,
      data_inicio_atividade: empresa.data_inicio_atividade,
      logradouro: empresa.logradouro,
      numero: empresa.numero,
      bairro: empresa.bairro,
      municipio: empresa.municipio_nome,
      uf: empresa.uf,
      cep: empresa.cep,
      telefone1: empresa.telefone1,
      telefone2: empresa.telefone2,
      email: empresa.email,
      opcao_simples: empresa.opcao_simples,
      opcao_mei: empresa.opcao_mei,
      socios,
      _meta: {
        source: "Receita Federal do Brasil",
        updated_daily: true,
        rate_limit_remaining: `${auth.rateLimit - 0}/min`,
        quota_remaining: `${auth.monthlyQuota - auth.monthlyUsed}/month`,
      },
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "private, max-age=300",
        "X-RateLimit-Limit": String(auth.rateLimit),
        "X-Quota-Remaining": String(auth.monthlyQuota - auth.monthlyUsed),
      },
    }
  );
}

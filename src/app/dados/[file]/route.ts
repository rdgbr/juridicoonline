import { NextResponse } from "next/server";
import { empresasIndex, UFS, type Empresa } from "@/lib/meili";
import { formatCNPJ } from "@/lib/cnpj";

export const revalidate = 86400;
export const dynamic = "force-static";

function escapeCsv(s: string | number | null | undefined): string {
  if (s == null) return "";
  const str = String(s);
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ file: string }> }
) {
  const { file } = await params;
  // Filename pattern: top-1000-{uf}.csv
  const m = file.match(/^top-(\d+)-([a-z]{2})\.csv$/);
  if (!m) return new NextResponse("Not found", { status: 404 });

  const count = Math.min(1000, parseInt(m[1], 10));
  const uf = m[2].toUpperCase();
  if (!UFS.find((u) => u.sigla === uf)) {
    return new NextResponse("UF inválida", { status: 404 });
  }

  const res = await empresasIndex.search<Empresa>("", {
    limit: count,
    filter: [`uf = "${uf}"`, 'situacao = "ATIVA"'],
    sort: ["capital_social:desc"],
  });

  const headers = [
    "cnpj",
    "razao_social",
    "nome_fantasia",
    "cnae_principal",
    "cnae_descricao",
    "capital_social",
    "municipio",
    "uf",
    "data_inicio_atividade",
  ];
  const rows = res.hits.map((e) =>
    [
      formatCNPJ(e.cnpj_completo),
      escapeCsv(e.razao_social),
      escapeCsv(e.nome_fantasia),
      e.cnae_principal,
      escapeCsv(e.cnae_descricao),
      e.capital_social,
      escapeCsv(e.municipio_nome),
      e.uf,
      e.data_inicio_atividade,
    ].join(",")
  );
  const csv = [headers.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${file}"`,
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}

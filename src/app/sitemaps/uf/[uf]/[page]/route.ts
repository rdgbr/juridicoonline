// Paginated sub-sitemap per UF — covers ALL ATIVA empresas for that state.
// 20,000 URLs per page (well under Google 50k limit).
// Pattern: /sitemaps/uf/sp/1, /sitemaps/uf/sp/2, ...

import { NextResponse } from "next/server";
import { empresasIndex, UFS } from "@/lib/meili";
import { SITE_URL } from "@/lib/seo";
import { empresaSlug } from "@/lib/cnpj";

export const revalidate = 86400;
export const dynamic = "force-dynamic";

type EmpresaLite = {
  cnpj_completo: string;
  razao_social: string;
};

export const PAGE_SIZE = 20_000;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ uf: string; page: string }> }
) {
  const { uf, page } = await params;
  const ufUpper = uf.toUpperCase();
  if (!UFS.find((u) => u.sigla === ufUpper)) {
    return new NextResponse("Not found", { status: 404 });
  }
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const offset = (pageNum - 1) * PAGE_SIZE;

  let urls: string[] = [];
  try {
    const res = await empresasIndex.search<EmpresaLite>("", {
      limit: PAGE_SIZE,
      offset,
      filter: [`uf = "${ufUpper}"`, 'situacao = "ATIVA"'],
      attributesToRetrieve: ["cnpj_completo", "razao_social"],
    });
    urls = res.hits.map(
      (e) => `${SITE_URL}/empresa/${empresaSlug(e.cnpj_completo, e.razao_social)}`
    );
  } catch (e) {
    console.error("[sitemap uf page] error", e);
  }

  if (urls.length === 0) {
    return new NextResponse("Empty page", { status: 404 });
  }

  const nowIso = new Date().toISOString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url><loc>${u}</loc><lastmod>${nowIso}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400",
    },
  });
}

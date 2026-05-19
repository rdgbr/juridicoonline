// Per-UF sitemap — lists top 5,000 active companies (by capital social) for each state.
// Generated dynamically, cached 24h. Submitted to Google via sitemap-index.

import { NextResponse } from "next/server";
import { empresasIndex, UFS } from "@/lib/meili";
import { SITE_URL } from "@/lib/seo";
import { empresaSlug } from "@/lib/cnpj";

export const revalidate = 86400;
export const dynamic = "force-static";

type EmpresaLite = {
  cnpj_completo: string;
  razao_social: string;
  data_atualizacao?: string;
};

const PER_SITEMAP = 5000; // Google limit: 50k urls / file. We keep small for speed.

export async function GET(_req: Request, { params }: { params: Promise<{ uf: string }> }) {
  const { uf } = await params;
  const ufUpper = uf.toUpperCase();
  if (!UFS.find((u) => u.sigla === ufUpper)) {
    return new NextResponse("Not found", { status: 404 });
  }

  let urls: string[] = [];
  try {
    const res = await empresasIndex.search<EmpresaLite>("", {
      limit: PER_SITEMAP,
      filter: [`uf = "${ufUpper}"`, 'situacao = "ATIVA"'],
      sort: ["capital_social:desc"],
      attributesToRetrieve: ["cnpj_completo", "razao_social"],
    });

    urls = res.hits.map((e) => `${SITE_URL}/empresa/${empresaSlug(e.cnpj_completo, e.razao_social)}`);
  } catch (e) {
    console.error("[sitemap uf] error", e);
  }

  // Also include municipality landing pages
  try {
    const munic = await empresasIndex.search("", {
      limit: 0,
      filter: [`uf = "${ufUpper}"`, 'situacao = "ATIVA"'],
      facets: ["municipio_nome"],
    });
    const facets = (munic.facetDistribution?.municipio_nome ?? {}) as Record<string, number>;
    for (const name of Object.keys(facets).slice(0, 500)) {
      const slug = name.toLowerCase().replace(/\s+/g, "-").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      urls.push(`${SITE_URL}/empresas/${ufUpper.toLowerCase()}/${slug}`);
    }
  } catch (e) {
    console.error("[sitemap uf] municipios error", e);
  }

  const now = new Date().toISOString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.7</priority></url>`).join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, s-maxage=86400" },
  });
}

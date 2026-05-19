import { NextResponse } from "next/server";
import { empresasIndex, UFS } from "@/lib/meili";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 86400;
export const dynamic = "force-static";

export async function GET() {
  const urls: string[] = [];

  try {
    // Get top CNAEs across all of Brazil
    const res = await empresasIndex.search("", {
      limit: 0,
      filter: ['situacao = "ATIVA"'],
      facets: ["cnae_principal"],
    });
    const facets = (res.facetDistribution?.cnae_principal ?? {}) as Record<string, number>;
    const cnaes = Object.keys(facets).filter((c) => c && c.length >= 5);

    // /cnae/[codigo] — 1 page per CNAE
    for (const c of cnaes) urls.push(`${SITE_URL}/cnae/${c}`);

    // /empresas/[uf]/[cnae] — top 200 CNAEs × 27 UFs = 5400 pages
    const topCnaes = Object.entries(facets)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 200)
      .map(([c]) => c);
    for (const u of UFS) {
      for (const c of topCnaes) {
        urls.push(`${SITE_URL}/empresas/${u.sigla.toLowerCase()}/${c}`);
      }
    }
  } catch (e) {
    console.error("[sitemap cnae] error", e);
  }

  const now = new Date().toISOString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>`).join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, s-maxage=86400" },
  });
}

// Master sitemap index — points to all paginated UF sub-sitemaps + CNAE + static.
// Pattern: each UF has N pages of 20k URLs, dynamically calculated from MeiliSearch counts.

import { NextResponse } from "next/server";
import { empresasIndex, UFS } from "@/lib/meili";
import { SITE_URL } from "@/lib/seo";
import { PAGE_SIZE } from "../sitemaps/uf/[uf]/[page]/route";

export const dynamic = "force-dynamic";
export const revalidate = 21600; // 6h

export async function GET() {
  const now = new Date().toISOString();
  const sitemaps: string[] = [];

  sitemaps.push(`${SITE_URL}/sitemaps/static`);
  sitemaps.push(`${SITE_URL}/sitemaps/cnae`);

  // For each UF, count ATIVA empresas and add N paginated sub-sitemaps.
  await Promise.all(
    UFS.map(async (u) => {
      try {
        const res = await empresasIndex.search("", {
          limit: 0,
          filter: [`uf = "${u.sigla}"`, 'situacao = "ATIVA"'],
        });
        const total = res.estimatedTotalHits ?? 0;
        const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
        // Cap at 500 pages per UF (safety — that's 10M URLs)
        const capped = Math.min(pages, 500);
        for (let p = 1; p <= capped; p++) {
          sitemaps.push(`${SITE_URL}/sitemaps/uf/${u.sigla.toLowerCase()}/${p}`);
        }
      } catch (e) {
        console.error(`[sitemap-index] ${u.sigla}`, e);
        sitemaps.push(`${SITE_URL}/sitemaps/uf/${u.sigla.toLowerCase()}/1`);
      }
    })
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map((s) => `  <sitemap><loc>${s}</loc><lastmod>${now}</lastmod></sitemap>`).join("\n")}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=86400",
    },
  });
}

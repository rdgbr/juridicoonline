// Sitemap INDEX — delegates to /sitemap-index.xml which paginates 26.6M URLs.
// Kept here for backward-compat with previous GSC submissions.
import { NextResponse } from "next/server";
import { empresasIndex, UFS } from "@/lib/meili";
import { SITE_URL } from "@/lib/seo";
import { PAGE_SIZE } from "../sitemaps/uf/[uf]/[page]/route";

export const dynamic = "force-dynamic";
export const revalidate = 21600;

export async function GET() {
  const now = new Date().toISOString();
  const sitemaps: string[] = [];

  sitemaps.push(`${SITE_URL}/sitemaps/static`);
  sitemaps.push(`${SITE_URL}/sitemaps/cnae`);

  await Promise.all(
    UFS.map(async (u) => {
      try {
        const res = await empresasIndex.search("", {
          limit: 0,
          filter: [`uf = "${u.sigla}"`, 'situacao = "ATIVA"'],
        });
        const total = res.estimatedTotalHits ?? 0;
        const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
        const capped = Math.min(pages, 500);
        for (let p = 1; p <= capped; p++) {
          sitemaps.push(`${SITE_URL}/sitemaps/uf/${u.sigla.toLowerCase()}/${p}`);
        }
      } catch {
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
      "Cache-Control": "public, max-age=3600, s-maxage=21600, stale-while-revalidate=86400",
      "CDN-Cache-Control": "public, max-age=21600",
      "Cloudflare-CDN-Cache-Control": "public, max-age=21600",
      Vary: "Accept-Encoding",
    },
  });
}

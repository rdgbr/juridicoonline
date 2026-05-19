// Sitemap INDEX — points to per-UF child sitemaps + static
// This replaces the auto-generated sitemap.ts to support millions of URLs paginated.
import { NextResponse } from "next/server";
import { UFS } from "@/lib/meili";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET() {
  const now = new Date().toISOString();
  const urls: string[] = [];

  // Static sitemap (small)
  urls.push(`${SITE_URL}/sitemaps/static`);

  // One sitemap per UF (paginated internally)
  for (const u of UFS) {
    urls.push(`${SITE_URL}/sitemaps/uf/${u.sigla.toLowerCase()}`);
  }

  // CNAEs index
  urls.push(`${SITE_URL}/sitemaps/cnae`);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <sitemap><loc>${u}</loc><lastmod>${now}</lastmod></sitemap>`).join("\n")}
</sitemapindex>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

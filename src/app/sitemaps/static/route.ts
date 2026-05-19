import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/seo";
import { UFS } from "@/lib/meili";

export const revalidate = 86400;

export async function GET() {
  const now = new Date().toISOString();
  const urls: Array<{ url: string; priority: number; freq: string }> = [
    { url: `${SITE_URL}/`, priority: 1.0, freq: "daily" },
    { url: `${SITE_URL}/empresas`, priority: 0.9, freq: "weekly" },
    { url: `${SITE_URL}/planos`, priority: 0.7, freq: "monthly" },
    { url: `${SITE_URL}/api`, priority: 0.6, freq: "monthly" },
    { url: `${SITE_URL}/sobre`, priority: 0.5, freq: "monthly" },
    { url: `${SITE_URL}/contato`, priority: 0.4, freq: "monthly" },
    { url: `${SITE_URL}/privacidade`, priority: 0.3, freq: "yearly" },
    { url: `${SITE_URL}/termos`, priority: 0.3, freq: "yearly" },
    { url: `${SITE_URL}/lgpd`, priority: 0.3, freq: "yearly" },
  ];

  for (const u of UFS) {
    urls.push({ url: `${SITE_URL}/empresas/${u.sigla.toLowerCase()}`, priority: 0.8, freq: "daily" });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.url}</loc><lastmod>${now}</lastmod><changefreq>${u.freq}</changefreq><priority>${u.priority}</priority></url>`).join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, s-maxage=86400" },
  });
}

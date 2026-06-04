import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/seo";
import { UFS } from "@/lib/meili";
import { getAllPosts } from "@/lib/blog";

export const revalidate = 86400;
export const dynamic = "force-static";

export async function GET() {
  const now = new Date().toISOString();
  const urls: Array<{ url: string; priority: number; freq: string }> = [
    { url: `${SITE_URL}/`, priority: 1.0, freq: "daily" },
    { url: `${SITE_URL}/empresas`, priority: 0.9, freq: "weekly" },
    { url: `${SITE_URL}/socios`, priority: 0.8, freq: "weekly" },
    { url: `${SITE_URL}/cnae`, priority: 0.8, freq: "weekly" },
    { url: `${SITE_URL}/blog`, priority: 0.8, freq: "weekly" },
    { url: `${SITE_URL}/dados`, priority: 0.7, freq: "weekly" },
    { url: `${SITE_URL}/comparar`, priority: 0.8, freq: "weekly" },
    { url: `${SITE_URL}/planos`, priority: 0.7, freq: "monthly" },
    { url: `${SITE_URL}/api`, priority: 0.6, freq: "monthly" },
    { url: `${SITE_URL}/sobre`, priority: 0.5, freq: "monthly" },
    { url: `${SITE_URL}/contato`, priority: 0.4, freq: "monthly" },
    { url: `${SITE_URL}/privacidade`, priority: 0.3, freq: "yearly" },
    { url: `${SITE_URL}/termos`, priority: 0.3, freq: "yearly" },
    { url: `${SITE_URL}/lgpd`, priority: 0.3, freq: "yearly" },
  ];

  // Blog posts
  for (const post of getAllPosts()) {
    urls.push({ url: `${SITE_URL}/blog/${post.slug}`, priority: 0.7, freq: "monthly" });
  }

  for (const u of UFS) {
    const ufLow = u.sigla.toLowerCase();
    urls.push({ url: `${SITE_URL}/empresas/${ufLow}`, priority: 0.8, freq: "daily" });
    // Doorway pages por UF — uma landing por filtro × 27 estados
    urls.push({ url: `${SITE_URL}/maiores-empresas/${ufLow}`, priority: 0.7, freq: "weekly" });
    urls.push({ url: `${SITE_URL}/empresas-mei/${ufLow}`, priority: 0.7, freq: "weekly" });
    urls.push({ url: `${SITE_URL}/empresas-simples/${ufLow}`, priority: 0.7, freq: "weekly" });
    urls.push({ url: `${SITE_URL}/empresas-baixadas/${ufLow}`, priority: 0.6, freq: "monthly" });
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u.url}</loc><lastmod>${now}</lastmod><changefreq>${u.freq}</changefreq><priority>${u.priority}</priority></url>`).join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      "CDN-Cache-Control": "public, max-age=86400",
      "Cloudflare-CDN-Cache-Control": "public, max-age=86400",
      Vary: "Accept-Encoding",
    },
  });
}

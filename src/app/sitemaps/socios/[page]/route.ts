import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 86400;

export const PAGE_SIZE = 5000;

type SocioRow = { nomeSlug: string };

export async function GET(_req: Request, { params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const p = Math.max(1, parseInt(page, 10) || 1);
  const offset = (p - 1) * PAGE_SIZE;

  let rows: SocioRow[] = [];
  try {
    rows = await prisma.$queryRaw<SocioRow[]>`
      SELECT DISTINCT ON ("nomeSlug") "nomeSlug"
      FROM "Socio"
      WHERE "nomeSlug" IS NOT NULL
        AND LENGTH("nomeSlug") > 5
      ORDER BY "nomeSlug"
      LIMIT ${PAGE_SIZE} OFFSET ${offset}
    `;
  } catch {
    rows = [];
  }

  const now = new Date().toISOString();
  const urls = rows
    .map(
      (r) =>
        `  <url><loc>${SITE_URL}/socio/${encodeURIComponent(r.nomeSlug)}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.4</priority></url>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400",
    },
  });
}

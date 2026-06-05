import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const revalidate = 86400;

export const PAGE_SIZE = 5000;
// Cap em 50 páginas: 250k sócios únicos indexáveis — suficiente pro Google.
// Páginas 51-200 causavam 504 (25s cada) porque OFFSET alto = full table scan.
export const MAX_PAGES = 50;

// Timeout em ms para a query Postgres — Googlebot desiste em ~10s, ficamos abaixo disso.
const QUERY_TIMEOUT_MS = 7000;

type SocioRow = { nomeSlug: string };

export async function GET(_req: Request, { params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const p = Math.max(1, parseInt(page, 10) || 1);

  // Retorna 404 pra páginas além do cap — evita Googlebot ficar tentando páginas vazias/lentas
  if (p > MAX_PAGES) {
    return new NextResponse("Not found", { status: 404 });
  }

  const offset = (p - 1) * PAGE_SIZE;

  let rows: SocioRow[] = [];
  try {
    // Race entre a query e timeout — se demorar >7s retorna XML vazio (200) em vez de 504
    const queryPromise = prisma.$queryRaw<SocioRow[]>`
      SELECT DISTINCT ON ("nomeSlug") "nomeSlug"
      FROM "Socio"
      WHERE "nomeSlug" IS NOT NULL
        AND LENGTH("nomeSlug") > 5
      ORDER BY "nomeSlug"
      LIMIT ${PAGE_SIZE} OFFSET ${offset}
    `;
    const timeoutPromise = new Promise<SocioRow[]>((resolve) =>
      setTimeout(() => resolve([]), QUERY_TIMEOUT_MS)
    );
    rows = await Promise.race([queryPromise, timeoutPromise]);
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

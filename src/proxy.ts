import { NextResponse, type NextRequest } from "next/server";

const AUTH_COOKIES = [
  "__Secure-authjs.session-token",
  "authjs.session-token",
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
];

// Páginas SEO — dados públicos, mesmos para todos os usuários.
// Cloudflare tem regra de bypass para auth cookies, então:
//   - Usuários logados → bypass CF → Next.js direto → resposta fresca
//   - Anônimos → cache CF → resposta rápida
// Não precisamos de Vary: Cookie aqui — o bypass CF já separa os dois casos.
const SEO_PREFIXES = [
  "/empresa/",
  "/empresas/",
  "/cnae/",
  "/socio/",
  "/socios",
  "/buscar",
  "/blog",
  "/maiores-empresas/",
  "/empresas-abertas/",
  "/empresas-baixadas/",
  "/empresas-simples/",
  "/empresas-mei/",
  "/comparar",
];

// Páginas de marketing — curto, sem personalização
const MARKETING_PATHS = [
  "/",
  "/sobre",
  "/planos",
  "/api",
  "/contato",
  "/privacidade",
  "/termos",
  "/lgpd",
  "/parceiros",
  "/servicos",
  "/dados",
];

export async function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const path = url.pathname;
  const isLogged = AUTH_COOKIES.some((c) => req.cookies.has(c));

  const res = NextResponse.next();

  // ── Security headers ─────────────────────────────────────────
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "SAMEORIGIN");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "interest-cohort=(), browsing-topics=()");

  // ── Cache strategy ───────────────────────────────────────────
  const isSeoPage   = SEO_PREFIXES.some((p) => path.startsWith(p));
  const isMarketing = MARKETING_PATHS.includes(path);

  if (isLogged) {
    // Logado: nunca cacheia no servidor Next.js.
    // O bypass da CF já impede que o CDN sirva cache pra estes usuários.
    res.headers.set("Cache-Control", "private, no-cache, no-store, must-revalidate");

  } else if (isSeoPage) {
    // Páginas SEO — dados públicos iguais para todos.
    // Cache longo: 1 dia na edge, stale-while-revalidate 7 dias.
    // SEM Vary: Cookie — o bypass CF garante separação auth/anon.
    res.headers.set(
      "Cache-Control",
      "public, s-maxage=86400, stale-while-revalidate=604800"
    );

  } else if (isMarketing) {
    // Marketing: cache curto, também sem Vary: Cookie
    // (bypass CF ainda funciona pra usuários logados)
    res.headers.set(
      "Cache-Control",
      "public, s-maxage=300, stale-while-revalidate=600"
    );
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|googl|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};

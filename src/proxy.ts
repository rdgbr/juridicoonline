import { NextResponse, type NextRequest } from "next/server";

// Auth.js v5 session cookie names (HTTPS uses __Secure- prefix)
const AUTH_COOKIES = [
  "__Secure-authjs.session-token",
  "authjs.session-token",
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
];

export async function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const isLogged = AUTH_COOKIES.some((c) => req.cookies.has(c));

  const res = NextResponse.next();
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "SAMEORIGIN");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "interest-cohort=(), browsing-topics=()");

  // ─── Cache strategy ───────────────────────────────────────────
  // Logged-in users: NEVER cache (header shows their name)
  // Anonymous users on marketing pages: edge-cache short
  // Anonymous on company/UF/CNAE pages: edge-cache longer (these are the SEO pages)

  // Always vary by Cookie so Cloudflare/CDN keeps separate cache for logged vs anon users
  res.headers.append("Vary", "Cookie");

  if (isLogged) {
    res.headers.set("Cache-Control", "private, no-cache, no-store, must-revalidate");
  } else {
    const path = url.pathname;
    const isMarketing = ["/", "/sobre", "/planos", "/api", "/contato", "/empresas", "/privacidade", "/termos", "/lgpd"].includes(path);
    const isSeoPage =
      path.startsWith("/empresa/") ||
      path.startsWith("/empresas/") ||
      path.startsWith("/cnae/") ||
      path.startsWith("/socio/") ||
      path.startsWith("/buscar");

    if (isMarketing) {
      res.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
    } else if (isSeoPage) {
      res.headers.set("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|googl|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};

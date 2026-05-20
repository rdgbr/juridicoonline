"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Session = { user?: { name?: string | null; email?: string | null } } | null;

/**
 * Client-side auth state for the Header.
 * Bypasses the SSR cache problem: pages with `revalidate` get cached anonymously
 * by Cloudflare/Next, so a server-rendered Header would show "Entrar" even for
 * logged-in users. This component fetches the session client-side and rehydrates.
 */
export function HeaderAuthState() {
  const [session, setSession] = useState<Session>(undefined as unknown as Session);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/session", { credentials: "include", cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setSession(data && Object.keys(data).length ? data : null);
      })
      .catch(() => {
        if (!cancelled) setSession(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Loading state: render invisible placeholder of consistent width to avoid layout shift
  if (session === undefined) {
    return <div className="h-9 w-[140px]" aria-hidden />;
  }

  const user = session?.user;

  if (user) {
    const display = (user.name || user.email || "").split(" ")[0].split("@")[0];
    return (
      <>
        <span className="hidden sm:inline text-sm text-slate-600">
          Olá, <span className="font-medium text-slate-900">{display}</span>
        </span>
        <Link
          href="/api/auth/signout"
          className="text-sm text-slate-500 hover:text-slate-900 px-3 py-1.5"
        >
          Sair
        </Link>
      </>
    );
  }

  return (
    <>
      <Link
        href="/login"
        className="text-sm text-slate-700 hover:text-slate-900 px-3 py-1.5"
      >
        Entrar
      </Link>
      <Link
        href="/cadastro"
        className="text-sm btn-primary rounded-lg px-3.5 py-2 font-medium"
      >
        Cadastre-se grátis
      </Link>
    </>
  );
}

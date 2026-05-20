"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  User as UserIcon,
  LogOut,
  Shield,
  CreditCard,
  Mail,
  ChevronDown,
} from "lucide-react";

type Session = {
  user?: { name?: string | null; email?: string | null };
  isAdmin?: boolean;
} | null;

/**
 * Client-side auth UI. Fetches /api/auth/session on mount so it can hydrate
 * correctly on top of pages that are CDN-cached as anonymous. Shows an avatar
 * dropdown for logged-in users with quick links to profile/admin/billing.
 */
export function HeaderAuthState() {
  const [session, setSession] = useState<Session>(undefined as unknown as Session);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Close menu on outside click
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  // Loading state: invisible placeholder of consistent width to avoid layout shift
  if (session === undefined) {
    return <div className="h-9 w-[160px]" aria-hidden />;
  }

  const user = session?.user;
  const isAdmin = !!session?.isAdmin;

  if (!user) {
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

  const display = user.name || (user.email || "").split("@")[0];
  const firstName = display.split(" ")[0];
  const initial = (display.match(/[A-Za-zÀ-ÿ]/)?.[0] || "?").toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-slate-100 transition group"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span
          className="size-8 rounded-full bg-gradient-to-br from-[#0F4C81] to-[#10B981] text-white text-sm font-semibold flex items-center justify-center"
          aria-hidden
        >
          {initial}
        </span>
        <span className="hidden sm:inline text-sm text-slate-700 font-medium max-w-[120px] truncate">
          {firstName}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 group-hover:text-slate-600 transition ${open ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
            <div className="text-sm font-medium text-slate-900 truncate">{display}</div>
            {user.email && user.email !== display && (
              <div className="text-xs text-slate-500 truncate mt-0.5">{user.email}</div>
            )}
          </div>

          <nav className="py-1">
            <MenuLink href="/perfil" icon={<UserIcon className="h-4 w-4" />} label="Meu perfil" />
            <MenuLink href="/planos" icon={<CreditCard className="h-4 w-4" />} label="Planos e créditos" />
            {isAdmin && (
              <MenuLink
                href="/admin"
                icon={<Shield className="h-4 w-4 text-amber-600" />}
                label="Painel admin"
                className="text-amber-700"
              />
            )}
            <MenuLink href="/contato" icon={<Mail className="h-4 w-4" />} label="Contato / suporte" />
          </nav>

          <div className="border-t border-slate-100 py-1">
            <a
              href="/api/auth/signout"
              role="menuitem"
              className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition"
            >
              <LogOut className="h-4 w-4" />
              Sair da conta
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  icon,
  label,
  className = "",
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      className={`flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition ${className}`}
    >
      <span className="text-slate-400">{icon}</span>
      {label}
    </Link>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, Search, MapPin, BookOpen, CreditCard, Code, Info, Mail, Database, BarChart3 } from "lucide-react";

/**
 * Mobile + tablet hamburger menu with full nav, search, and helpful links.
 * Shown on screens where lg: nav is hidden (< 1024px).
 */
export function HeaderMobileNav() {
  const [open, setOpen] = useState(false);

  // Prevent body scroll while open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="lg:hidden p-2 -mr-2 text-slate-700 hover:bg-slate-100 rounded-lg"
        aria-label="Abrir menu"
        aria-expanded={open}
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
          />

          {/* Drawer */}
          <div className="absolute right-0 top-0 bottom-0 w-[88%] max-w-sm bg-white shadow-xl flex flex-col animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between px-5 h-14 border-b border-slate-200">
              <span className="font-semibold text-slate-900">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 -mr-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                aria-label="Fechar menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search inside menu (mobile-friendly) */}
            <form
              action="/buscar"
              method="GET"
              className="px-5 py-4 border-b border-slate-100"
              onSubmit={() => setOpen(false)}
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="search"
                  name="q"
                  placeholder="Buscar CNPJ, empresa, sócio..."
                  required
                  minLength={2}
                  autoFocus
                  className="w-full h-11 pl-9 pr-3 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/30 focus:border-[#0F4C81]"
                />
              </div>
            </form>

            <nav className="flex-1 overflow-y-auto px-3 py-2" onClick={() => setOpen(false)}>
              <Section title="Ferramentas">
                <Item href="/buscar" icon={<Search className="h-4 w-4" />} label="Busca avançada" />
                <Item href="/empresas" icon={<MapPin className="h-4 w-4" />} label="Empresas por estado" />
                <Item href="/dados" icon={<Database className="h-4 w-4" />} label="Datasets abertos (CSV)" />
                <Item href="/api" icon={<Code className="h-4 w-4" />} label="API REST" />
              </Section>

              <Section title="Conteúdo">
                <Item href="/blog" icon={<BookOpen className="h-4 w-4" />} label="Blog" />
                <Item href="/sobre" icon={<Info className="h-4 w-4" />} label="Sobre o projeto" />
              </Section>

              <Section title="Conta">
                <Item href="/planos" icon={<CreditCard className="h-4 w-4" />} label="Planos e preços" />
                <Item href="/perfil" icon={<BarChart3 className="h-4 w-4" />} label="Meu painel" />
                <Item href="/contato" icon={<Mail className="h-4 w-4" />} label="Contato / suporte" />
              </Section>
            </nav>

            <div className="px-5 py-3 border-t border-slate-100 text-[11px] text-slate-400 text-center">
              Jurídico Online · Dados Receita Federal
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 px-3 py-2">
        {title}
      </h3>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function Item({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-100 transition"
    >
      <span className="text-slate-400">{icon}</span>
      {label}
    </Link>
  );
}

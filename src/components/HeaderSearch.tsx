"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Search } from "lucide-react";

/**
 * Compact search box in the Header — always available so users can re-query
 * from any page. Hides on /buscar itself (page already has its own big search).
 */
export function HeaderSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Cmd/Ctrl+K to focus
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Don't render on the dedicated search page
  if (pathname === "/buscar") return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    if (term.length < 2) return;
    router.push(`/buscar?q=${encodeURIComponent(term)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex-1 max-w-md hidden md:block" role="search">
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-[#0F4C81] transition" />
        <input
          ref={inputRef}
          type="search"
          name="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar CNPJ, empresa ou sócio..."
          aria-label="Buscar empresa, CNPJ ou sócio"
          className="w-full h-9 pl-9 pr-14 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white focus:bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/30 focus:border-[#0F4C81] transition"
        />
        <kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center gap-0.5 text-[10px] text-slate-400 font-mono px-1.5 py-0.5 rounded border border-slate-200 bg-white">
          ⌘K
        </kbd>
      </div>
    </form>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { Search } from "lucide-react";

type Props = {
  size?: "sm" | "lg";
  placeholder?: string;
  defaultValue?: string;
  className?: string;
};

export function SearchBox({ size = "lg", placeholder, defaultValue = "", className = "" }: Props) {
  const router = useRouter();
  const [q, setQ] = useState(defaultValue);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const v = q.trim();
    if (!v) return;

    // If looks like CNPJ → go straight to detail
    const digits = v.replace(/\D/g, "");
    if (digits.length === 14) {
      router.push(`/empresa/${digits}`);
      return;
    }

    router.push(`/buscar?q=${encodeURIComponent(v)}`);
  }

  const isLg = size === "lg";

  return (
    <form
      onSubmit={onSubmit}
      className={`relative flex items-center w-full ${className}`}
      role="search"
    >
      <Search
        className={`absolute left-4 text-slate-400 pointer-events-none ${isLg ? "h-5 w-5" : "h-4 w-4"}`}
      />
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder || "Buscar por CNPJ, nome da empresa, sócio, telefone…"}
        className={`
          w-full rounded-xl border border-slate-200 bg-white
          ${isLg ? "h-14 pl-12 pr-32 text-base" : "h-11 pl-10 pr-24 text-sm"}
          shadow-sm
          focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/30 focus:border-[#0F4C81]
          transition
        `}
        aria-label="Buscar empresa"
      />
      <button
        type="submit"
        className={`
          absolute right-2 btn-primary rounded-lg font-medium
          ${isLg ? "h-10 px-5 text-sm" : "h-8 px-3 text-xs"}
        `}
      >
        Buscar
      </button>
    </form>
  );
}

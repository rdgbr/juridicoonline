"use client";
import { useState } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";

type Props = {
  cnpj: string;
  razaoSocial: string;
  situacao: string;
  initialWatching: boolean;
  isAuth: boolean;
  canonicalSlug: string;
};

export function WatchButton({ cnpj, razaoSocial, situacao, initialWatching, isAuth, canonicalSlug }: Props) {
  const [watching, setWatching] = useState(initialWatching);
  const [loading, setLoading] = useState(false);
  const [tooltip, setTooltip] = useState(false);

  async function toggle() {
    if (!isAuth) {
      window.location.href = `/cadastro?next=/empresa/${canonicalSlug}`;
      return;
    }
    setLoading(true);
    try {
      const method = watching ? "DELETE" : "POST";
      const res = await fetch("/api/watch", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cnpj, razaoSocial, situacao }),
      });
      if (res.ok) {
        setWatching(!watching);
        setTooltip(true);
        setTimeout(() => setTooltip(false), 2500);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={toggle}
        disabled={loading}
        title={watching ? "Parar de monitorar" : "Receber alertas de mudança de situação"}
        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 h-9 text-sm transition ${
          watching
            ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
            : "border-slate-200 bg-white text-slate-600 hover:border-[#0F4C81] hover:bg-[#0F4C81]/5"
        }`}
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : watching ? (
          <BellOff className="h-3.5 w-3.5" />
        ) : (
          <Bell className="h-3.5 w-3.5" />
        )}
        {watching ? "Monitorando" : "Monitorar"}
      </button>

      {tooltip && (
        <div className="absolute right-0 top-full mt-1.5 w-64 rounded-xl border border-slate-200 bg-white shadow-lg z-20 p-3">
          <p className="text-xs text-slate-700">
            {watching
              ? "Você receberá um email se a situação, sócios ou endereço mudarem."
              : "Alerta removido."}
          </p>
        </div>
      )}
    </div>
  );
}

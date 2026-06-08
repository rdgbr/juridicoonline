"use client";
import { useState } from "react";
import { Share2, Copy, Check, MessageCircle } from "lucide-react";

type Props = {
  url: string;
  razao: string;
  cnpj: string;
  situacao: string;
};

export function ShareButton({ url, razao, cnpj, situacao }: Props) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const emoji = situacao === "ATIVA" ? "✅" : "⚠️";
  const text = `Consultei ${razao} (CNPJ ${cnpj}) no Jurídico Online:\n${emoji} Situação: ${situacao}\n\n${url}`;

  async function handleShare() {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title: razao, text, url });
        return;
      } catch {
        // user cancelled or not supported
      }
    }
    setOpen((v) => !v);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    setOpen(false);
  }

  const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:border-[#0F4C81] hover:bg-[#0F4C81]/5 px-3 h-9 text-sm text-slate-600 transition"
      >
        <Share2 className="h-3.5 w-3.5" />
        Compartilhar
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1.5 w-56 rounded-xl border border-slate-200 bg-white shadow-lg z-20 overflow-hidden">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-3 text-sm text-slate-700 hover:bg-green-50 hover:text-green-700 transition"
            >
              <MessageCircle className="h-4 w-4 text-green-500" />
              Enviar pelo WhatsApp
            </a>
            <button
              onClick={copyLink}
              className="flex w-full items-center gap-2.5 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition border-t border-slate-100"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? "Link copiado!" : "Copiar link"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

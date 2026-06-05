"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

const ESPECIALIDADES = [
  "Contabilidade",
  "Advocacia",
  "Banco / Financeiro",
  "Certificado Digital",
  "Outro",
] as const;

export function ParceirosForm() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    especialidade: "",
    estados: "",
    site: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/parceiros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <CheckCircle2 className="h-12 w-12 text-green-500" />
        <h3 className="text-lg font-semibold text-slate-900">Candidatura recebida!</h3>
        <p className="text-slate-500 text-sm">
          Nossa equipe entrará em contato em até 2 dias úteis.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="nome">
          Nome completo *
        </label>
        <input
          id="nome"
          type="text"
          required
          value={form.nome}
          onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
          placeholder="Dr. João Silva"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">
          E-mail profissional *
        </label>
        <input
          id="email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
          placeholder="joao@escritorio.com.br"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="especialidade">
          Especialidade *
        </label>
        <select
          id="especialidade"
          required
          value={form.especialidade}
          onChange={(e) => setForm((f) => ({ ...f, especialidade: e.target.value }))}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81] bg-white"
        >
          <option value="">Selecione...</option>
          {ESPECIALIDADES.map((esp) => (
            <option key={esp} value={esp}>
              {esp}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="estados">
          Estados que atende *
        </label>
        <input
          id="estados"
          type="text"
          required
          value={form.estados}
          onChange={(e) => setForm((f) => ({ ...f, estados: e.target.value }))}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
          placeholder="SP, RJ, MG (ou todo o Brasil)"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="site">
          Site ou LinkedIn (opcional)
        </label>
        <input
          id="site"
          type="url"
          value={form.site}
          onChange={(e) => setForm((f) => ({ ...f, site: e.target.value }))}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]"
          placeholder="https://..."
        />
      </div>

      {status === "error" && (
        <p className="text-red-600 text-sm">
          Ocorreu um erro. Tente novamente ou envie um e-mail para parceiros@juridicoonline.com.br.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-[#0F4C81] text-white font-semibold py-2.5 rounded-lg hover:bg-blue-800 transition-colors disabled:opacity-60"
      >
        {status === "sending" ? "Enviando..." : "Enviar candidatura"}
      </button>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { cadastroAction, type CadastroState } from "./actions";

const initial: CadastroState = {};

export function CadastroForm({ nextPath }: { nextPath?: string }) {
  const [state, formAction] = useActionState(cadastroAction, initial);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={nextPath || ""} />

      {state.error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-2.5 text-sm text-rose-700">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
          E-mail <span className="text-rose-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="seu@email.com"
          className={`w-full rounded-lg border bg-white h-11 px-3.5 text-sm focus:outline-none focus:ring-2 ${
            state.fieldErrors?.email
              ? "border-rose-400 focus:ring-rose-300"
              : "border-slate-300 focus:ring-[#0F4C81]/30 focus:border-[#0F4C81]"
          }`}
        />
        {state.fieldErrors?.email && (
          <p className="mt-1 text-xs text-rose-600">{state.fieldErrors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
          Nome (opcional)
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Seu nome"
          className="w-full rounded-lg border border-slate-300 bg-white h-11 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/30 focus:border-[#0F4C81]"
        />
        {state.fieldErrors?.name && (
          <p className="mt-1 text-xs text-rose-600">{state.fieldErrors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="purpose" className="block text-sm font-medium text-slate-700 mb-1.5">
          Para que vai usar?
        </label>
        <select
          id="purpose"
          name="purpose"
          className="w-full rounded-lg border border-slate-300 bg-white h-11 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/30 focus:border-[#0F4C81]"
          defaultValue=""
        >
          <option value="">Selecione (opcional)</option>
          <option value="vendas">Prospecção de vendas</option>
          <option value="contabil">Contabilidade</option>
          <option value="cobranca">Cobrança</option>
          <option value="rh">Recrutamento</option>
          <option value="credito">Análise de crédito</option>
          <option value="juridico">Jurídico / Due diligence</option>
          <option value="jornalismo">Jornalismo / Pesquisa</option>
          <option value="dev">Desenvolvedor / API</option>
          <option value="outro">Outro</option>
        </select>
      </div>

      <label className="flex items-start gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          name="newsletter"
          defaultChecked
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#0F4C81] focus:ring-[#0F4C81]/30"
        />
        <span className="text-xs text-slate-600 leading-relaxed">
          Quero receber a newsletter <strong>Radar Empresarial</strong> (semanal, sem spam).
        </span>
      </label>

      <SubmitButton />

      <p className="text-center text-xs text-slate-500 pt-2">
        Ao se cadastrar você concorda com nossos{" "}
        <a href="/termos" className="text-[#0F4C81] hover:underline">Termos</a> e{" "}
        <a href="/privacidade" className="text-[#0F4C81] hover:underline">Privacidade</a>.
      </p>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full btn-accent rounded-lg h-11 font-medium text-sm inline-flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? (
        <>
          <span className="size-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Enviando link...
        </>
      ) : (
        "Cadastrar e receber link de acesso"
      )}
    </button>
  );
}

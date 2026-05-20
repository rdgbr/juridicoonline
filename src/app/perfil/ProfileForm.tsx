"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateProfileAction, type ProfileState } from "./actions";

const initial: ProfileState = {};

type User = {
  name: string | null;
  email: string;
  purpose: string | null;
  newsletterOptIn: boolean;
};

export function ProfileForm({ user }: { user: User }) {
  const [state, formAction] = useActionState(updateProfileAction, initial);

  return (
    <form action={formAction} className="space-y-4">
      {state.success && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-sm text-emerald-700">
          {state.success}
        </div>
      )}
      {state.error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-2.5 text-sm text-rose-700">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
          E-mail (não pode ser alterado)
        </label>
        <input
          id="email"
          type="email"
          value={user.email}
          disabled
          className="w-full rounded-lg border border-slate-200 bg-slate-50 h-11 px-3.5 text-sm text-slate-500 cursor-not-allowed"
        />
        <p className="mt-1 text-xs text-slate-400">
          Para trocar de e-mail, exclua a conta e crie outra.
        </p>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
          Nome
        </label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={user.name || ""}
          placeholder="Como prefere ser chamado?"
          minLength={2}
          maxLength={80}
          className="w-full rounded-lg border border-slate-300 bg-white h-11 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/30 focus:border-[#0F4C81]"
        />
      </div>

      <div>
        <label htmlFor="purpose" className="block text-sm font-medium text-slate-700 mb-1.5">
          Para que você usa?
        </label>
        <select
          id="purpose"
          name="purpose"
          defaultValue={user.purpose || ""}
          className="w-full rounded-lg border border-slate-300 bg-white h-11 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/30 focus:border-[#0F4C81]"
        >
          <option value="">Não informado</option>
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
          defaultChecked={user.newsletterOptIn}
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#0F4C81] focus:ring-[#0F4C81]/30"
        />
        <span className="text-sm text-slate-600 leading-relaxed">
          Receber a newsletter <strong>Radar Empresarial</strong> (semanal, sem spam).
        </span>
      </label>

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-primary rounded-lg h-11 px-6 font-medium text-sm inline-flex items-center justify-center disabled:opacity-60"
    >
      {pending ? "Salvando..." : "Salvar alterações"}
    </button>
  );
}

"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { contatoAction, type ContatoState } from "./actions";
import { Send, CheckCircle2 } from "lucide-react";

const initial: ContatoState = {};

export function ContatoForm({ userEmail, userName }: { userEmail?: string; userName?: string }) {
  const [state, formAction] = useActionState(contatoAction, initial);

  if (state.success) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto mb-3" />
        <h2 className="text-lg font-semibold text-emerald-900">Mensagem enviada</h2>
        <p className="mt-2 text-sm text-emerald-800">{state.success}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-2.5 text-sm text-rose-700">
          {state.error}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
            Seu nome <span className="text-rose-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            defaultValue={userName || ""}
            autoComplete="name"
            minLength={2}
            maxLength={80}
            className={`w-full rounded-lg border bg-white h-11 px-3.5 text-sm focus:outline-none focus:ring-2 ${
              state.fieldErrors?.name
                ? "border-rose-400 focus:ring-rose-300"
                : "border-slate-300 focus:ring-[#0F4C81]/30 focus:border-[#0F4C81]"
            }`}
          />
          {state.fieldErrors?.name && (
            <p className="mt-1 text-xs text-rose-600">{state.fieldErrors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
            E-mail <span className="text-rose-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={userEmail || ""}
            autoComplete="email"
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
      </div>

      <div>
        <label htmlFor="dept" className="block text-sm font-medium text-slate-700 mb-1.5">
          Para qual área? <span className="text-rose-500">*</span>
        </label>
        <select
          id="dept"
          name="dept"
          required
          defaultValue="suporte"
          className="w-full rounded-lg border border-slate-300 bg-white h-11 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/30 focus:border-[#0F4C81]"
        >
          <option value="suporte">Suporte (dúvidas gerais)</option>
          <option value="comercial">Comercial / API / Planos enterprise</option>
          <option value="dpo">Privacidade / LGPD (remoção, opt-out)</option>
          <option value="imprensa">Imprensa (pautas, dados, reportagens)</option>
        </select>
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1.5">
          Assunto <span className="text-slate-400 font-normal">(opcional)</span>
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          maxLength={120}
          placeholder="Em poucas palavras..."
          className="w-full rounded-lg border border-slate-300 bg-white h-11 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/30 focus:border-[#0F4C81]"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1.5">
          Mensagem <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={6}
          placeholder="Descreva sua solicitação..."
          className={`w-full rounded-lg border bg-white px-3.5 py-3 text-sm focus:outline-none focus:ring-2 resize-y ${
            state.fieldErrors?.message
              ? "border-rose-400 focus:ring-rose-300"
              : "border-slate-300 focus:ring-[#0F4C81]/30 focus:border-[#0F4C81]"
          }`}
        />
        {state.fieldErrors?.message && (
          <p className="mt-1 text-xs text-rose-600">{state.fieldErrors.message}</p>
        )}
      </div>

      {/* Honeypot — invisible to humans, bots fill it */}
      <div className="absolute -left-[9999px] -top-[9999px]" aria-hidden>
        <label htmlFor="website">Website (não preencher)</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <SubmitButton />

      <p className="text-xs text-slate-500 text-center pt-2">
        Seus dados serão usados apenas para responder esta solicitação. Veja nossa{" "}
        <a href="/privacidade" className="text-[#0F4C81] hover:underline">
          política de privacidade
        </a>
        .
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
      className="w-full sm:w-auto btn-primary rounded-lg h-11 px-6 font-medium text-sm inline-flex items-center justify-center gap-2 disabled:opacity-60"
    >
      {pending ? (
        <>
          <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Enviando...
        </>
      ) : (
        <>
          <Send className="h-4 w-4" />
          Enviar mensagem
        </>
      )}
    </button>
  );
}

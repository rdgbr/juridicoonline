"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { createApiKeyAction, type ApiKeyState } from "./actions";
import { Copy, Key, CheckCircle2 } from "lucide-react";

const initial: ApiKeyState = {};

export function CreateKeyForm() {
  const [state, formAction] = useActionState(createApiKeyAction, initial);
  const [copied, setCopied] = useState(false);

  function copyKey() {
    if (!state.newKey) return;
    navigator.clipboard.writeText(state.newKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-2.5 text-sm text-rose-700">
          {state.error}
        </div>
      )}
      {state.newKey && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4">
          <div className="flex items-center gap-2 text-emerald-900 font-semibold text-sm mb-2">
            <CheckCircle2 className="h-4 w-4" />
            Chave criada — copie agora
          </div>
          <p className="text-xs text-emerald-800 mb-3">
            Esta é a única vez que mostraremos a chave completa. Copie e guarde em local seguro.
          </p>
          <div className="flex items-center gap-2 bg-white rounded-lg border border-emerald-300 p-2">
            <code className="flex-1 font-mono text-xs text-slate-900 break-all">
              {state.newKey}
            </code>
            <button
              type="button"
              onClick={copyKey}
              className="shrink-0 inline-flex items-center gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded transition"
            >
              <Copy className="h-3.5 w-3.5" />
              {copied ? "Copiado!" : "Copiar"}
            </button>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
          Nome da chave
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          minLength={2}
          maxLength={60}
          placeholder="Ex: Produção CRM, Teste local..."
          className="w-full rounded-lg border border-slate-300 bg-white h-11 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C81]/30 focus:border-[#0F4C81]"
        />
      </div>
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
      className="btn-primary rounded-lg h-10 px-4 font-medium text-sm inline-flex items-center gap-2 disabled:opacity-60"
    >
      <Key className="h-4 w-4" />
      {pending ? "Gerando..." : "Gerar nova chave"}
    </button>
  );
}

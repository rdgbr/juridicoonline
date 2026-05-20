"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { deleteAccountAction, type ProfileState } from "./actions";
import { AlertTriangle, Trash2 } from "lucide-react";

const initial: ProfileState = {};

export function DeleteAccountSection({ email }: { email: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(deleteAccountAction, initial);

  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-6">
      <h2 className="text-base font-semibold text-rose-900 flex items-center gap-2">
        <AlertTriangle className="h-4 w-4" /> Zona de perigo
      </h2>
      <p className="mt-2 text-sm text-rose-800/80">
        Exclusão permanente da sua conta, sessões e histórico de consultas. Esta ação
        não pode ser desfeita. Seus dados de identificação (e-mail) podem ser mantidos
        em backup pelo prazo legal (LGPD art. 16).
      </p>

      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 inline-flex items-center gap-2 rounded-lg border border-rose-300 bg-white hover:bg-rose-100 text-rose-700 text-sm font-medium h-10 px-4 transition"
        >
          <Trash2 className="h-4 w-4" />
          Excluir minha conta
        </button>
      ) : (
        <form action={formAction} className="mt-4 space-y-3 border-t border-rose-200 pt-4">
          {state.error && (
            <div className="rounded-lg bg-rose-100 border border-rose-300 px-3 py-2 text-sm text-rose-800">
              {state.error}
            </div>
          )}
          <p className="text-sm text-rose-800">
            Para confirmar, digite seu e-mail <strong className="font-mono">{email}</strong> abaixo:
          </p>
          <input
            type="text"
            name="confirm"
            required
            placeholder={email}
            autoComplete="off"
            className="w-full rounded-lg border border-rose-300 bg-white h-11 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
          <div className="flex items-center gap-2">
            <ConfirmButton />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-sm text-slate-600 hover:text-slate-900 h-10 px-4"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function ConfirmButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-sm font-medium h-10 px-4 transition disabled:opacity-60"
    >
      <Trash2 className="h-4 w-4" />
      {pending ? "Excluindo..." : "Confirmar exclusão permanente"}
    </button>
  );
}

"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { revokeApiKeyAction, type ApiKeyState } from "./actions";
import { Trash2 } from "lucide-react";

const initial: ApiKeyState = {};

export function RevokeButton({ keyId }: { keyId: string }) {
  const [, formAction] = useActionState(revokeApiKeyAction, initial);
  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!confirm("Revogar esta chave permanentemente? Aplicações usando ela vão parar.")) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="keyId" value={keyId} />
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
      className="text-xs text-rose-600 hover:text-rose-800 inline-flex items-center gap-1 disabled:opacity-50"
    >
      <Trash2 className="h-3 w-3" />
      {pending ? "Revogando..." : "Revogar"}
    </button>
  );
}

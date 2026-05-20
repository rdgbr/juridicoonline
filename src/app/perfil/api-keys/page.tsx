import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { CreateKeyForm } from "./CreateKeyForm";
import { RevokeButton } from "./RevokeButton";
import { Key, ArrowLeft, BookOpen, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Chaves de API",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ApiKeysPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/login?next=/perfil/api-keys");

  const [user, keys] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { plan: true },
    }),
    prisma.apiKey.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const planLimits: Record<string, { keys: number; quota: number; rl: number }> = {
    free: { keys: 1, quota: 100, rl: 10 },
    pro: { keys: 3, quota: 1000, rl: 60 },
    business: { keys: 10, quota: 50000, rl: 300 },
    enterprise: { keys: 50, quota: 1000000, rl: 1000 },
  };
  const limits = planLimits[user?.plan || "free"] || planLimits.free;
  const activeCount = keys.filter((k) => k.active).length;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <Link
        href="/perfil"
        className="text-sm text-[#0F4C81] hover:underline inline-flex items-center gap-1 mb-4"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Voltar ao perfil
      </Link>

      <header className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Key className="h-5 w-5 text-[#0F4C81]" />
          <h1 className="text-3xl font-semibold tracking-tight">Chaves de API</h1>
        </div>
        <p className="text-sm text-slate-500">
          Use chaves de API para consultar empresas programaticamente via{" "}
          <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">/api/v1/empresa/[cnpj]</code>.
        </p>
      </header>

      {/* Plan info */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
        <div>
          <div className="text-xs text-slate-500">Plano atual</div>
          <div className="font-semibold capitalize text-slate-900">{user?.plan || "free"}</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Chaves ativas</div>
          <div className="font-semibold text-slate-900">
            {activeCount} / {limits.keys}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Cota por chave</div>
          <div className="font-semibold text-slate-900">{limits.quota.toLocaleString("pt-BR")}/mês</div>
        </div>
        <div>
          <div className="text-xs text-slate-500">Rate limit</div>
          <div className="font-semibold text-slate-900">{limits.rl} req/min</div>
        </div>
      </div>

      {/* Create new */}
      {activeCount < limits.keys ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 mb-8">
          <h2 className="text-lg font-semibold mb-1">Criar nova chave</h2>
          <p className="text-xs text-slate-500 mb-4">
            A chave completa será exibida apenas uma vez. Guarde em local seguro.
          </p>
          <CreateKeyForm />
        </section>
      ) : (
        <section className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6 mb-8 text-sm text-amber-900">
          <strong>Limite atingido.</strong> Revogue uma chave abaixo ou{" "}
          <Link href="/planos" className="text-amber-900 underline font-medium">
            faça upgrade
          </Link>{" "}
          para criar mais.
        </section>
      )}

      {/* Existing keys */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold mb-4">Suas chaves</h2>
        {keys.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-6">
            Você ainda não criou nenhuma chave.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {keys.map((k) => (
              <div key={k.id} className="py-3 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900 truncate">
                      {k.name}
                    </span>
                    {!k.active && (
                      <span className="text-[10px] uppercase font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                        revogada
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 font-mono">
                    {k.keyPrefix}…
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Usadas {k.monthlyUsed.toLocaleString("pt-BR")} / {k.monthlyQuota.toLocaleString("pt-BR")} este mês ·
                    Criada {new Date(k.createdAt).toLocaleDateString("pt-BR")}
                    {k.lastUsedAt && ` · Última uso ${new Date(k.lastUsedAt).toLocaleDateString("pt-BR")}`}
                  </div>
                </div>
                {k.active && <RevokeButton keyId={k.id} />}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Quick start */}
      <section className="rounded-2xl border border-slate-200 bg-slate-50/30 p-6 mt-8">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-[#0F4C81]" /> Quick start
        </h2>
        <p className="text-sm text-slate-600 mb-3">Faça sua primeira requisição:</p>
        <pre className="bg-slate-900 text-slate-100 rounded-lg p-4 text-xs overflow-x-auto"><code>{`curl -H "Authorization: Bearer SUA_CHAVE" \\
     https://juridicoonline.com.br/api/v1/empresa/00000000000191`}</code></pre>
        <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5">
          <Lock className="h-3 w-3" />
          Nunca exponha sua chave no frontend / código público.
        </p>
      </section>
    </div>
  );
}

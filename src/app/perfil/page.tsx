import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { ProfileForm } from "./ProfileForm";
import { DeleteAccountSection } from "./DeleteAccountSection";
import { formatCNPJ, razaoSocialDisplay, empresaSlug } from "@/lib/cnpj";
import { getEmpresasByCNPJs } from "@/lib/meili";
import { Eye, Download, Calendar, Sparkles, Mail, Bell } from "lucide-react";

export const metadata: Metadata = {
  title: "Meu perfil",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  const session = await auth();
  const sessionUser = session?.user;
  const userId = (sessionUser as { id?: string } | undefined)?.id;

  if (!userId || !sessionUser?.email) {
    redirect("/login?next=/perfil");
  }

  const [user, consultationsCount, recentConsultations, dailyActivity, watches] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.consultation.count({ where: { userId } }),
    prisma.consultation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    // Last 30 days activity for chart
    prisma.$queryRaw<Array<{ day: Date; count: bigint }>>`
      SELECT DATE("createdAt") AS day, COUNT(*) AS count
      FROM "Consultation"
      WHERE "userId" = ${userId} AND "createdAt" >= NOW() - INTERVAL '30 days'
      GROUP BY day ORDER BY day ASC
    `,
    prisma.companyWatch.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  if (!user) redirect("/login?next=/perfil");

  // Enrich recent consultations with company names from MeiliSearch
  const cnpjsToLookup = recentConsultations.map(c => c.cnpj);
  const empresasMap = await getEmpresasByCNPJs(cnpjsToLookup);

  // Build last 30 days map for the chart (fill gaps with 0)
  const activityMap = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    activityMap.set(d.toISOString().slice(0, 10), 0);
  }
  for (const row of dailyActivity) {
    const key = row.day.toISOString().slice(0, 10);
    activityMap.set(key, Number(row.count));
  }
  const activity = Array.from(activityMap, ([day, count]) => ({ day, count }));
  const maxCount = Math.max(1, ...activity.map((a) => a.count));
  const last7Total = activity.slice(-7).reduce((s, a) => s + a.count, 0);

  const memberSince = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(user.createdAt);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Meu perfil</h1>
        <p className="mt-2 text-sm text-slate-500">
          Gerencie seus dados, histórico e preferências.
        </p>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <Stat
          icon={<Sparkles className="h-4 w-4" />}
          label="Plano atual"
          value={user.plan === "free" ? "Grátis" : user.plan.toUpperCase()}
        />
        <Stat
          icon={<Eye className="h-4 w-4" />}
          label="Consultas feitas"
          value={consultationsCount.toLocaleString("pt-BR")}
        />
        <Stat
          icon={<Calendar className="h-4 w-4" />}
          label="Membro desde"
          value={memberSince}
        />
        <Stat
          icon={<Mail className="h-4 w-4" />}
          label="Newsletter"
          value={user.newsletterOptIn ? "Inscrito" : "Não inscrito"}
        />
      </section>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Edit profile */}
        <section className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Dados da conta</h2>
          <ProfileForm
            user={{
              name: user.name,
              email: user.email,
              purpose: user.purpose,
              newsletterOptIn: user.newsletterOptIn,
            }}
          />
        </section>

        {/* LGPD actions */}
        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-semibold mb-3">Direitos LGPD</h2>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Você tem direito a portar e excluir seus dados a qualquer momento (Lei
              13.709/2018, arts. 18-22).
            </p>
            <a
              href="/perfil/export"
              className="inline-flex items-center gap-2 w-full justify-center rounded-lg border border-slate-200 bg-white hover:border-[#0F4C81] hover:bg-[#0F4C81]/5 h-10 px-4 text-sm font-medium text-slate-700 transition"
            >
              <Download className="h-4 w-4" />
              Exportar meus dados (JSON)
            </a>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-semibold mb-2">API REST</h2>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              Gere chaves de API para consultar empresas programaticamente.
            </p>
            <Link
              href="/perfil/api-keys"
              className="inline-flex items-center gap-2 w-full justify-center rounded-lg border border-slate-200 bg-white hover:border-[#0F4C81] hover:bg-[#0F4C81]/5 h-10 px-4 text-sm font-medium text-slate-700 transition"
            >
              Gerenciar chaves
            </Link>
          </section>
        </aside>
      </div>

      {/* Activity chart — last 30 days */}
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Sua atividade (30 dias)</h2>
          <span className="text-xs text-slate-500">
            {last7Total > 0 ? (
              <>últimos 7 dias: <strong className="text-[#0F4C81]">{last7Total}</strong></>
            ) : (
              "sem atividade recente"
            )}
          </span>
        </div>
        <div className="flex items-end gap-1 h-24 relative">
          {activity.map((d) => {
            const h = d.count === 0 ? 4 : Math.max(8, Math.round((d.count / maxCount) * 96));
            const date = new Date(d.day + "T00:00:00");
            const isToday = d.day === new Date().toISOString().slice(0, 10);
            return (
              <div
                key={d.day}
                className={`flex-1 rounded-sm relative group transition ${
                  d.count > 0
                    ? "bg-[#0F4C81] hover:bg-[#10B981]"
                    : "bg-slate-100"
                } ${isToday ? "ring-2 ring-emerald-400" : ""}`}
                style={{ height: `${h}px` }}
              >
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[10px] text-slate-700 bg-white border border-slate-200 opacity-0 group-hover:opacity-100 whitespace-nowrap z-10">
                  {d.count} em {date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-slate-400">
          <span>30 dias atrás</span>
          <span>hoje</span>
        </div>
      </section>

      {/* Suggestions */}
      {consultationsCount > 0 && (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50/40 to-white p-6">
          <h2 className="text-lg font-semibold mb-3">Sugestões para você</h2>
          <p className="text-sm text-slate-600 mb-4">
            Com base no seu uso, você pode gostar de:
          </p>
          <div className="grid sm:grid-cols-3 gap-2">
            <Link
              href="/maiores-empresas/sp"
              className="rounded-xl border border-slate-200 bg-white p-3 hover:border-[#0F4C81] transition group"
            >
              <div className="text-sm font-medium text-slate-900 group-hover:text-[#0F4C81]">
                Top empresas SP
              </div>
              <div className="text-xs text-slate-500 mt-0.5">por capital social</div>
            </Link>
            <Link
              href="/comparar"
              className="rounded-xl border border-slate-200 bg-white p-3 hover:border-[#0F4C81] transition group"
            >
              <div className="text-sm font-medium text-slate-900 group-hover:text-[#0F4C81]">
                Comparar empresas
              </div>
              <div className="text-xs text-slate-500 mt-0.5">2 CNPJs lado a lado</div>
            </Link>
            <Link
              href="/planos"
              className="rounded-xl border border-[#0F4C81]/30 bg-[#0F4C81]/[0.03] p-3 hover:bg-[#0F4C81]/[0.06] transition group"
            >
              <div className="text-sm font-medium text-[#0F4C81]">
                Assinar Pro
              </div>
              <div className="text-xs text-slate-500 mt-0.5">consultas ilimitadas + API</div>
            </Link>
          </div>
        </section>
      )}

      {/* Empresas monitoradas */}
      {watches.length > 0 && (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Bell className="h-5 w-5 text-amber-500" />
              Monitorando
            </h2>
            <span className="text-xs text-slate-400">{watches.length} empresa{watches.length > 1 ? "s" : ""}</span>
          </div>
          <div className="divide-y divide-slate-100 text-sm">
            {watches.map((w) => {
              const emp = empresasMap.get(w.cnpj);
              const razao = emp ? (razaoSocialDisplay(emp.razao_social) || emp.razao_social) : w.razaoSocial || w.cnpj;
              const sit = emp?.situacao || w.situacao;
              const slug = emp ? empresaSlug(w.cnpj, emp.razao_social) : w.cnpj;
              return (
                <Link
                  key={w.id}
                  href={`/empresa/${slug}`}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 -mx-2 px-2 rounded transition group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="rounded-lg bg-amber-50 text-amber-600 p-2 shrink-0">
                      <Bell className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-slate-900 group-hover:text-[#0F4C81] truncate">{razao}</div>
                      <div className="text-xs text-slate-500 font-mono">{formatCNPJ(w.cnpj)}</div>
                    </div>
                  </div>
                  {sit && (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
                      sit === "ATIVA" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                    }`}>
                      {sit}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Recent consultations */}
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Histórico recente</h2>
          {consultationsCount > 10 && (
            <span className="text-xs text-slate-400">
              últimas 10 de {consultationsCount.toLocaleString("pt-BR")}
            </span>
          )}
        </div>
        {recentConsultations.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-8">
            Você ainda não fez nenhuma consulta.{" "}
            <Link href="/buscar" className="text-[#0F4C81] hover:underline">
              Comece agora
            </Link>
            .
          </p>
        ) : (
          <div className="divide-y divide-slate-100 text-sm">
            {recentConsultations.map((c) => {
              const emp = empresasMap.get(c.cnpj);
              const razao = emp ? (razaoSocialDisplay(emp.razao_social) || emp.razao_social) : null;
              const sit = emp?.situacao;
              const slug = emp ? empresaSlug(c.cnpj, emp.razao_social) : c.cnpj;
              return (
                <Link
                  key={c.id}
                  href={`/empresa/${slug}`}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 -mx-2 px-2 rounded transition group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="rounded-lg bg-slate-100 text-slate-600 p-2 shrink-0">
                      <Eye className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0">
                      {razao ? (
                        <>
                          <div className="font-medium text-slate-900 group-hover:text-[#0F4C81] truncate">{razao}</div>
                          <div className="text-xs text-slate-500 font-mono flex items-center gap-2">
                            {formatCNPJ(c.cnpj)}
                            {sit && (
                              <span className={`px-1.5 py-0 rounded ${sit === "ATIVA" ? "text-emerald-600" : "text-rose-500"}`}>
                                {sit}
                              </span>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="font-mono text-slate-900 group-hover:text-[#0F4C81]">
                            {formatCNPJ(c.cnpj)}
                          </div>
                          <div className="text-xs text-slate-500 capitalize">{c.type}</div>
                        </>
                      )}
                    </div>
                  </div>
                  <time className="text-xs text-slate-400 shrink-0">
                    {new Intl.DateTimeFormat("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(c.createdAt)}
                  </time>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* Danger zone */}
      <section className="mt-8">
        <DeleteAccountSection email={user.email} />
      </section>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-[#0F4C81]">{icon}</div>
      <div className="mt-2 text-lg font-semibold text-slate-900 truncate">{value}</div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
    </div>
  );
}

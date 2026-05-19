import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { Users, Eye, TrendingUp, Mail, ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin — Jurídico Online",
  robots: { index: false, follow: false },
};

const ADMIN_EMAILS = (process.env.ADMIN_EMAIL || "rodrigodgbr1@gmail.com")
  .split(",")
  .map((e) => e.trim().toLowerCase());

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  const userEmail = session?.user?.email?.toLowerCase();

  if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
    redirect("/login?next=/admin");
  }

  const [
    totalUsers,
    totalLeads,
    totalConsultations,
    totalSocios,
    leadsToday,
    leadsLast7d,
    recentLeads,
    recentConsultations,
    leadsByPurpose,
    leadsByDay,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.lead.count(),
    prisma.consultation.count(),
    prisma.socio.count(),
    prisma.lead.count({ where: { createdAt: { gte: startOfToday() } } }),
    prisma.lead.count({ where: { createdAt: { gte: daysAgo(7) } } }),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
    prisma.consultation.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { user: { select: { email: true, name: true } } },
    }),
    prisma.lead.groupBy({
      by: ["purpose"],
      _count: true,
      orderBy: { _count: { purpose: "desc" } },
    }),
    prisma.$queryRaw<Array<{ day: Date; count: bigint }>>`
      SELECT DATE("createdAt") AS day, COUNT(*) AS count
      FROM "Lead"
      WHERE "createdAt" >= NOW() - INTERVAL '30 days'
      GROUP BY day ORDER BY day DESC
    `,
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Admin</h1>
          <p className="text-sm text-slate-500 mt-1">
            Painel interno · logado como {userEmail}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-700 px-3 py-1 text-xs font-medium">
          <ShieldAlert className="h-3.5 w-3.5" /> Acesso restrito
        </span>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <Stat icon={<Users />} label="Total de usuários" value={totalUsers} />
        <Stat icon={<Mail />} label="Total de leads" value={totalLeads} accent={leadsToday > 0 ? `+${leadsToday} hoje` : undefined} />
        <Stat icon={<Eye />} label="Consultas (CNPJ views)" value={totalConsultations} />
        <Stat icon={<TrendingUp />} label="Sócios indexados" value={totalSocios} />
      </section>

      {/* Signups por dia */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Cadastros últimos 30 dias ({leadsLast7d} nos últimos 7d)</h2>
        <div className="flex items-end gap-1 h-32">
          {leadsByDay.length === 0 && (
            <p className="text-sm text-slate-500">Sem dados ainda.</p>
          )}
          {leadsByDay.slice().reverse().map((d) => {
            const max = Math.max(1, ...leadsByDay.map((x) => Number(x.count)));
            const h = Math.max(4, Math.round((Number(d.count) / max) * 100));
            return (
              <div
                key={d.day.toISOString()}
                className="flex-1 bg-[#0F4C81] hover:bg-[#10B981] transition rounded-sm relative group"
                style={{ height: `${h}%` }}
              >
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-700 opacity-0 group-hover:opacity-100 whitespace-nowrap bg-white border border-slate-200 rounded px-1.5 py-0.5">
                  {Number(d.count)} em {d.day.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Two columns */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent leads */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold mb-3">Últimos cadastros</h2>
          <div className="divide-y divide-slate-100 text-sm">
            {recentLeads.length === 0 && <p className="text-slate-500">Nenhum lead ainda.</p>}
            {recentLeads.map((l) => (
              <div key={l.id} className="py-2.5 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-medium text-slate-900 truncate">{l.email}</div>
                  <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap gap-x-2">
                    {l.name && <span>{l.name}</span>}
                    {l.purpose && <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">{l.purpose}</span>}
                    <span>{l.source}</span>
                  </div>
                </div>
                <div className="text-xs text-slate-400 shrink-0">
                  {timeAgo(l.createdAt)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent consultations */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold mb-3">Últimas consultas</h2>
          <div className="divide-y divide-slate-100 text-sm">
            {recentConsultations.length === 0 && <p className="text-slate-500">Nenhuma consulta ainda.</p>}
            {recentConsultations.map((c) => (
              <div key={c.id} className="py-2.5 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-mono text-slate-900">{c.cnpj}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {c.user?.email || "anonymous"} · {c.type}
                  </div>
                </div>
                <div className="text-xs text-slate-400 shrink-0">{timeAgo(c.createdAt)}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Leads by purpose */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 mt-6">
        <h2 className="text-lg font-semibold mb-3">Cadastros por finalidade</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
          {leadsByPurpose.map((p) => (
            <div key={p.purpose || "none"} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
              <span className="text-slate-700 truncate">{p.purpose || <em className="text-slate-400">— sem informação —</em>}</span>
              <span className="font-semibold text-[#0F4C81]">{p._count}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: number | bigint; accent?: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-[#0F4C81]">{icon}</div>
      <div className="mt-2 text-2xl font-semibold text-slate-900">{Number(value).toLocaleString("pt-BR")}</div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
      {accent && <div className="text-[11px] text-[#10B981] font-medium mt-1">{accent}</div>}
    </div>
  );
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s atrás`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}min atrás`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h atrás`;
  const days = Math.floor(hours / 24);
  return `${days}d atrás`;
}

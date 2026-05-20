import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { ProfileForm } from "./ProfileForm";
import { DeleteAccountSection } from "./DeleteAccountSection";
import { formatCNPJ } from "@/lib/cnpj";
import { Eye, Download, Calendar, Sparkles, Mail } from "lucide-react";

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

  const [user, consultationsCount, recentConsultations] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.consultation.count({ where: { userId } }),
    prisma.consultation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  if (!user) redirect("/login?next=/perfil");

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
        </aside>
      </div>

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
            {recentConsultations.map((c) => (
              <Link
                key={c.id}
                href={`/empresa/${c.cnpj}`}
                className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 -mx-2 px-2 rounded transition group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="rounded-lg bg-slate-100 text-slate-600 p-2 shrink-0">
                    <Eye className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono text-slate-900 group-hover:text-[#0F4C81]">
                      {formatCNPJ(c.cnpj)}
                    </div>
                    <div className="text-xs text-slate-500 capitalize">{c.type}</div>
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
            ))}
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

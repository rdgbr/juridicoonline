/**
 * partner_followup.ts — roda via cron D+2 após cadastro
 * Envia email de ativação inteligente para usuários com partnerConsent=true
 * que ainda não receberam follow-up.
 *
 * Uso: DATABASE_URL=... npx tsx scripts/partner_followup.ts
 * Cron: 0 9 * * * (09:00 UTC = 06:00 BRT)
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Import dinâmico pra evitar problema com o mailer em contexto Node puro
async function main() {
  const { sendPartnerFollowUp } = await import("../src/lib/mailer.js");

  // Usuários que:
  // - Deram partnerConsent
  // - Verificaram email (emailVerified != null)
  // - Criados entre 2 e 4 dias atrás (janela D+2 a D+4)
  // - Ainda não receberam follow-up (campo futuro: partnerFollowupSentAt — por ora checamos manualmente)
  const cutoffStart = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000); // 4 dias atrás
  const cutoffEnd   = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 dias atrás

  const users = await prisma.user.findMany({
    where: {
      partnerConsent: true,
      emailVerified: { not: null },
      createdAt: { gte: cutoffStart, lte: cutoffEnd },
    },
  });

  console.log(`[partner-followup] ${users.length} usuários para processar`);

  for (const user of users) {
    // Buscar consultações separadamente (evita problema de tipo com include)
    const consultations = await prisma.consultation.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: { cnpj: true },
    });
    const cnpjs = consultations.map((c) => c.cnpj);

    // Detectar contexto das consultas — buscar situação das empresas no Meili seria ideal,
    // mas por simplicidade usamos heurísticas no CNPJ (tamanho = 14 dígitos apenas)
    // Em versão futura: buscar situação no Meili pra cada CNPJ consultado
    const hasMany = cnpjs.length >= 5;

    // Por ora sem dados de situação — enviar follow-up genérico baseado no purpose
    const ctx = {
      email: user.email,
      name: user.name,
      purpose: user.purpose ?? undefined,
      recentCnpjs: cnpjs,
      hasInapta: false, // TODO: buscar no Meili
      hasMei: false,    // TODO: buscar no Meili
    };

    try {
      await sendPartnerFollowUp(ctx);
      console.log(`[partner-followup] ✅ enviado para ${user.email} (purpose=${user.purpose || "—"}, consultas=${cnpjs.length})`);
    } catch (e) {
      console.error(`[partner-followup] ❌ erro para ${user.email}:`, e);
    }

    // Rate limit: 1 email/segundo
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log("[partner-followup] done");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

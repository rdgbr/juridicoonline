/**
 * feedback_email.ts — roda via cron D+3 após cadastro
 * Envia email simples de feedback: "Encontrou o que procurava?"
 * Não tenta adivinhar intenção — deixa o usuário responder.
 *
 * Uso: DATABASE_URL=... npx tsx scripts/partner_followup.ts
 * Cron: 0 9 * * * (09:00 UTC = 06:00 BRT)
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const { sendFeedbackEmail } = await import("../src/lib/mailer.js");

  // Usuários que:
  // - Verificaram email (emailVerified != null)
  // - Cadastraram entre 3 e 5 dias atrás (janela D+3 a D+5)
  // - Têm pelo menos 1 consulta feita (usaram o produto de verdade)
  const cutoffStart = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);
  const cutoffEnd   = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

  const users = await prisma.user.findMany({
    where: {
      emailVerified: { not: null },
      createdAt: { gte: cutoffStart, lte: cutoffEnd },
      newsletterOptIn: true, // só quem não optou out de comunicações
    },
  });

  // Filtrar só quem fez pelo menos 1 consulta (não mandar pra quem nunca usou)
  const usersWithConsultations = await Promise.all(
    users.map(async (u) => {
      const count = await prisma.consultation.count({ where: { userId: u.id } });
      return count > 0 ? u : null;
    })
  );

  const targets = usersWithConsultations.filter(Boolean) as typeof users;
  console.log(`[feedback-email] ${targets.length} usuários para processar (de ${users.length} elegíveis)`);

  for (const user of targets) {
    try {
      await sendFeedbackEmail(user.email, user.name);
      console.log(`[feedback-email] ✅ enviado para ${user.email}`);
    } catch (e) {
      console.error(`[feedback-email] ❌ erro para ${user.email}:`, e);
    }
    // Rate limit: 1 por segundo
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log("[feedback-email] done");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

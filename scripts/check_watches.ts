/**
 * Cron: checa empresas monitoradas e envia alerta se situação mudou.
 * Roda diariamente: npx tsx scripts/check_watches.ts
 *
 * Adicionar ao systemd ou pm2:
 *   0 6 * * * cd /root/CascadeProjects/juridicoonline && npx tsx scripts/check_watches.ts >> /var/log/jol-watches.log 2>&1
 */

import { PrismaClient } from "@prisma/client";
import { Meilisearch } from "meilisearch";

const prisma = new PrismaClient();
const meili = new Meilisearch({
  host: process.env.MEILI_HOST || "http://195.35.40.29:7700",
  apiKey: process.env.MEILI_KEY || "masterKey",
});
const index = meili.index(process.env.MEILI_INDEX || "empresas");

const DOMAIN = process.env.MAILGUN_DOMAIN || "mg.juridicoonline.com.br";
const FROM = `Jurídico Online <noreply@${DOMAIN}>`;
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://juridicoonline.com.br";
const MAILGUN_KEY = process.env.MAILGUN_API_KEY || "";

async function sendAlert(to: string, razao: string, cnpj: string, oldSit: string, newSit: string, slug: string) {
  const emoji = newSit === "ATIVA" ? "✅" : "⚠️";
  const html = `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
      <h2 style="color:#0F4C81;margin:0 0 16px">Alerta de mudança cadastral</h2>
      <p style="color:#374151;margin:0 0 16px">
        A empresa que você monitora alterou sua situação na Receita Federal:
      </p>
      <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:0 0 20px">
        <div style="font-weight:600;font-size:16px;color:#111827;margin-bottom:8px">${razao}</div>
        <div style="font-family:monospace;color:#6b7280;font-size:13px;margin-bottom:12px">${cnpj}</div>
        <div style="display:flex;align-items:center;gap:12px">
          <span style="background:#fee2e2;color:#b91c1c;padding:4px 10px;border-radius:6px;font-size:13px">${oldSit}</span>
          <span style="color:#9ca3af">→</span>
          <span style="background:${newSit === "ATIVA" ? "#d1fae5" : "#fee2e2"};color:${newSit === "ATIVA" ? "#065f46" : "#b91c1c"};padding:4px 10px;border-radius:6px;font-size:13px">${emoji} ${newSit}</span>
        </div>
      </div>
      <a href="${SITE}/empresa/${slug}" style="display:inline-block;background:#0F4C81;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
        Ver ficha completa
      </a>
      <p style="color:#9ca3af;font-size:12px;margin-top:24px">
        Você recebe este alerta porque monitora esta empresa no Jurídico Online.<br>
        Para parar: acesse <a href="${SITE}/perfil" style="color:#0F4C81">/perfil</a> e clique em "Monitorando".
      </p>
    </div>
  `;

  const form = new URLSearchParams();
  form.append("from", FROM);
  form.append("to", to);
  form.append("subject", `${emoji} ${razao} mudou para ${newSit} — Jurídico Online`);
  form.append("html", html);
  form.append("text", `${razao} (${cnpj}) mudou de ${oldSit} para ${newSit}. Ver: ${SITE}/empresa/${slug}`);
  form.append("o:tag", "watch-alert");

  const res = await fetch(`https://api.mailgun.net/v3/${DOMAIN}/messages`, {
    method: "POST",
    headers: { Authorization: `Basic ${Buffer.from(`api:${MAILGUN_KEY}`).toString("base64")}` },
    body: form,
  });
  return res.ok;
}

async function main() {
  console.log(`[check_watches] start ${new Date().toISOString()}`);

  const watches = await prisma.companyWatch.findMany({
    include: { user: { select: { email: true, name: true } } },
  });

  console.log(`[check_watches] ${watches.length} watches to check`);
  let alertsSent = 0;

  for (const w of watches) {
    try {
      const doc = await index.getDocument(w.cnpj);
      const currentSit: string = (doc as { situacao?: string }).situacao || "";
      if (!currentSit || !w.situacao) continue;
      if (currentSit === w.situacao) continue;

      console.log(`[check_watches] change detected: ${w.cnpj} ${w.situacao} → ${currentSit}`);

      const razao = (doc as { razao_social?: string }).razao_social || w.razaoSocial || w.cnpj;
      const slug = `${w.cnpj}-${(razao as string)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 80)}`;

      const sent = await sendAlert(
        w.user.email,
        razao as string,
        w.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5"),
        w.situacao,
        currentSit,
        slug,
      );

      if (sent) {
        await prisma.companyWatch.update({
          where: { id: w.id },
          data: { situacao: currentSit, alertedAt: new Date() },
        });
        alertsSent++;
      }
    } catch (err) {
      console.error(`[check_watches] error for ${w.cnpj}:`, err);
    }
  }

  console.log(`[check_watches] done. ${alertsSent} alerts sent.`);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});

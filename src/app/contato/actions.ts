"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/auth";
import { sendEmail } from "@/lib/mailer";

export type ContatoState = {
  error?: string;
  success?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "message" | "dept", string>>;
};

const DEPT_TO_EMAIL: Record<string, { to: string; label: string }> = {
  suporte: { to: "contato@juridicoonline.com.br", label: "Suporte" },
  comercial: { to: "vendas@juridicoonline.com.br", label: "Comercial / API" },
  dpo: { to: "dpo@juridicoonline.com.br", label: "Privacidade / LGPD" },
  imprensa: { to: "imprensa@juridicoonline.com.br", label: "Imprensa" },
};

const schema = z.object({
  name: z.string().trim().min(2, "Informe seu nome").max(80),
  email: z.email("E-mail inválido").transform((v) => v.toLowerCase()),
  dept: z.enum(["suporte", "comercial", "dpo", "imprensa"]),
  subject: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Mensagem muito curta (mínimo 10 caracteres)").max(5000),
  // Honeypot — must be empty (bots fill it)
  website: z.string().max(0, "spam").optional().or(z.literal("")),
});

// Simple in-memory rate limit (per process; resets on container restart)
const rateLimit = new Map<string, number[]>();
const RL_WINDOW = 60_000; // 1 min
const RL_MAX = 3;

function checkRate(ip: string): boolean {
  const now = Date.now();
  const arr = (rateLimit.get(ip) || []).filter((t) => now - t < RL_WINDOW);
  arr.push(now);
  rateLimit.set(ip, arr);
  return arr.length <= RL_MAX;
}

export async function contatoAction(
  _prev: ContatoState,
  formData: FormData
): Promise<ContatoState> {
  const session = await auth();
  const h = await headers();
  const ip = (h.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";

  if (!checkRate(ip)) {
    return { error: "Muitas tentativas. Aguarde 1 minuto e tente novamente." };
  }

  const raw = {
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    dept: String(formData.get("dept") || "suporte"),
    subject: String(formData.get("subject") || ""),
    message: String(formData.get("message") || ""),
    website: String(formData.get("website") || ""), // honeypot
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    // Honeypot fail → return success to confuse bot
    if (raw.website) return { success: "Mensagem enviada. Responderemos em breve." };

    const fe: ContatoState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as string;
      if (field === "name" || field === "email" || field === "message" || field === "dept") {
        fe[field] = issue.message;
      }
    }
    return {
      error: "Verifique os campos do formulário.",
      fieldErrors: fe,
    };
  }
  const data = parsed.data;

  const dept = DEPT_TO_EMAIL[data.dept] || DEPT_TO_EMAIL.suporte;
  const subject = data.subject || `[${dept.label}] Nova mensagem de ${data.name}`;
  const ua = h.get("user-agent") || "—";

  const userSession = session?.user
    ? `<p style="background:#f0f9ff;border-left:3px solid #0F4C81;padding:8px 12px;font-size:13px;color:#0F4C81;margin:12px 0;">
         <strong>Usuário logado:</strong> ${session.user.email}
       </p>`
    : "";

  const html = `
<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:600px;margin:0 auto;">
  <h2 style="color:#0F4C81;border-bottom:2px solid #e2e8f0;padding-bottom:8px;">
    📬 ${dept.label} — nova mensagem
  </h2>
  ${userSession}
  <table style="width:100%;font-size:14px;border-collapse:collapse;margin:16px 0;">
    <tr><td style="padding:6px 0;color:#64748b;width:120px;">De:</td><td><strong>${escapeHtml(data.name)}</strong> &lt;${escapeHtml(data.email)}&gt;</td></tr>
    <tr><td style="padding:6px 0;color:#64748b;">Para:</td><td>${dept.to}</td></tr>
    <tr><td style="padding:6px 0;color:#64748b;">Assunto:</td><td>${escapeHtml(subject)}</td></tr>
    <tr><td style="padding:6px 0;color:#64748b;">IP:</td><td><code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;">${ip}</code></td></tr>
  </table>
  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin:16px 0;white-space:pre-wrap;font-size:14px;line-height:1.6;color:#0f172a;">${escapeHtml(data.message)}</div>
  <p style="font-size:11px;color:#94a3b8;margin-top:24px;border-top:1px solid #e2e8f0;padding-top:12px;">
    User-Agent: ${escapeHtml(ua)}<br>
    Enviado em ${new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })} via formulário /contato
  </p>
</div>`;

  const text = `${dept.label} — ${data.name} <${data.email}>\n\nAssunto: ${subject}\n\n${data.message}\n\n---\nIP: ${ip}\n${session?.user ? `Logado: ${session.user.email}` : "Anônimo"}`;

  const r = await sendEmail({
    to: dept.to,
    subject,
    html,
    text,
    tags: ["contact-form", `dept-${data.dept}`],
  });

  if (!r.ok) {
    console.error("[contato] mailgun fail", r.error);
    return { error: "Não conseguimos enviar agora. Tente novamente em alguns minutos." };
  }

  return {
    success: `Mensagem enviada para ${dept.label}. Responderemos no e-mail ${data.email} em até 24h úteis.`,
  };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

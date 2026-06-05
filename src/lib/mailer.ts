/**
 * Mailgun HTTP API mailer + email templates.
 * No SMTP needed — uses Mailgun's REST API.
 */

const API_KEY = process.env.MAILGUN_API_KEY || "";
const DOMAIN = process.env.MAILGUN_DOMAIN || "mg.juridicoonline.com.br";
const FROM = process.env.MAILGUN_FROM || `Jurídico Online <noreply@${DOMAIN}>`;
const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://juridicoonline.com.br";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "rodrigodgbr1@gmail.com";
const API_URL = `https://api.mailgun.net/v3/${DOMAIN}/messages`;

type SendOpts = {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  tags?: string[];
  /** Set to false to disable Mailgun click-tracking for this email.
   *  Useful for magic-link emails where the tracking domain may lack SSL
   *  and the token is one-time-use anyway (CTR is always 100%). */
  trackClicks?: boolean;
};

export async function sendEmail({
  to,
  subject,
  html,
  text,
  from = FROM,
  replyTo,
  tags = [],
  trackClicks = true,
}: SendOpts): Promise<{ ok: boolean; id?: string; error?: string }> {
  if (!API_KEY) {
    console.warn("[mailer] MAILGUN_API_KEY not set — skipping send", { to, subject });
    return { ok: false, error: "no_api_key" };
  }
  const body = new URLSearchParams();
  body.set("from", from);
  body.set("to", to);
  body.set("subject", subject);
  body.set("html", html);
  if (text) body.set("text", text);
  if (replyTo) body.set("h:Reply-To", replyTo);
  for (const t of tags) body.append("o:tag", t);
  body.set("o:tracking", "yes");
  body.set("o:tracking-clicks", trackClicks ? "yes" : "no");
  body.set("o:tracking-opens", "yes");

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`api:${API_KEY}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });
    const json = (await res.json()) as { id?: string; message?: string };
    if (!res.ok) {
      console.error("[mailer] error", res.status, json);
      return { ok: false, error: json.message || `HTTP ${res.status}` };
    }
    return { ok: true, id: json.id };
  } catch (e) {
    console.error("[mailer] fetch error", e);
    return { ok: false, error: String(e) };
  }
}

// ─── Email layout ─────────────────────────────────────────────────

function layout(opts: { title: string; preheader?: string; body: string; ctaUrl?: string; ctaLabel?: string; recipientEmail?: string }): string {
  const { title, preheader = "", body, ctaUrl, ctaLabel, recipientEmail } = opts;
  const year = new Date().getFullYear();
  const unsubscribeUrl = recipientEmail
    ? `${SITE}/unsubscribe?email=${encodeURIComponent(recipientEmail)}`
    : `${SITE}/unsubscribe`;
  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#0f172a;line-height:1.5;">
<span style="display:none;font-size:0;line-height:0;color:transparent;opacity:0;">${preheader}</span>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f8fafc;padding:32px 16px;">
  <tr><td align="center">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="max-width:560px;width:100%;">
      <tr><td align="center" style="padding-bottom:24px;">
        <a href="${SITE}" style="text-decoration:none;font-size:20px;font-weight:600;">
          <span style="color:#0F4C81;">Jurídico</span> <span style="color:#10B981;">Online</span>
        </a>
      </td></tr>
      <tr><td style="background:#ffffff;border:1px solid #e2e8f0;border-radius:14px;padding:32px;">
        ${body}
        ${ctaUrl ? `<div style="text-align:center;margin:28px 0 8px;"><a href="${ctaUrl}" style="display:inline-block;background:#0F4C81;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:8px;font-weight:500;font-size:15px;">${ctaLabel || "Acessar"}</a></div>` : ""}
      </td></tr>
      <tr><td style="padding-top:24px;font-size:12px;color:#94a3b8;text-align:center;line-height:1.6;">
        <p style="margin:0 0 4px;">© ${year} Jurídico Online · ${SITE.replace(/^https?:\/\//, "")}</p>
        <p style="margin:0 0 4px;">Consulta gratuita de CNPJ e empresas brasileiras.</p>
        <p style="margin:8px 0 0;">
          <a href="${SITE}/sobre" style="color:#64748b;">Sobre</a>
          &nbsp;·&nbsp;
          <a href="${SITE}/privacidade" style="color:#64748b;">Privacidade</a>
          &nbsp;·&nbsp;
          <a href="${SITE}/termos" style="color:#64748b;">Termos</a>
          &nbsp;·&nbsp;
          <a href="${SITE}/lgpd" style="color:#64748b;">LGPD</a>
          &nbsp;·&nbsp;
          <a href="${unsubscribeUrl}" style="color:#64748b;">Cancelar assinatura</a>
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

// ─── Templates ─────────────────────────────────────────────────

export function magicLinkEmail(url: string, host: string, recipientEmail?: string): { html: string; text: string; subject: string } {
  const subject = "Seu link de acesso ao Jurídico Online";
  const body = `
    <h1 style="margin:0 0 12px;font-size:22px;font-weight:600;color:#0f172a;">Entre na sua conta</h1>
    <p style="margin:0 0 4px;color:#475569;">Clique no botão abaixo para entrar no Jurídico Online.</p>
    <p style="margin:0 0 8px;color:#94a3b8;font-size:13px;">Link válido por 24 horas. Use apenas uma vez.</p>
    <p style="margin:24px 0 4px;color:#94a3b8;font-size:12px;">Se não funcionar, copie e cole no navegador:</p>
    <p style="margin:0;color:#475569;font-size:12px;word-break:break-all;background:#f1f5f9;padding:10px;border-radius:6px;border:1px solid #e2e8f0;">${url}</p>
    <p style="margin:18px 0 0;color:#94a3b8;font-size:12px;">Se não foi você que solicitou, pode ignorar este e-mail.</p>`;
  const html = layout({ title: subject, preheader: "Confirme seu acesso ao Jurídico Online", body, ctaUrl: url, ctaLabel: "Entrar no Jurídico Online", recipientEmail });
  const text = `Entre na sua conta no Jurídico Online (${host}):\n\n${url}\n\nLink válido por 24h. Se não foi você, ignore.`;
  return { html, text, subject };
}

export function welcomeEmail(name?: string | null, recipientEmail?: string): { html: string; text: string; subject: string } {
  const subject = "Bem-vindo(a) ao Jurídico Online 🎉";
  const greet = name ? `Olá, ${name.split(" ")[0]}!` : "Olá!";
  const body = `
    <h1 style="margin:0 0 12px;font-size:22px;font-weight:600;">${greet}</h1>
    <p style="margin:0 0 16px;color:#475569;">Sua conta está pronta. Agora você tem acesso liberado a:</p>
    <ul style="margin:0 0 20px;padding-left:20px;color:#475569;">
      <li>Consulta gratuita de <strong>65 milhões de empresas</strong> brasileiras</li>
      <li>Telefones, e-mails e quadro societário completo</li>
      <li>Filtros avançados por CNAE, estado, cidade, porte</li>
      <li>Newsletter semanal <strong>Radar Empresarial</strong></li>
    </ul>
    <p style="margin:0 0 8px;color:#475569;">Começar é simples: digite um CNPJ ou nome da empresa na busca.</p>`;
  const html = layout({ title: subject, preheader: "Sua conta no Jurídico Online está pronta", body, ctaUrl: `${SITE}/`, ctaLabel: "Buscar empresas agora", recipientEmail });
  const text = `${greet}\n\nSua conta no Jurídico Online está pronta.\n\nAcesse 65 milhões de empresas em ${SITE}/\n\nObrigado por se cadastrar!`;
  return { html, text, subject };
}

export function adminSignupNotification(args: {
  email: string;
  name?: string | null;
  purpose?: string | null;
  ip?: string | null;
  ua?: string | null;
}): { html: string; text: string; subject: string } {
  const subject = `🆕 Novo cadastro JOL: ${args.email}`;
  const body = `
    <h1 style="margin:0 0 12px;font-size:18px;font-weight:600;">Novo cadastro recebido</h1>
    <table cellpadding="6" style="font-size:14px;color:#334155;">
      <tr><td><strong>Email:</strong></td><td>${args.email}</td></tr>
      <tr><td><strong>Nome:</strong></td><td>${args.name || "—"}</td></tr>
      <tr><td><strong>Finalidade:</strong></td><td>${args.purpose || "—"}</td></tr>
      <tr><td><strong>IP:</strong></td><td>${args.ip || "—"}</td></tr>
      <tr><td><strong>User-Agent:</strong></td><td style="font-size:11px;color:#64748b;">${args.ua?.slice(0, 120) || "—"}</td></tr>
      <tr><td><strong>Data:</strong></td><td>${new Date().toLocaleString("pt-BR")}</td></tr>
    </table>`;
  const html = layout({ title: subject, body });
  const text = `Novo cadastro JOL\n\nEmail: ${args.email}\nNome: ${args.name || "-"}\nFinalidade: ${args.purpose || "-"}\nIP: ${args.ip || "-"}\nData: ${new Date().toLocaleString("pt-BR")}`;
  return { html, text, subject };
}

export async function notifyAdminSignup(args: Parameters<typeof adminSignupNotification>[0]): Promise<void> {
  const tpl = adminSignupNotification(args);
  await sendEmail({
    to: ADMIN_EMAIL,
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
    tags: ["admin-signup"],
  });
}

export async function sendWelcomeEmail(email: string, name?: string | null): Promise<void> {
  const tpl = welcomeEmail(name, email);
  await sendEmail({
    to: email,
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
    tags: ["welcome"],
  });
}

// ─── Email de feedback D+3 ─────────────────────────────────────────
// Pergunta honesta: encontrou o que procurava?
// Não tenta adivinhar — deixa o usuário falar.
// Respostas vão para o admin via reply-to e ajudam a entender o produto.

export function feedbackEmail(email: string, name?: string | null): { html: string; text: string; subject: string } {
  const greet = name ? `Olá, ${name.split(" ")[0]}` : "Olá";
  const subject = "Encontrou o que procurava? (1 pergunta rápida)";
  const replyTo = ADMIN_EMAIL;

  const body = `
    <h1 style="margin:0 0 12px;font-size:20px;font-weight:600;color:#0f172a;">${greet} 👋</h1>
    <p style="margin:0 0 16px;color:#475569;">
      Você se cadastrou no <strong>Jurídico Online</strong> há alguns dias. Uma pergunta rápida:
    </p>
    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:18px 20px;margin:0 0 20px;">
      <p style="margin:0 0 10px;font-size:16px;font-weight:600;color:#0f172a;">
        Encontrou o que estava procurando?
      </p>
      <p style="margin:0;font-size:14px;color:#475569;">
        Pode responder este email com qualquer coisa — o que buscou, o que faltou, o que funcionou bem ou não.
        Lemos todas as respostas e usamos para melhorar o serviço.
      </p>
    </div>
    <p style="margin:0 0 8px;color:#475569;font-size:14px;">
      Se quiser, clique em um dos botões abaixo:
    </p>
    <table cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;">
      <tr>
        <td style="padding-right:8px;">
          <a href="mailto:${replyTo}?subject=Feedback JOL: Encontrei&body=Oi, encontrei o que procurava. [conte mais se quiser]"
             style="display:inline-block;background:#10B981;color:#ffffff;text-decoration:none;padding:10px 18px;border-radius:7px;font-size:13px;font-weight:500;">
            ✅ Sim, encontrei
          </a>
        </td>
        <td style="padding-right:8px;">
          <a href="mailto:${replyTo}?subject=Feedback JOL: Não encontrei&body=Oi, não encontrei o que procurava. Estava buscando: [descreva aqui]"
             style="display:inline-block;background:#f1f5f9;color:#334155;text-decoration:none;padding:10px 18px;border-radius:7px;font-size:13px;font-weight:500;border:1px solid #e2e8f0;">
            ❌ Não encontrei
          </a>
        </td>
        <td>
          <a href="mailto:${replyTo}?subject=Feedback JOL: Sugestão&body=Oi, tenho uma sugestão: [escreva aqui]"
             style="display:inline-block;background:#f1f5f9;color:#334155;text-decoration:none;padding:10px 18px;border-radius:7px;font-size:13px;font-weight:500;border:1px solid #e2e8f0;">
            💡 Tenho sugestão
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:0;font-size:12px;color:#94a3b8;">
      Ou simplesmente responda este email — vai chegar direto para a gente.
    </p>`;

  const html = layout({
    title: subject,
    preheader: "Encontrou o que procurava? Responda com uma linha — lemos tudo.",
    body,
    recipientEmail: email,
  });
  const text = `${greet}\n\nVocê se cadastrou no Jurídico Online há alguns dias.\n\nEncontrou o que estava procurando?\n\nResponda este email com qualquer coisa — o que buscou, o que faltou, o que funcionou bem. Lemos tudo e usamos para melhorar.\n\n— Equipe Jurídico Online`;
  return { html, text, subject };
}

export async function sendFeedbackEmail(email: string, name?: string | null): Promise<void> {
  const tpl = feedbackEmail(email, name);
  await sendEmail({
    to: email,
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
    replyTo: ADMIN_EMAIL,
    tags: ["feedback-d3"],
  });
}

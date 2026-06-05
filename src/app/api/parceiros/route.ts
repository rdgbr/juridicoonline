import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/mailer";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "rodrigodgbr1@gmail.com";

type ParceiroCandidatura = {
  nome: string;
  email: string;
  especialidade: string;
  estados: string;
  site?: string;
};

export async function POST(req: NextRequest) {
  let body: Partial<ParceiroCandidatura>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const { nome, email, especialidade, estados, site } = body;

  if (!nome || !email || !especialidade || !estados) {
    return NextResponse.json({ error: "missing_fields" }, { status: 422 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 422 });
  }

  const html = `
    <!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"></head>
    <body style="font-family:sans-serif;color:#0f172a;padding:24px;">
      <h2 style="color:#0F4C81;">Nova candidatura de parceiro — Jurídico Online</h2>
      <table cellpadding="6" style="font-size:14px;color:#334155;border-collapse:collapse;">
        <tr><td><strong>Nome:</strong></td><td>${nome}</td></tr>
        <tr><td><strong>E-mail:</strong></td><td>${email}</td></tr>
        <tr><td><strong>Especialidade:</strong></td><td>${especialidade}</td></tr>
        <tr><td><strong>Estados que atende:</strong></td><td>${estados}</td></tr>
        <tr><td><strong>Site/LinkedIn:</strong></td><td>${site || "—"}</td></tr>
        <tr><td><strong>Data:</strong></td><td>${new Date().toLocaleString("pt-BR")}</td></tr>
      </table>
      <p style="margin-top:16px;font-size:12px;color:#64748b;">
        Enviado pelo formulário de parceiros em juridicoonline.com.br/parceiros
      </p>
    </body></html>
  `;

  const result = await sendEmail({
    to: ADMIN_EMAIL,
    subject: `🤝 Candidatura parceiro JOL: ${especialidade} — ${nome}`,
    html,
    text: `Nova candidatura de parceiro\n\nNome: ${nome}\nE-mail: ${email}\nEspecialidade: ${especialidade}\nEstados: ${estados}\nSite: ${site || "—"}\nData: ${new Date().toLocaleString("pt-BR")}`,
    replyTo: email,
    tags: ["parceiro-candidatura"],
  });

  if (!result.ok) {
    console.error("[api/parceiros] sendEmail error", result.error);
    // Still return 200 to avoid exposing infra issues to the form
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: true });
}

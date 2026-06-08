"use server";

import { headers } from "next/headers";
import { signIn } from "@/auth";
import { prisma } from "@/lib/db";
import { notifyAdminSignup } from "@/lib/mailer";
import { z } from "zod";

const schema = z.object({
  email: z.email().transform((v) => v.toLowerCase()),
  name: z.string().trim().min(2).max(80).optional().nullable(),
  purpose: z.string().max(40).optional().nullable(),
  newsletter: z.boolean().default(true),
  partnerConsent: z.boolean().default(false),
  next: z.string().optional().nullable(),
});

export type CadastroState = {
  error?: string;
  fieldErrors?: { email?: string; name?: string };
  ok?: boolean;
};

export async function cadastroAction(_prev: CadastroState, formData: FormData): Promise<CadastroState> {
  const raw = {
    email: String(formData.get("email") || "").trim().toLowerCase(),
    name: String(formData.get("name") || "").trim() || null,
    purpose: String(formData.get("purpose") || "") || null,
    newsletter: formData.get("newsletter") === "on",
    partnerConsent: formData.get("partnerConsent") === "on",
    next: String(formData.get("next") || "") || null,
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const fe: CadastroState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as string;
      if (field === "email" || field === "name") fe[field] = issue.message;
    }
    return { error: "Verifique os campos preenchidos.", fieldErrors: fe };
  }
  const data = parsed.data;

  const h = await headers();
  const ip = (h.get("x-forwarded-for") || "").split(",")[0].trim() || null;
  const ua = h.get("user-agent") || null;

  try {
    await prisma.lead.create({
      data: {
        email: data.email,
        name: data.name,
        purpose: data.purpose,
        newsletter: data.newsletter,
        partnerConsent: data.partnerConsent,
        ip,
        ua,
        source: "cadastro",
      },
    });
  } catch (e) {
    console.error("[cadastro] lead save error", e);
  }

  try {
    await prisma.user.upsert({
      where: { email: data.email },
      update: {
        name: data.name ?? undefined,
        purpose: data.purpose ?? undefined,
        newsletterOptIn: data.newsletter,
        partnerConsent: data.partnerConsent,
        ...(data.partnerConsent ? { partnerConsentAt: new Date() } : {}),
      },
      create: {
        email: data.email,
        name: data.name,
        purpose: data.purpose,
        newsletterOptIn: data.newsletter,
        partnerConsent: data.partnerConsent,
        ...(data.partnerConsent ? { partnerConsentAt: new Date() } : {}),
      },
    });
  } catch (e) {
    console.error("[cadastro] user upsert error", e);
  }

  notifyAdminSignup({ email: data.email, name: data.name, purpose: data.purpose, ip, ua })
    .catch((e) => console.error("[cadastro] admin notify error", e));

  try {
    await signIn("nodemailer", {
      email: data.email,
      redirectTo: data.next && data.next.startsWith("/") ? data.next : "/",
    });
  } catch (e: unknown) {
    const digest = e && typeof e === "object" && "digest" in e ? (e as { digest: string }).digest : "";
    if (digest.startsWith("NEXT_REDIRECT")) throw e;
    console.error("[cadastro] signIn error:", (e as Error).message);
    return { error: "Erro ao enviar o link de acesso. Tente novamente em alguns minutos." };
  }

  return { ok: true };
}

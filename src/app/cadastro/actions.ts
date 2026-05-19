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
    next: String(formData.get("next") || "") || null,
  };

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const fe: CadastroState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as string;
      if (field === "email" || field === "name") fe[field] = issue.message;
    }
    return {
      error: "Verifique os campos preenchidos.",
      fieldErrors: fe,
    };
  }
  const data = parsed.data;

  // Capture lead immediately (so we never lose it even if user doesn't verify)
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
        ip,
        ua,
        source: "cadastro",
      },
    });
  } catch (e) {
    console.error("[cadastro] lead save error", e);
  }

  // Pre-create user with name/purpose so it persists after magic-link verification
  try {
    await prisma.user.upsert({
      where: { email: data.email },
      update: {
        name: data.name ?? undefined,
        purpose: data.purpose ?? undefined,
        newsletterOptIn: data.newsletter,
      },
      create: {
        email: data.email,
        name: data.name,
        purpose: data.purpose,
        newsletterOptIn: data.newsletter,
      },
    });
  } catch (e) {
    console.error("[cadastro] user upsert error", e);
  }

  // Admin notification (with full context — runs in background)
  notifyAdminSignup({
    email: data.email,
    name: data.name,
    purpose: data.purpose,
    ip,
    ua,
  }).catch((e) => console.error("[cadastro] admin notify error", e));

  // Trigger magic link email (signIn throws NEXT_REDIRECT internally)
  await signIn("nodemailer", {
    email: data.email,
    redirectTo: data.next && data.next.startsWith("/") ? data.next : "/",
  });
  return { ok: true };
}

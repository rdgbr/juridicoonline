"use server";

import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import { z } from "zod";

const schema = z.object({
  email: z.email().transform((v) => v.toLowerCase()),
  next: z.string().optional().nullable(),
});

export async function loginAction(formData: FormData): Promise<void> {
  const parsed = schema.safeParse({
    email: String(formData.get("email") || "").trim().toLowerCase(),
    next: String(formData.get("next") || "") || null,
  });
  if (!parsed.success) redirect("/login?error=invalid");

  await signIn("nodemailer", {
    email: parsed.data.email,
    redirectTo:
      parsed.data.next && parsed.data.next.startsWith("/")
        ? parsed.data.next
        : "/",
  });
}

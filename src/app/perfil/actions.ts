"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

export type ProfileState = {
  error?: string;
  success?: string;
};

const profileSchema = z.object({
  name: z.string().trim().min(2).max(80).optional().or(z.literal("")),
  purpose: z.string().max(40).optional().or(z.literal("")),
  newsletterOptIn: z.boolean().default(false),
});

export async function updateProfileAction(
  _prev: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return { error: "Não autenticado." };

  const parsed = profileSchema.safeParse({
    name: String(formData.get("name") || "").trim() || undefined,
    purpose: String(formData.get("purpose") || "") || undefined,
    newsletterOptIn: formData.get("newsletter") === "on",
  });

  if (!parsed.success) {
    return { error: "Dados inválidos. Verifique os campos." };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: parsed.data.name || null,
        purpose: parsed.data.purpose || null,
        newsletterOptIn: parsed.data.newsletterOptIn,
      },
    });
    revalidatePath("/perfil");
    return { success: "Perfil atualizado com sucesso." };
  } catch (e) {
    console.error("[perfil] update error", e);
    return { error: "Erro ao salvar. Tente novamente." };
  }
}

export async function deleteAccountAction(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const email = session?.user?.email;
  if (!userId || !email) return { error: "Não autenticado." };

  const confirm = String(formData.get("confirm") || "").trim().toLowerCase();
  if (confirm !== email.toLowerCase()) {
    return { error: `Digite seu e-mail (${email}) exatamente para confirmar.` };
  }

  try {
    // Hard delete: cascades to sessions, accounts, consultations, apiKeys via Prisma onDelete: Cascade
    await prisma.user.delete({ where: { id: userId } });
  } catch (e) {
    console.error("[perfil] delete error", e);
    return { error: "Erro ao excluir conta. Contate dpo@juridicoonline.com.br." };
  }

  await signOut({ redirect: false });
  redirect("/?deleted=1");
}

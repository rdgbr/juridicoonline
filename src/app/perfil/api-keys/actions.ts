"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { generateApiKey } from "@/lib/apiAuth";

export type ApiKeyState = {
  error?: string;
  success?: string;
  newKey?: string; // shown only once
};

export async function createApiKeyAction(
  _prev: ApiKeyState,
  formData: FormData
): Promise<ApiKeyState> {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return { error: "Não autenticado." };

  const name = String(formData.get("name") || "").trim().slice(0, 60);
  if (name.length < 2) return { error: "Dê um nome para a chave (ex: 'Produção CRM')." };

  // Check user plan limits
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });
  const planLimits: Record<string, { keys: number; quota: number; rl: number }> = {
    free: { keys: 1, quota: 100, rl: 10 },
    pro: { keys: 3, quota: 1000, rl: 60 },
    business: { keys: 10, quota: 50000, rl: 300 },
    enterprise: { keys: 50, quota: 1000000, rl: 1000 },
  };
  const limits = planLimits[user?.plan || "free"] || planLimits.free;

  const existingCount = await prisma.apiKey.count({
    where: { userId, active: true },
  });
  if (existingCount >= limits.keys) {
    return {
      error: `Você atingiu o limite de ${limits.keys} chave(s) ativas no plano atual. Faça upgrade ou revogue uma existente.`,
    };
  }

  const { full, prefix, hash } = generateApiKey();
  try {
    await prisma.apiKey.create({
      data: {
        userId,
        name,
        keyPrefix: prefix,
        keyHash: hash,
        rateLimit: limits.rl,
        monthlyQuota: limits.quota,
      },
    });
    revalidatePath("/perfil/api-keys");
    return {
      success: "Chave criada com sucesso. Copie agora — não conseguirá ver novamente.",
      newKey: full,
    };
  } catch (e) {
    console.error("[api-keys] create error", e);
    return { error: "Erro ao criar chave. Tente novamente." };
  }
}

export async function revokeApiKeyAction(
  _prev: ApiKeyState,
  formData: FormData
): Promise<ApiKeyState> {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return { error: "Não autenticado." };

  const keyId = String(formData.get("keyId") || "");
  if (!keyId) return { error: "ID inválido." };

  try {
    await prisma.apiKey.updateMany({
      where: { id: keyId, userId },
      data: { active: false },
    });
    revalidatePath("/perfil/api-keys");
    return { success: "Chave revogada." };
  } catch (e) {
    console.error("[api-keys] revoke error", e);
    return { error: "Erro ao revogar." };
  }
}

/**
 * API key generation + verification + rate limiting for /api/v1/* endpoints.
 *
 * Key format: jol_<env>_<24 random base32 chars>
 * Stored: keyPrefix (first 12 chars) for lookup + keyHash (SHA-256 of full key)
 */
import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@/lib/db";

const ENV = process.env.NODE_ENV === "production" ? "live" : "test";

export function generateApiKey(): { full: string; prefix: string; hash: string } {
  const random = randomBytes(15).toString("base64url").replace(/[-_]/g, "").slice(0, 24);
  const full = `jol_${ENV}_${random}`;
  const prefix = full.slice(0, 12); // jol_live_xxx (visible to user)
  const hash = createHash("sha256").update(full).digest("hex");
  return { full, prefix, hash };
}

export type ApiKeyAuth = {
  keyId: string;
  userId: string;
  rateLimit: number;
  monthlyQuota: number;
  monthlyUsed: number;
};

/**
 * Verify a Bearer token from incoming request, increment usage, check quota.
 * Returns null if invalid/exceeded.
 */
export async function authenticateApiKey(authHeader: string | null): Promise<{
  ok: boolean;
  auth?: ApiKeyAuth;
  error?: string;
  status: number;
}> {
  if (!authHeader) return { ok: false, error: "missing Authorization header", status: 401 };
  const match = authHeader.match(/^Bearer\s+(jol_[a-z]+_[A-Za-z0-9]+)$/);
  if (!match) return { ok: false, error: "invalid token format", status: 401 };

  const full = match[1];
  const hash = createHash("sha256").update(full).digest("hex");

  const key = await prisma.apiKey.findFirst({
    where: { keyHash: hash, active: true },
  });

  if (!key) return { ok: false, error: "invalid or revoked key", status: 401 };

  if (key.expiresAt && key.expiresAt < new Date()) {
    return { ok: false, error: "key expired", status: 401 };
  }

  if (key.monthlyUsed >= key.monthlyQuota) {
    return {
      ok: false,
      error: `monthly quota exceeded (${key.monthlyUsed}/${key.monthlyQuota})`,
      status: 429,
    };
  }

  // Fire-and-forget usage tracking (don't block the request)
  prisma.apiKey
    .update({
      where: { id: key.id },
      data: {
        monthlyUsed: { increment: 1 },
        lastUsedAt: new Date(),
      },
    })
    .catch((e: unknown) => console.error("[apiAuth] usage update failed", e));

  return {
    ok: true,
    status: 200,
    auth: {
      keyId: key.id,
      userId: key.userId,
      rateLimit: key.rateLimit,
      monthlyQuota: key.monthlyQuota,
      monthlyUsed: key.monthlyUsed + 1,
    },
  };
}

/** Simple in-memory rate limit per-key (per process; resets on restart) */
const rateBuckets = new Map<string, number[]>();
export function checkRateLimit(keyId: string, perMinute: number): boolean {
  const now = Date.now();
  const arr = (rateBuckets.get(keyId) || []).filter((t) => now - t < 60_000);
  arr.push(now);
  rateBuckets.set(keyId, arr);
  return arr.length <= perMinute;
}

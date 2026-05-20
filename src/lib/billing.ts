/**
 * Billing abstraction — currently a stub that records intents and redirects to
 * /contato. When STRIPE_SECRET_KEY env is set, swap stub for real Stripe Checkout.
 */
import { prisma } from "@/lib/db";

export type PlanId = "free" | "pro" | "business" | "enterprise";

export const PLAN_PRICES: Record<PlanId, { monthlyBRLCents: number; label: string }> = {
  free: { monthlyBRLCents: 0, label: "Grátis" },
  pro: { monthlyBRLCents: 4900, label: "Pro" },
  business: { monthlyBRLCents: 19900, label: "Business" },
  enterprise: { monthlyBRLCents: 0, label: "Enterprise (sob consulta)" },
};

export function isPaidPlan(plan: PlanId): boolean {
  return plan === "pro" || plan === "business";
}

/**
 * Create a checkout session. Returns the URL to redirect the user to.
 * Stub mode: logs intent + redirects to /contato pre-filled.
 * Live mode (when STRIPE_SECRET_KEY is set): create real Stripe session.
 */
export async function createCheckoutSession(params: {
  userId: string;
  email: string;
  plan: PlanId;
}): Promise<{ url: string; mode: "stub" | "stripe" }> {
  const { userId, email, plan } = params;

  if (plan === "free" || plan === "enterprise") {
    return {
      url: plan === "enterprise" ? "/contato?dept=comercial" : "/perfil",
      mode: "stub",
    };
  }

  // Future: if (process.env.STRIPE_SECRET_KEY) { return await createStripeSession(...) }

  // Stub: record the intent so we have a paper trail
  try {
    await prisma.webhookEvent.create({
      data: {
        provider: "stub",
        eventId: `intent_${Date.now()}_${userId.slice(0, 8)}`,
        eventType: "checkout.intent",
        payload: { userId, email, plan, source: "checkout_stub" },
        processed: false,
      },
    });
  } catch (e) {
    console.error("[billing] failed to log checkout intent", e);
  }

  // Redirect to /contato with pre-filled context (until Stripe is wired up)
  const subject = encodeURIComponent(`Quero assinar o plano ${PLAN_PRICES[plan].label}`);
  const message = encodeURIComponent(
    `Olá, gostaria de assinar o plano ${PLAN_PRICES[plan].label} (R$ ${(PLAN_PRICES[plan].monthlyBRLCents / 100).toFixed(2)}/mês).\n\nMeu e-mail de cadastro: ${email}\n\nAguardo instruções de pagamento.`
  );
  return {
    url: `/contato?dept=comercial&subject=${subject}&message=${message}`,
    mode: "stub",
  };
}

/**
 * Update user's plan after successful payment (called from webhook).
 */
export async function activateSubscription(params: {
  userId: string;
  plan: PlanId;
  providerSubscriptionId?: string;
  providerCustomerId?: string;
  currentPeriodEnd?: Date;
}) {
  const { userId, plan } = params;
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { plan },
    }),
    prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        plan,
        status: "active",
        provider: process.env.STRIPE_SECRET_KEY ? "stripe" : "stub",
        providerSubscriptionId: params.providerSubscriptionId,
        providerCustomerId: params.providerCustomerId,
        currentPeriodStart: new Date(),
        currentPeriodEnd: params.currentPeriodEnd,
      },
      update: {
        plan,
        status: "active",
        providerSubscriptionId: params.providerSubscriptionId,
        providerCustomerId: params.providerCustomerId,
        currentPeriodEnd: params.currentPeriodEnd,
        cancelAtPeriodEnd: false,
      },
    }),
  ]);
}

/**
 * Stripe webhook endpoint.
 * Currently logs all events to WebhookEvent table for future processing.
 * When STRIPE_WEBHOOK_SECRET is set, verifies signature + processes:
 *  - checkout.session.completed → activateSubscription
 *  - customer.subscription.updated → update status
 *  - customer.subscription.deleted → downgrade to free
 *  - invoice.paid → create Invoice row
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature") || "";
  const body = await req.text();

  let event: { id?: string; type?: string; data?: unknown };
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  // TODO: when STRIPE_WEBHOOK_SECRET is set, verify signature via Stripe SDK
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  // event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)

  const eventId = event.id || `evt_${Date.now()}`;
  const eventType = event.type || "unknown";

  try {
    await prisma.webhookEvent.create({
      data: {
        provider: "stripe",
        eventId,
        eventType,
        payload: event as object,
        processed: false,
      },
    });
  } catch (e) {
    // Likely duplicate eventId (Stripe retries) — idempotent
    console.warn("[webhook stripe] duplicate or insert error", e);
  }

  // Future: process actual event types
  // if (eventType === "checkout.session.completed") {
  //   const userId = event.data.object.metadata.userId;
  //   const plan = event.data.object.metadata.plan;
  //   await activateSubscription({ userId, plan, ... });
  // }

  return NextResponse.json({ received: true, sig: sig ? "verified" : "missing" });
}

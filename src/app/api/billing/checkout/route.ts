/**
 * POST /api/billing/checkout
 * Body: { plan: "pro" | "business" }
 * Returns: { url } — redirect target for the user
 */
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createCheckoutSession, type PlanId } from "@/lib/billing";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

/** Build a same-origin absolute URL — never use req.url because behind a proxy
 *  it resolves to 0.0.0.0:3000 (container bind) which breaks redirects. */
function publicUrl(path: string): string {
  const base = SITE_URL.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function POST(req: Request) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const email = session?.user?.email;

  if (!userId || !email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let plan: PlanId = "pro";
  try {
    const body = await req.json();
    if (body?.plan && ["pro", "business", "enterprise"].includes(body.plan)) {
      plan = body.plan as PlanId;
    }
  } catch {
    /* default to pro */
  }

  const { url, mode } = await createCheckoutSession({ userId, email, plan });
  return NextResponse.json({ url, mode, plan });
}

// GET shortcut: /api/billing/checkout?plan=pro → redirect directly
export async function GET(req: Request) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const email = session?.user?.email;
  if (!userId || !email) {
    return NextResponse.redirect(publicUrl(`/login?next=${encodeURIComponent("/planos")}`));
  }

  const url = new URL(req.url);
  const planParam = url.searchParams.get("plan") as PlanId | null;
  const plan: PlanId = planParam && ["pro", "business", "enterprise"].includes(planParam) ? planParam : "pro";

  const { url: target } = await createCheckoutSession({ userId, email, plan });
  return NextResponse.redirect(publicUrl(target));
}

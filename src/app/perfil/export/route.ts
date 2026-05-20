/**
 * LGPD data export endpoint.
 * Returns a JSON dump of all user-owned data per Art. 18, V of LGPD.
 */
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const email = session?.user?.email;
  if (!userId || !email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const [user, consultations, apiKeys, sessions, leads] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.consultation.findMany({ where: { userId } }),
    prisma.apiKey.findMany({
      where: { userId },
      select: { id: true, name: true, keyPrefix: true, createdAt: true },
    }),
    prisma.session.findMany({
      where: { userId },
      select: { id: true, expires: true },
    }),
    prisma.lead.findMany({ where: { email } }),
  ]);

  const data = {
    exported_at: new Date().toISOString(),
    legal_basis: "LGPD Art. 18, V — direito à portabilidade dos dados",
    contact_dpo: "dpo@juridicoonline.com.br",
    user,
    leads,
    consultations,
    api_keys: apiKeys,
    sessions: sessions.map((s: { id: string; expires: Date }) => ({ id: s.id, expires: s.expires })),
  };

  return new NextResponse(JSON.stringify(data, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="juridico-online-data-${email}-${new Date().toISOString().slice(0, 10)}.json"`,
      "Cache-Control": "private, no-store",
    },
  });
}

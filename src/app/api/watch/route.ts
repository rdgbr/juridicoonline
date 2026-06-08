import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { cnpj, razaoSocial, situacao } = await req.json();
  if (!cnpj) return NextResponse.json({ error: "Missing cnpj" }, { status: 400 });

  const watch = await prisma.companyWatch.upsert({
    where: { userId_cnpj: { userId, cnpj } },
    create: { userId, cnpj, razaoSocial, situacao },
    update: {},
  });

  return NextResponse.json({ watch });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { cnpj } = await req.json();
  if (!cnpj) return NextResponse.json({ error: "Missing cnpj" }, { status: 400 });

  await prisma.companyWatch.deleteMany({ where: { userId, cnpj } });
  return NextResponse.json({ ok: true });
}

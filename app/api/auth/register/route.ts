import { NextRequest, NextResponse } from "next/server";
import { createSession, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return NextResponse.json({ error: "Email đã tồn tại trong hệ thống" }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      passwordHash: await hashPassword(parsed.data.password),
      role: "DONOR",
      status: "ACTIVE"
    }
  });

  await prisma.auditLog.create({
    data: {
      action: "USER_REGISTERED",
      actorId: user.id,
      entityType: "User",
      entityId: user.id,
      metadata: `Donor ${user.email} tự đăng ký tài khoản từ website public.`
    }
  });

  await createSession(user.id);
  return NextResponse.json({ redirectTo: "/account" });
}

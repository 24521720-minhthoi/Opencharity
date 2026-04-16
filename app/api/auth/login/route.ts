import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession, roleHome, verifyPassword } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    include: { organization: true }
  });

  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return NextResponse.json({ error: "Email hoặc mật khẩu không đúng" }, { status: 401 });
  }

  if (user.status !== "ACTIVE") {
    return NextResponse.json({ error: "Tài khoản chưa được kích hoạt hoặc đang bị khóa" }, { status: 403 });
  }

  await createSession(user.id);
  await prisma.auditLog.create({
    data: {
      action: "USER_LOGIN",
      actorId: user.id,
      entityType: "User",
      entityId: user.id,
      metadata: `Người dùng ${user.email} đăng nhập vào hệ thống demo.`,
      ipAddress: request.ip ?? "127.0.0.1"
    }
  });

  return NextResponse.json({ redirectTo: roleHome(user.role) });
}

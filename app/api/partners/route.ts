import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { partnerSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = partnerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" }, { status: 400 });
  }

  const partner = await prisma.partner.create({
    data: {
      name: parsed.data.name,
      contactName: parsed.data.contactName,
      contactEmail: parsed.data.contactEmail,
      contribution: parsed.data.contribution,
      tier: "COMMUNITY",
      status: "PENDING"
    }
  });

  await prisma.auditLog.create({
    data: {
      action: "PARTNER_REQUESTED",
      entityType: "Partner",
      entityId: partner.id,
      metadata: `Đối tác "${partner.name}" gửi form hợp tác và chờ admin xác minh.`
    }
  });

  return NextResponse.json({ message: "OpenCharity đã ghi nhận đăng ký hợp tác. Admin sẽ xác minh trước khi công khai." });
}

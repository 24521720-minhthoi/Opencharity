import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest) {
  const user = await requireUser(["ADMIN"]);
  const { id, action } = await request.json();
  if (!id || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Yêu cầu không hợp lệ" }, { status: 400 });
  }

  const status = action === "approve" ? "APPROVED" : "REJECTED";
  const update = await prisma.campaignUpdate.update({
    where: { id },
    data: { status },
    include: { campaign: true }
  });

  await prisma.auditLog.create({
    data: {
      action: action === "approve" ? "UPDATE_APPROVED" : "UPDATE_REJECTED",
      actorId: user.id,
      entityType: "CampaignUpdate",
      entityId: update.id,
      metadata:
        action === "approve"
          ? `Admin duyệt minh chứng "${update.title}", dữ liệu được công khai trên trang chiến dịch và transparency.`
          : `Admin từ chối minh chứng "${update.title}" để tổ chức làm rõ chứng từ.`
    }
  });

  return NextResponse.json({ ok: true });
}

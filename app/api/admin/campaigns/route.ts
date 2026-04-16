import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest) {
  const user = await requireUser(["ADMIN"]);
  const { id, action } = await request.json();
  if (!id || !["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "Yêu cầu không hợp lệ" }, { status: 400 });
  }

  const status = action === "approve" ? "ACTIVE" : "REJECTED";
  const campaign = await prisma.campaign.update({
    where: { id },
    data: { status }
  });

  await prisma.auditLog.create({
    data: {
      action: action === "approve" ? "CAMPAIGN_APPROVED" : "CAMPAIGN_REJECTED",
      actorId: user.id,
      entityType: "Campaign",
      entityId: campaign.id,
      metadata:
        action === "approve"
          ? `Admin duyệt chiến dịch "${campaign.title}", chiến dịch xuất hiện ở public listing.`
          : `Admin từ chối chiến dịch "${campaign.title}" để tổ chức bổ sung hồ sơ.`
    }
  });

  return NextResponse.json({ ok: true });
}

import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  const user = await requireUser(["CHARITY"]);
  const body = await request.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" }, { status: 400 });
  }

  const campaign = await prisma.campaign.findUnique({ where: { id: parsed.data.campaignId } });
  if (!campaign || campaign.organizationId !== user.organizationId) {
    return NextResponse.json({ error: "Bạn không có quyền cập nhật chiến dịch này" }, { status: 403 });
  }

  const update = await prisma.campaignUpdate.create({
    data: {
      campaignId: campaign.id,
      title: parsed.data.title,
      summary: parsed.data.summary,
      evidenceUrl: parsed.data.evidenceUrl || null,
      imageUrl: parsed.data.imageUrl || null,
      fundUsed: parsed.data.fundUsed,
      status: "PENDING_REVIEW"
    }
  });

  await prisma.auditLog.create({
    data: {
      action: "UPDATE_SUBMITTED",
      actorId: user.id,
      entityType: "CampaignUpdate",
      entityId: update.id,
      metadata: `Tổ chức gửi minh chứng "${update.title}" cho chiến dịch "${campaign.title}".`
    }
  });

  return NextResponse.json({ id: update.id });
}

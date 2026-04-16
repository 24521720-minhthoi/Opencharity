import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { campaignSchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";

export async function POST(request: NextRequest) {
  const user = await requireUser(["CHARITY"]);
  if (!user.organizationId) {
    return NextResponse.json({ error: "Tài khoản chưa gắn với tổ chức thiện nguyện" }, { status: 403 });
  }

  const body = await request.json();
  const parsed = campaignSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" }, { status: 400 });
  }

  const baseSlug = slugify(parsed.data.title);
  const slug = `${baseSlug}-${Date.now().toString(36)}`;
  const campaign = await prisma.campaign.create({
    data: {
      title: parsed.data.title,
      slug,
      summary: parsed.data.summary,
      description: parsed.data.description,
      categoryId: parsed.data.categoryId,
      province: parsed.data.province,
      beneficiary: parsed.data.beneficiary,
      targetAmount: parsed.data.targetAmount,
      currentAmount: 0,
      impactMetric: parsed.data.impactMetric,
      startDate: new Date(),
      endDate: new Date(parsed.data.endDate),
      imageUrl: parsed.data.imageUrl,
      fundAllocation: parsed.data.fundAllocation,
      status: "PENDING_REVIEW",
      transparencyScore: 78,
      organizationId: user.organizationId
    }
  });

  await prisma.auditLog.create({
    data: {
      action: "CAMPAIGN_CREATED",
      actorId: user.id,
      entityType: "Campaign",
      entityId: campaign.id,
      metadata: `Tổ chức ${user.organization?.name ?? ""} gửi chiến dịch "${campaign.title}" chờ admin duyệt.`
    }
  });

  return NextResponse.json({ id: campaign.id });
}

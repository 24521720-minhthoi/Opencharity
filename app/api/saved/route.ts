import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const user = await requireUser(["DONOR", "ADMIN", "PARTNER"]);
  const { campaignId } = await request.json();
  if (!campaignId) {
    return NextResponse.json({ error: "Thiếu campaignId" }, { status: 400 });
  }

  const existing = await prisma.savedCampaign.findUnique({
    where: { userId_campaignId: { userId: user.id, campaignId } }
  });

  if (existing) {
    await prisma.savedCampaign.delete({ where: { id: existing.id } });
    return NextResponse.json({ saved: false });
  }

  await prisma.savedCampaign.create({ data: { userId: user.id, campaignId } });
  return NextResponse.json({ saved: true });
}

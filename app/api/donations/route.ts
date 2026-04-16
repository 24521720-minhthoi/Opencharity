import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { donationSchema } from "@/lib/validators";

function makeCode(prefix: string) {
  const now = new Date();
  return `${prefix}-${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, "0")}${now
    .getDate()
    .toString()
    .padStart(2, "0")}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export async function POST(request: NextRequest) {
  const user = await requireUser(["DONOR", "ADMIN", "PARTNER"]);
  const body = await request.json();
  const parsed = donationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" }, { status: 400 });
  }

  const campaign = await prisma.campaign.findUnique({ where: { id: parsed.data.campaignId } });
  if (!campaign || campaign.status !== "ACTIVE") {
    return NextResponse.json({ error: "Chiến dịch không khả dụng để ủng hộ" }, { status: 404 });
  }

  const transactionCode = makeCode("OC");
  const receiptNumber = makeCode("RCT");

  const donation = await prisma.$transaction(async (tx) => {
    const created = await tx.donation.create({
      data: {
        campaignId: campaign.id,
        donorId: user.id,
        amount: parsed.data.amount,
        method: parsed.data.method,
        status: "SUCCESS",
        transactionCode,
        message: parsed.data.message
      }
    });

    await tx.paymentReceipt.create({
      data: {
        donationId: created.id,
        receiptNumber,
        payerName: user.name,
        payerEmail: user.email,
        reconciliation: `Thanh toán demo thành công qua ${parsed.data.method}; tự động đưa vào batch đối soát ngày.`
      }
    });

    await tx.campaign.update({
      where: { id: campaign.id },
      data: {
        currentAmount: {
          increment: parsed.data.amount
        }
      }
    });

    await tx.notification.create({
      data: {
        userId: user.id,
        title: "Ủng hộ thành công",
        content: `Bạn đã ủng hộ ${parsed.data.amount.toLocaleString("vi-VN")}đ cho chiến dịch ${campaign.title}.`
      }
    });

    await tx.auditLog.create({
      data: {
        action: "DONATION_CREATED",
        actorId: user.id,
        entityType: "Donation",
        entityId: created.id,
        metadata: `Giao dịch ${transactionCode} được ghi nhận và sinh biên nhận ${receiptNumber}.`,
        ipAddress: request.ip ?? "127.0.0.1"
      }
    });

    return created;
  });

  return NextResponse.json({ redirectUrl: `/payment/success?donation=${donation.id}` });
}

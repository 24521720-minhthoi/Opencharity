import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PaymentSuccessPage({ searchParams }: { searchParams: { donation?: string } }) {
  const user = await requireUser();
  const donation = searchParams.donation
    ? await prisma.donation.findUnique({
        where: { id: searchParams.donation },
        include: { campaign: true, receipt: true, donor: true }
      })
    : null;

  return (
    <div className="page-shell">
      <Card className="mx-auto max-w-2xl p-8 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-primary" />
        <h1 className="mt-4 text-3xl font-semibold text-slate-950">Ủng hộ thành công</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">Hệ thống đã tạo giao dịch, biên nhận và audit log. Dữ liệu transparency sẽ phản ánh ngay trong demo.</p>

        {donation ? (
          <div className="mt-6 rounded-lg border bg-slate-50 p-4 text-left text-sm">
            <div className="grid gap-3">
              <div className="flex justify-between gap-3"><span>Người ủng hộ</span><strong>{donation.donor.name}</strong></div>
              <div className="flex justify-between gap-3"><span>Chiến dịch</span><strong>{donation.campaign.title}</strong></div>
              <div className="flex justify-between gap-3"><span>Số tiền</span><strong>{formatCurrency(donation.amount)}</strong></div>
              <div className="flex justify-between gap-3"><span>Mã giao dịch</span><strong>{donation.transactionCode}</strong></div>
              <div className="flex justify-between gap-3"><span>Biên nhận</span><strong>{donation.receipt?.receiptNumber}</strong></div>
              <div className="flex justify-between gap-3"><span>Thời gian</span><strong>{formatDateTime(donation.createdAt)}</strong></div>
            </div>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/account/donations">Xem lịch sử giao dịch</ButtonLink>
          <ButtonLink href="/transparency" variant="outline">Xem transparency</ButtonLink>
        </div>
        {user.role === "ADMIN" ? <Link href="/admin" className="mt-4 inline-block text-sm text-primary">Về admin dashboard</Link> : null}
      </Card>
    </div>
  );
}

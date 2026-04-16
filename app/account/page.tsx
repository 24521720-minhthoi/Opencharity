import { Bookmark, ReceiptText, UserRound } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await requireUser(["DONOR", "ADMIN", "PARTNER"]);
  const [donations, saved, notifications, aggregate] = await Promise.all([
    prisma.donation.findMany({
      where: { donorId: user.id },
      include: { campaign: true, receipt: true },
      orderBy: { createdAt: "desc" },
      take: 5
    }),
    prisma.savedCampaign.count({ where: { userId: user.id } }),
    prisma.notification.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 4 }),
    prisma.donation.aggregate({ where: { donorId: user.id, status: "SUCCESS" }, _sum: { amount: true }, _count: true })
  ]);

  return (
    <div className="page-shell">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="p-6">
          <div className="grid h-14 w-14 place-items-center rounded-md bg-secondary text-primary">
            <UserRound className="h-7 w-7" />
          </div>
          <h1 className="mt-4 text-3xl font-semibold">{user.name}</h1>
          <p className="mt-2 text-sm text-slate-500">{user.email}</p>
          <div className="mt-6 grid gap-3">
            <ButtonLink href="/campaigns">Ủng hộ thêm chiến dịch</ButtonLink>
            <ButtonLink href="/account/donations" variant="outline">Xem toàn bộ biên nhận</ButtonLink>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Tổng đã ủng hộ" value={formatCurrency(aggregate._sum.amount ?? 0)} helper="Giao dịch thành công" icon={<ReceiptText className="h-5 w-5" />} />
          <StatCard label="Số giao dịch" value={aggregate._count.toString()} helper="Có biên nhận đối soát" icon={<ReceiptText className="h-5 w-5" />} />
          <StatCard label="Chiến dịch đã lưu" value={saved.toString()} helper="Theo dõi sau" icon={<Bookmark className="h-5 w-5" />} />
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.8fr]">
        <Card className="p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Giao dịch gần đây</h2>
            <ButtonLink href="/account/donations" variant="outline" size="sm">Xem tất cả</ButtonLink>
          </div>
          <div className="mt-5 grid gap-3">
            {donations.map((donation) => (
              <div key={donation.id} className="rounded-lg border bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-medium">{donation.campaign.title}</h3>
                  <span className="font-semibold text-primary">{formatCurrency(donation.amount)}</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">{donation.transactionCode} - {donation.receipt?.receiptNumber}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold">Thông báo</h2>
          <div className="mt-5 grid gap-3">
            {notifications.map((notification) => (
              <div key={notification.id} className="rounded-lg border bg-white p-4">
                <h3 className="font-medium">{notification.title}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">{notification.content}</p>
                <p className="mt-2 text-xs text-slate-500">{formatDateTime(notification.createdAt)}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

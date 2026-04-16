import { Activity, Banknote, ClipboardCheck, UsersRound } from "lucide-react";
import { DonationChart } from "@/components/charts/donation-chart";
import { StatusChart } from "@/components/charts/status-chart";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { Badge, toneFromStatus } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { requireUser } from "@/lib/auth";
import { getDonationSeries, getPlatformStats } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { formatCompactCurrency, formatDateTime, statusLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireUser(["ADMIN"]);
  const [stats, series, users, campaigns, updates, recentDonations] = await Promise.all([
    getPlatformStats(),
    getDonationSeries(),
    prisma.user.count(),
    prisma.campaign.groupBy({ by: ["status"], _count: true }),
    prisma.campaignUpdate.count({ where: { status: "PENDING_REVIEW" } }),
    prisma.donation.findMany({
      include: { campaign: true, donor: true },
      orderBy: { createdAt: "desc" },
      take: 6
    })
  ]);

  const statusData = campaigns.map((item) => ({ name: statusLabel(item.status), value: item._count }));

  return (
    <div className="page-shell">
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <DashboardNav type="admin" />
        <div>
          <div className="rounded-lg border bg-white p-6 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-normal text-primary">Admin operations</p>
            <h1 className="mt-2 text-3xl font-semibold">Dashboard vận hành nền tảng</h1>
            <p className="section-lead">Theo dõi sức khỏe marketplace thiện nguyện: chiến dịch, giao dịch, minh chứng chờ duyệt và hoạt động audit.</p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <StatCard label="Tổng giá trị ủng hộ" value={formatCompactCurrency(stats.totalDonation)} helper="Giao dịch SUCCESS" icon={<Banknote className="h-5 w-5" />} />
            <StatCard label="Chiến dịch công khai" value={stats.campaigns.toString()} helper="ACTIVE + COMPLETED" icon={<ClipboardCheck className="h-5 w-5" />} />
            <StatCard label="Người dùng" value={users.toString()} helper="Tất cả vai trò" icon={<UsersRound className="h-5 w-5" />} />
            <StatCard label="Minh chứng chờ duyệt" value={updates.toString()} helper="Cần admin xử lý" icon={<Activity className="h-5 w-5" />} />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
            <Card className="p-6">
              <h2 className="text-xl font-semibold">Dòng tiền theo ngày</h2>
              <DonationChart data={series} />
            </Card>
            <Card className="p-6">
              <h2 className="text-xl font-semibold">Trạng thái chiến dịch</h2>
              <StatusChart data={statusData} />
              <div className="mt-4 grid gap-2">
                {campaigns.map((item) => (
                  <div key={item.status} className="flex items-center justify-between text-sm">
                    <Badge tone={toneFromStatus(item.status)}>{statusLabel(item.status)}</Badge>
                    <span className="font-semibold">{item._count}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="mt-6 p-6">
            <h2 className="text-xl font-semibold">Giao dịch mới nhất</h2>
            <div className="mt-5 grid gap-3">
              {recentDonations.map((donation) => (
                <div key={donation.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-slate-50 p-4">
                  <div>
                    <p className="font-medium">{donation.campaign.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{donation.donor.name} - {formatDateTime(donation.createdAt)}</p>
                  </div>
                  <span className="font-semibold text-primary">{formatCompactCurrency(donation.amount)}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { BarChart3, ClipboardCheck, FileClock, ShieldCheck } from "lucide-react";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { Badge, toneFromStatus } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";
import { StatCard } from "@/components/ui/stat-card";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCompactCurrency, formatDate, statusLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OrganizationDashboardPage() {
  const user = await requireUser(["CHARITY"]);
  const organizationId = user.organizationId!;

  const [campaigns, pendingUpdates, donationAgg] = await Promise.all([
    prisma.campaign.findMany({
      where: { organizationId },
      include: { category: true, donations: true },
      orderBy: { createdAt: "desc" }
    }),
    prisma.campaignUpdate.count({
      where: {
        campaign: { organizationId },
        status: "PENDING_REVIEW"
      }
    }),
    prisma.donation.aggregate({
      where: { campaign: { organizationId }, status: "SUCCESS" },
      _sum: { amount: true },
      _count: true
    })
  ]);

  const active = campaigns.filter((campaign) => campaign.status === "ACTIVE").length;

  return (
    <div className="page-shell">
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <DashboardNav type="organization" />
        <div>
          <div className="rounded-lg border bg-white p-6 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-normal text-primary">Organization dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold">{user.organization?.name}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">{user.organization?.mission}</p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <StatCard label="Tổng chiến dịch" value={campaigns.length.toString()} helper="Bao gồm draft/chờ duyệt" icon={<ClipboardCheck className="h-5 w-5" />} />
            <StatCard label="Đang công khai" value={active.toString()} helper="Public có thể ủng hộ" icon={<ShieldCheck className="h-5 w-5" />} />
            <StatCard label="Tổng đã nhận" value={formatCompactCurrency(donationAgg._sum.amount ?? 0)} helper={`${donationAgg._count} giao dịch`} icon={<BarChart3 className="h-5 w-5" />} />
            <StatCard label="Minh chứng chờ duyệt" value={pendingUpdates.toString()} helper="Admin cần kiểm tra" icon={<FileClock className="h-5 w-5" />} />
          </div>

          <Card className="mt-6 p-6">
            <h2 className="text-xl font-semibold">Chiến dịch của tổ chức</h2>
            <div className="mt-5 grid gap-4">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="rounded-lg border bg-slate-50 p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <Badge tone="info">{campaign.category.name}</Badge>
                        <Badge tone={toneFromStatus(campaign.status)}>{statusLabel(campaign.status)}</Badge>
                      </div>
                      <h3 className="mt-3 font-semibold text-slate-950">{campaign.title}</h3>
                      <p className="mt-1 text-sm text-slate-500">{campaign.province} - kết thúc {formatDate(campaign.endDate)}</p>
                    </div>
                    <span className="text-sm font-semibold text-primary">{formatCompactCurrency(campaign.currentAmount)}</span>
                  </div>
                  <ProgressBar current={campaign.currentAmount} target={campaign.targetAmount} className="mt-4" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

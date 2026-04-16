import { Activity, Banknote, CheckCircle2, FileSearch } from "lucide-react";
import { AuditTimeline } from "@/components/audit-timeline";
import { DonationChart } from "@/components/charts/donation-chart";
import { Badge, toneFromStatus } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { getDonationSeries, getPlatformStats, getRecentAuditLogs } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { formatCompactCurrency, formatCurrency, formatDateTime, statusLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TransparencyPage() {
  const [stats, series, logs, donations, completed, updates] = await Promise.all([
    getPlatformStats(),
    getDonationSeries(),
    getRecentAuditLogs(10),
    prisma.donation.findMany({
      where: { status: "SUCCESS" },
      include: { campaign: true, donor: true, receipt: true },
      orderBy: { createdAt: "desc" },
      take: 12
    }),
    prisma.campaign.findMany({
      where: { status: "COMPLETED" },
      include: { organization: true, category: true },
      orderBy: { updatedAt: "desc" }
    }),
    prisma.campaignUpdate.findMany({
      where: { status: "APPROVED" },
      include: { campaign: true },
      orderBy: { createdAt: "desc" },
      take: 8
    })
  ]);

  return (
    <div className="page-shell">
      <div className="rounded-lg border bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-normal text-primary">Transparency center</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal text-slate-950">Dữ liệu minh bạch và đối soát</h1>
        <p className="section-lead">Trang này mô phỏng lớp dữ liệu công khai của OpenCharity: tổng tiền, giao dịch, biên nhận, cập nhật sử dụng quỹ và audit trail.</p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <StatCard label="Tổng tiền đã ghi nhận" value={formatCompactCurrency(stats.totalDonation)} helper="Từ giao dịch SUCCESS" icon={<Banknote className="h-5 w-5" />} />
        <StatCard label="Số giao dịch" value={stats.donationCount.toString()} helper="Có mã giao dịch và receipt" icon={<Activity className="h-5 w-5" />} />
        <StatCard label="Minh chứng đã duyệt" value={stats.approvedUpdates.toString()} helper="Public nhìn thấy trên campaign" icon={<FileSearch className="h-5 w-5" />} />
        <StatCard label="Chiến dịch hoàn tất" value={stats.completedCampaigns.toString()} helper="Có kết quả công khai" icon={<CheckCircle2 className="h-5 w-5" />} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-950">Dòng tiền theo ngày</h2>
          <p className="mt-2 text-sm text-slate-600">Biểu đồ cộng dồn các giao dịch thành công trong dữ liệu demo.</p>
          <DonationChart data={series} />
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-slate-950">Audit trail gần đây</h2>
          <div className="mt-5 max-h-[380px] overflow-auto pr-2">
            <AuditTimeline logs={logs} />
          </div>
        </Card>
      </div>

      <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <Card className="p-6">
          <h2 className="text-xl font-semibold">Giao dịch gần đây</h2>
          <div className="mt-5 table-wrap">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Mã</th>
                  <th className="px-4 py-3">Chiến dịch</th>
                  <th className="px-4 py-3">Donor</th>
                  <th className="px-4 py-3">Số tiền</th>
                  <th className="px-4 py-3">Đối soát</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation.id} className="border-t">
                    <td className="px-4 py-3 font-medium">{donation.transactionCode}</td>
                    <td className="px-4 py-3">{donation.campaign.title}</td>
                    <td className="px-4 py-3">{donation.donor.name}</td>
                    <td className="px-4 py-3 font-semibold text-primary">{formatCurrency(donation.amount)}</td>
                    <td className="px-4 py-3 text-slate-500">{donation.receipt?.reconciliation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold">Minh chứng sử dụng quỹ</h2>
          <div className="mt-5 grid gap-3">
            {updates.map((update) => (
              <div key={update.id} className="rounded-lg border bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-medium">{update.title}</h3>
                  <Badge tone={toneFromStatus(update.status)}>{statusLabel(update.status)}</Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{update.summary}</p>
                <p className="mt-2 text-xs text-slate-500">{update.campaign.title} - {formatDateTime(update.createdAt)}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="mt-8">
        <h2 className="section-title">Chiến dịch đã hoàn thành</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {completed.map((campaign) => (
            <Card key={campaign.id} className="p-5">
              <Badge tone="success">{campaign.category.name}</Badge>
              <h3 className="mt-3 text-lg font-semibold">{campaign.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{campaign.organization.name}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-md bg-slate-50 p-3">
                  <p className="text-slate-500">Đã gây quỹ</p>
                  <p className="mt-1 font-semibold">{formatCurrency(campaign.currentAmount)}</p>
                </div>
                <div className="rounded-md bg-slate-50 p-3">
                  <p className="text-slate-500">Điểm minh bạch</p>
                  <p className="mt-1 font-semibold">{campaign.transparencyScore}/100</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

import { DashboardNav } from "@/components/layout/dashboard-nav";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDateTime, statusLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminTransactionsPage() {
  await requireUser(["ADMIN"]);
  const donations = await prisma.donation.findMany({
    include: { donor: true, campaign: true, receipt: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="page-shell">
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <DashboardNav type="admin" />
        <Card className="p-6">
          <h1 className="text-3xl font-semibold">Theo dõi giao dịch</h1>
          <p className="section-lead">Bảng này phục vụ phần thương mại điện tử: mã giao dịch, phương thức, trạng thái, receipt và batch đối soát.</p>
          <div className="mt-6 table-wrap">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Thời gian</th>
                  <th className="px-4 py-3">Mã giao dịch</th>
                  <th className="px-4 py-3">Donor</th>
                  <th className="px-4 py-3">Chiến dịch</th>
                  <th className="px-4 py-3">Số tiền</th>
                  <th className="px-4 py-3">Phương thức</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Biên nhận</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation.id} className="border-t">
                    <td className="px-4 py-3">{formatDateTime(donation.createdAt)}</td>
                    <td className="px-4 py-3 font-medium">{donation.transactionCode}</td>
                    <td className="px-4 py-3">{donation.donor.name}</td>
                    <td className="px-4 py-3">{donation.campaign.title}</td>
                    <td className="px-4 py-3 font-semibold text-primary">{formatCurrency(donation.amount)}</td>
                    <td className="px-4 py-3">{donation.method}</td>
                    <td className="px-4 py-3"><Badge tone="success">{statusLabel(donation.status)}</Badge></td>
                    <td className="px-4 py-3 text-slate-500">{donation.receipt?.receiptNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

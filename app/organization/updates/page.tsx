import { UpdateForm } from "@/components/forms/update-form";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { Badge, toneFromStatus } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDateTime, statusLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OrganizationUpdatesPage() {
  const user = await requireUser(["CHARITY"]);
  const [campaigns, updates] = await Promise.all([
    prisma.campaign.findMany({
      where: { organizationId: user.organizationId!, status: { in: ["ACTIVE", "COMPLETED"] } },
      orderBy: { createdAt: "desc" }
    }),
    prisma.campaignUpdate.findMany({
      where: { campaign: { organizationId: user.organizationId! } },
      include: { campaign: true },
      orderBy: { createdAt: "desc" }
    })
  ]);

  return (
    <div className="page-shell">
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <DashboardNav type="organization" />
        <div className="grid gap-6">
          <Card className="p-6">
            <h1 className="text-3xl font-semibold">Gửi cập nhật minh chứng</h1>
            <p className="section-lead">Sau khi gửi, cập nhật ở trạng thái chờ duyệt. Chỉ khi admin duyệt thì public mới thấy trên chi tiết chiến dịch và transparency.</p>
            <div className="mt-6">
              <UpdateForm campaigns={campaigns} />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold">Lịch sử cập nhật</h2>
            <div className="mt-5 grid gap-3">
              {updates.map((update) => (
                <div key={update.id} className="rounded-lg border bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-medium">{update.title}</h3>
                    <Badge tone={toneFromStatus(update.status)}>{statusLabel(update.status)}</Badge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{update.summary}</p>
                  <p className="mt-2 text-xs text-slate-500">{update.campaign.title} - {formatDateTime(update.createdAt)} - đã dùng {formatCurrency(update.fundUsed)}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

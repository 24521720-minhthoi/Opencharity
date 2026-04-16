import { AdminActionButton } from "@/components/forms/admin-action-button";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { Badge, toneFromStatus } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDateTime, statusLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminUpdatesPage() {
  await requireUser(["ADMIN"]);
  const updates = await prisma.campaignUpdate.findMany({
    include: { campaign: { include: { organization: true } } },
    orderBy: [{ status: "desc" }, { createdAt: "desc" }]
  });

  return (
    <div className="page-shell">
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <DashboardNav type="admin" />
        <Card className="p-6">
          <h1 className="text-3xl font-semibold">Duyệt cập nhật minh chứng</h1>
          <p className="section-lead">Minh chứng chỉ được public sau khi admin duyệt, giúp kiểm soát chất lượng thông tin trước khi hiển thị cho cộng đồng.</p>
          <div className="mt-6 grid gap-4">
            {updates.map((update) => (
              <div key={update.id} className="rounded-lg border bg-slate-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <Badge tone={toneFromStatus(update.status)}>{statusLabel(update.status)}</Badge>
                    <h2 className="mt-3 font-semibold">{update.title}</h2>
                    <p className="mt-1 text-sm text-slate-500">{update.campaign.title} - {update.campaign.organization.name}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{update.summary}</p>
                    <p className="mt-2 text-xs text-slate-500">{formatDateTime(update.createdAt)} - fund used {formatCurrency(update.fundUsed)}</p>
                    {update.evidenceUrl ? <a href={update.evidenceUrl} target="_blank" className="mt-2 inline-block text-sm text-primary">Mở tài liệu minh chứng</a> : null}
                  </div>
                  {update.status === "PENDING_REVIEW" ? (
                    <div className="flex flex-wrap gap-2">
                      <AdminActionButton endpoint="/api/admin/updates" id={update.id} action="approve" label="Duyệt public" />
                      <AdminActionButton endpoint="/api/admin/updates" id={update.id} action="reject" label="Từ chối" variant="danger" />
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

import Link from "next/link";
import { AdminActionButton } from "@/components/forms/admin-action-button";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { Badge, toneFromStatus } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCompactCurrency, statusLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCampaignsPage() {
  await requireUser(["ADMIN"]);
  const campaigns = await prisma.campaign.findMany({
    include: { organization: true, category: true },
    orderBy: [{ status: "desc" }, { createdAt: "desc" }]
  });

  return (
    <div className="page-shell">
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <DashboardNav type="admin" />
        <Card className="p-6">
          <h1 className="text-3xl font-semibold">Quản lý chiến dịch</h1>
          <p className="section-lead">Admin duyệt chiến dịch để chuyển từ PENDING_REVIEW sang ACTIVE, khi đó public mới nhìn thấy và có thể ủng hộ.</p>
          <div className="mt-6 grid gap-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="rounded-lg border bg-slate-50 p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <Badge tone={toneFromStatus(campaign.status)}>{statusLabel(campaign.status)}</Badge>
                      <Badge tone="info">{campaign.category.name}</Badge>
                    </div>
                    <h2 className="mt-3 font-semibold">{campaign.title}</h2>
                    <p className="mt-1 text-sm text-slate-600">{campaign.organization.name} - {campaign.province}</p>
                    <p className="mt-2 text-sm text-slate-500">Mục tiêu {formatCompactCurrency(campaign.targetAmount)} - điểm minh bạch {campaign.transparencyScore}/100</p>
                    {campaign.riskNote ? <p className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">{campaign.riskNote}</p> : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {campaign.status === "PENDING_REVIEW" ? (
                      <>
                        <AdminActionButton endpoint="/api/admin/campaigns" id={campaign.id} action="approve" label="Duyệt" />
                        <AdminActionButton endpoint="/api/admin/campaigns" id={campaign.id} action="reject" label="Từ chối" variant="danger" />
                      </>
                    ) : null}
                    {["ACTIVE", "COMPLETED"].includes(campaign.status) ? (
                      <Link href={`/campaigns/${campaign.slug}`} className="rounded-md border bg-white px-3 py-2 text-sm font-medium">Xem public</Link>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

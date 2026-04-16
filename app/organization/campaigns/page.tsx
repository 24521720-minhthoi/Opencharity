import Link from "next/link";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { Badge, toneFromStatus } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCompactCurrency, statusLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OrganizationCampaignsPage({ searchParams }: { searchParams: { created?: string } }) {
  const user = await requireUser(["CHARITY"]);
  const campaigns = await prisma.campaign.findMany({
    where: { organizationId: user.organizationId! },
    include: { category: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="page-shell">
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <DashboardNav type="organization" />
        <Card className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold">Quản lý chiến dịch</h1>
              <p className="section-lead">Theo dõi trạng thái kiểm duyệt, tiến độ gây quỹ và khả năng public của từng chiến dịch.</p>
            </div>
            <ButtonLink href="/organization/campaigns/new">Tạo chiến dịch</ButtonLink>
          </div>
          {searchParams.created ? <p className="mt-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">Chiến dịch đã được gửi chờ admin duyệt.</p> : null}
          <div className="mt-6 grid gap-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="rounded-lg border bg-slate-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <Badge tone="info">{campaign.category.name}</Badge>
                      <Badge tone={toneFromStatus(campaign.status)}>{statusLabel(campaign.status)}</Badge>
                    </div>
                    <h2 className="mt-3 font-semibold">{campaign.title}</h2>
                    <p className="mt-1 text-sm text-slate-600">{campaign.summary}</p>
                  </div>
                  {["ACTIVE", "COMPLETED"].includes(campaign.status) ? (
                    <Link className="text-sm font-medium text-primary" href={`/campaigns/${campaign.slug}`}>Xem public</Link>
                  ) : null}
                </div>
                <div className="mt-4">
                  <ProgressBar current={campaign.currentAmount} target={campaign.targetAmount} />
                  <p className="mt-2 text-sm text-slate-500">{formatCompactCurrency(campaign.currentAmount)} / {formatCompactCurrency(campaign.targetAmount)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

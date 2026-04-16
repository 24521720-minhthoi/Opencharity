import { AuditTimeline } from "@/components/audit-timeline";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminAuditPage() {
  await requireUser(["ADMIN"]);
  const logs = await prisma.auditLog.findMany({
    include: { actor: true },
    orderBy: { createdAt: "desc" },
    take: 80
  });

  return (
    <div className="page-shell">
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <DashboardNav type="admin" />
        <Card className="p-6">
          <h1 className="text-3xl font-semibold">Nhật ký hệ thống / Audit log</h1>
          <p className="section-lead">Audit log giúp bảo vệ đồ án ở khía cạnh quản trị nền tảng: ai làm gì, tác động vào entity nào, lúc nào và vì sao.</p>
          <div className="mt-6">
            <AuditTimeline logs={logs} />
          </div>
        </Card>
      </div>
    </div>
  );
}

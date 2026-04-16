import { CampaignCard } from "@/components/campaign-card";
import { EmptyState } from "@/components/ui/empty-state";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function SavedCampaignsPage() {
  const user = await requireUser(["DONOR", "ADMIN", "PARTNER"]);
  const saved = await prisma.savedCampaign.findMany({
    where: { userId: user.id },
    include: {
      campaign: {
        include: { category: true, organization: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="page-shell">
      <h1 className="text-3xl font-semibold">Chiến dịch đã lưu</h1>
      <p className="section-lead">Danh sách chiến dịch bạn muốn theo dõi khi có cập nhật minh chứng hoặc tiến độ gây quỹ mới.</p>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {saved.map((item) => (
          <CampaignCard key={item.id} campaign={item.campaign} />
        ))}
      </div>
      {!saved.length ? (
        <div className="mt-8">
          <EmptyState title="Chưa lưu chiến dịch nào" description="Bạn có thể lưu chiến dịch trong trang chi tiết để theo dõi sau." actionHref="/campaigns" actionLabel="Khám phá chiến dịch" />
        </div>
      ) : null}
    </div>
  );
}

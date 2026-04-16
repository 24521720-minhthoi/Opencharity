import { Search } from "lucide-react";
import { CampaignCard } from "@/components/campaign-card";
import { EmptyState } from "@/components/ui/empty-state";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CampaignListingPage({
  searchParams
}: {
  searchParams: { q?: string; category?: string; province?: string; status?: string };
}) {
  const [categories, provinces] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.campaign.findMany({
      where: { status: { in: ["ACTIVE", "COMPLETED"] } },
      distinct: ["province"],
      select: { province: true },
      orderBy: { province: "asc" }
    })
  ]);

  const campaigns = await prisma.campaign.findMany({
    where: {
      status: searchParams.status ? (searchParams.status as any) : { in: ["ACTIVE", "COMPLETED"] },
      category: searchParams.category ? { slug: searchParams.category } : undefined,
      province: searchParams.province || undefined,
      OR: searchParams.q
        ? [
            { title: { contains: searchParams.q } },
            { summary: { contains: searchParams.q } },
            { beneficiary: { contains: searchParams.q } }
          ]
        : undefined
    },
    include: { category: true, organization: true },
    orderBy: [{ status: "asc" }, { transparencyScore: "desc" }, { createdAt: "desc" }]
  });

  return (
    <div className="page-shell">
      <div className="rounded-lg border bg-white p-6 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-normal text-primary">Campaign marketplace</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal text-slate-950">Danh sách chiến dịch thiện nguyện</h1>
        <p className="section-lead">Lọc theo lĩnh vực, địa phương, trạng thái và tìm chiến dịch có tiến độ, tổ chức thụ hưởng, điểm minh bạch rõ ràng.</p>

        <form className="mt-6 grid gap-3 md:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <input className="form-input pl-9" name="q" defaultValue={searchParams.q} placeholder="Tìm theo tên, đơn vị thụ hưởng..." />
          </div>
          <select className="form-input" name="category" defaultValue={searchParams.category ?? ""}>
            <option value="">Tất cả lĩnh vực</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>{category.name}</option>
            ))}
          </select>
          <select className="form-input" name="province" defaultValue={searchParams.province ?? ""}>
            <option value="">Tất cả địa phương</option>
            {provinces.map((item) => (
              <option key={item.province} value={item.province}>{item.province}</option>
            ))}
          </select>
          <select className="form-input" name="status" defaultValue={searchParams.status ?? ""}>
            <option value="">Đang gây quỹ + hoàn thành</option>
            <option value="ACTIVE">Đang gây quỹ</option>
            <option value="COMPLETED">Hoàn thành</option>
          </select>
          <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white">Lọc</button>
        </form>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>

      {!campaigns.length ? (
        <div className="mt-8">
          <EmptyState title="Không tìm thấy chiến dịch phù hợp" description="Thử bỏ bớt bộ lọc hoặc quay lại danh sách chiến dịch công khai." actionHref="/campaigns" actionLabel="Xóa bộ lọc" />
        </div>
      ) : null}
    </div>
  );
}

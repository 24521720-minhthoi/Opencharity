import { CampaignForm } from "@/components/forms/campaign-form";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function NewCampaignPage() {
  await requireUser(["CHARITY"]);
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="page-shell">
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <DashboardNav type="organization" />
        <Card className="p-6">
          <h1 className="text-3xl font-semibold">Tạo chiến dịch mới</h1>
          <p className="section-lead">Biểu mẫu yêu cầu đủ thông tin để admin đánh giá: mục tiêu, ngân sách, đơn vị thụ hưởng, ảnh và kế hoạch sử dụng quỹ.</p>
          <div className="mt-6">
            <CampaignForm categories={categories} />
          </div>
        </Card>
      </div>
    </div>
  );
}

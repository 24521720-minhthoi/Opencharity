import { redirect } from "next/navigation";
import { DonationForm } from "@/components/forms/donation-form";
import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DonatePage({ params }: { params: { slug: string } }) {
  await requireUser(["DONOR", "ADMIN", "PARTNER"]);
  const campaign = await prisma.campaign.findUnique({
    where: { slug: params.slug },
    include: { organization: true }
  });

  if (!campaign || campaign.status !== "ACTIVE") redirect("/campaigns");

  return (
    <div className="page-shell">
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[1fr_0.9fr]">
        <Card className="overflow-hidden">
          <img src={campaign.imageUrl} alt={campaign.title} className="h-64 w-full object-cover" />
          <div className="p-6">
            <p className="text-sm text-slate-500">Bạn đang ủng hộ</p>
            <h1 className="mt-2 text-2xl font-semibold text-slate-950">{campaign.title}</h1>
            <div className="mt-5 grid gap-3 rounded-lg bg-slate-50 p-4 text-sm">
              <div className="flex justify-between gap-3">
                <span>Mục tiêu</span>
                <strong>{formatCurrency(campaign.targetAmount)}</strong>
              </div>
              <div className="flex justify-between gap-3">
                <span>Đã ghi nhận</span>
                <strong>{formatCurrency(campaign.currentAmount)}</strong>
              </div>
              <div className="flex justify-between gap-3">
                <span>Tổ chức</span>
                <strong>{campaign.organization.name}</strong>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-600">
              Đây là payment success flow giả lập phục vụ demo. Hệ thống vẫn tạo giao dịch, biên nhận, audit log và cập nhật tiến độ như một luồng thương mại điện tử thật.
            </p>
          </div>
        </Card>
        <Card className="p-6">
          <DonationForm campaignId={campaign.id} campaignTitle={campaign.title} />
        </Card>
      </div>
    </div>
  );
}

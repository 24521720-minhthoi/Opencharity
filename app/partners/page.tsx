import { BadgeCheck, Handshake, Truck, WalletCards } from "lucide-react";
import { PartnerForm } from "@/components/forms/partner-form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PartnersPage() {
  const partners = await prisma.partner.findMany({
    where: { status: "VERIFIED" },
    orderBy: [{ tier: "asc" }, { createdAt: "asc" }]
  });

  return (
    <div className="page-shell">
      <div className="grid gap-8 md:grid-cols-[1fr_0.8fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">Partner network</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal text-slate-950">Doanh nghiệp đồng hành cùng dữ liệu tác động.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            OpenCharity cho phép doanh nghiệp tham gia CSR theo cách có thể đối soát: matching fund, tài trợ hạ tầng, logistics, truyền thông và kiểm chứng kết quả.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80"
          alt="Đối tác doanh nghiệp"
          className="h-80 w-full rounded-lg object-cover shadow-soft"
        />
      </div>

      <section className="mt-10 grid gap-5 md:grid-cols-3">
        <Card className="p-5">
          <WalletCards className="h-7 w-7 text-primary" />
          <h2 className="mt-4 font-semibold">Matching fund</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Doanh nghiệp cam kết nhân đôi khoản ủng hộ theo chiến dịch, ngành hàng hoặc khu vực.</p>
        </Card>
        <Card className="p-5">
          <Truck className="h-7 w-7 text-primary" />
          <h2 className="mt-4 font-semibold">Logistics và vận hành</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Hỗ trợ giao nhận, kho bãi, kiểm đếm và biên bản bàn giao cho tổ chức thiện nguyện.</p>
        </Card>
        <Card className="p-5">
          <BadgeCheck className="h-7 w-7 text-primary" />
          <h2 className="mt-4 font-semibold">Uy tín dữ liệu</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Mỗi đóng góp được gắn với báo cáo tác động, audit trail và trạng thái đối soát.</p>
        </Card>
      </section>

      <section className="mt-10 grid gap-8 lg:grid-cols-[1fr_420px]">
        <div>
          <h2 className="section-title">Đối tác đang đồng hành</h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {partners.map((partner) => (
              <Card key={partner.id} className="p-5">
                <div className="flex items-center justify-between gap-4">
                  <img src={partner.logoUrl ?? "https://dummyimage.com/240x120/e2e8f0/0f172a&text=Partner"} alt={partner.name} className="h-16 w-36 rounded-md object-cover" />
                  <Badge tone="success">{partner.tier}</Badge>
                </div>
                <h3 className="mt-4 text-lg font-semibold">{partner.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{partner.contribution}</p>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Handshake className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Đăng ký hợp tác</h2>
          </div>
          <PartnerForm />
        </div>
      </section>
    </div>
  );
}

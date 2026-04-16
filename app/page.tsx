import { ArrowRight, BadgeCheck, BarChart3, FileCheck2, Handshake, ShieldCheck } from "lucide-react";
import { CampaignCard } from "@/components/campaign-card";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { getFeaturedCampaigns, getPlatformStats } from "@/lib/data";
import { formatCompactCurrency } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const [stats, featured, partners] = await Promise.all([
    getPlatformStats(),
    getFeaturedCampaigns(3),
    prisma.partner.findMany({ where: { status: "VERIFIED" }, take: 4, orderBy: { createdAt: "asc" } })
  ]);

  return (
    <>
      <section className="border-b bg-white/80">
        <div className="container grid min-h-[calc(100vh-8rem)] items-center gap-10 py-10 md:grid-cols-[1.04fr_0.96fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md border bg-white px-3 py-1 text-sm text-slate-600">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Nền tảng thương mại điện tử thiện nguyện B2B2C
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-normal text-slate-950 md:text-6xl">
              Biến thiện nguyện online thành một quy trình có thể kiểm chứng.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              OpenCharity kết nối người ủng hộ, tổ chức thiện nguyện và doanh nghiệp đồng hành bằng chiến dịch, giao dịch, biên nhận, minh chứng và audit log minh bạch.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/campaigns" size="lg">
                Khám phá chiến dịch
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/transparency" variant="outline" size="lg">
                Xem minh bạch dữ liệu
              </ButtonLink>
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1300&q=80"
              alt="Tình nguyện viên cộng đồng"
              className="h-[440px] w-full rounded-lg object-cover shadow-soft"
            />
            <div className="absolute bottom-4 left-4 right-4 grid gap-3 rounded-lg bg-white/94 p-4 shadow-soft backdrop-blur md:grid-cols-3">
              <div>
                <p className="text-xs text-slate-500">Tổng ủng hộ</p>
                <p className="mt-1 font-semibold text-slate-950">{formatCompactCurrency(stats.totalDonation)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Giao dịch</p>
                <p className="mt-1 font-semibold text-slate-950">{stats.donationCount}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Minh chứng duyệt</p>
                <p className="mt-1 font-semibold text-slate-950">{stats.approvedUpdates}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell">
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard label="Chiến dịch công khai" value={stats.campaigns.toString()} helper="Đã qua kiểm duyệt nền tảng" icon={<FileCheck2 className="h-5 w-5" />} />
          <StatCard label="Tổng giá trị ủng hộ" value={formatCompactCurrency(stats.totalDonation)} helper="Cộng dồn giao dịch thành công" icon={<BarChart3 className="h-5 w-5" />} />
          <StatCard label="Tổ chức xác minh" value={stats.organizations.toString()} helper="Có hồ sơ và điểm minh bạch" icon={<BadgeCheck className="h-5 w-5" />} />
          <StatCard label="Chiến dịch hoàn thành" value={stats.completedCampaigns.toString()} helper="Có cập nhật kết quả công khai" icon={<ShieldCheck className="h-5 w-5" />} />
        </div>
      </section>

      <section className="page-shell pt-2">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="section-title">Chiến dịch nổi bật</h2>
            <p className="section-lead">Các chiến dịch được ưu tiên vì có hồ sơ minh bạch, tiến độ rõ và logic tác động xã hội có thể đo lường.</p>
          </div>
          <ButtonLink href="/campaigns" variant="outline">Xem tất cả</ButtonLink>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {featured.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </section>

      <section className="border-y bg-white">
        <div className="container grid gap-8 py-12 md:grid-cols-4">
          {[
            ["1. Tổ chức gửi hồ sơ", "Tổ chức tạo chiến dịch, nêu mục tiêu, ngân sách, đơn vị thụ hưởng và cơ chế minh chứng."],
            ["2. Admin kiểm duyệt", "OpenCharity kiểm tra hồ sơ, trạng thái pháp lý, rủi ro, kế hoạch đối soát trước khi public."],
            ["3. Donor ủng hộ", "Người dùng thanh toán sandbox, nhận biên nhận và theo dõi tiến độ gây quỹ theo thời gian thực."],
            ["4. Công khai minh chứng", "Tổ chức gửi cập nhật sử dụng quỹ, admin duyệt, public xem audit trail và báo cáo minh bạch."]
          ].map(([title, content]) => (
            <Card key={title} className="shadow-none">
              <CardHeader>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-slate-600">{content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="page-shell">
        <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 className="section-title">Đối tác đồng hành</h2>
            <p className="section-lead">Doanh nghiệp không chỉ tài trợ tiền, mà còn tham gia matching fund, logistics, hạ tầng công nghệ và đối soát tài chính.</p>
            <ButtonLink href="/partners" className="mt-6" variant="secondary">
              Trở thành đối tác
              <Handshake className="h-4 w-4" />
            </ButtonLink>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {partners.map((partner) => (
              <Card key={partner.id} className="p-5">
                <img src={partner.logoUrl ?? "https://dummyimage.com/240x120/e2e8f0/0f172a&text=Partner"} alt={partner.name} className="h-16 w-36 rounded-md object-cover" />
                <h3 className="mt-4 font-semibold text-slate-950">{partner.name}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{partner.contribution}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

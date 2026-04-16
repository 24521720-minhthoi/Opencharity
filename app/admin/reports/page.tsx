import { FileDown, Presentation, ShieldCheck } from "lucide-react";
import { DashboardNav } from "@/components/layout/dashboard-nav";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { getPlatformStats } from "@/lib/data";
import { formatCompactCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  await requireUser(["ADMIN"]);
  const stats = await getPlatformStats();

  return (
    <div className="page-shell">
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <DashboardNav type="admin" />
        <div className="grid gap-6">
          <Card className="p-6">
            <p className="text-sm font-semibold uppercase tracking-normal text-primary">Demo report center</p>
            <h1 className="mt-2 text-3xl font-semibold">Quản lý báo cáo demo</h1>
            <p className="section-lead">Trang này gom các số liệu quan trọng để nhóm thuyết trình nhanh trước giảng viên: KPI, quy trình, vai trò và bằng chứng minh bạch.</p>
          </Card>

          <div className="grid gap-5 md:grid-cols-3">
            <Card className="p-5">
              <ShieldCheck className="h-7 w-7 text-primary" />
              <h2 className="mt-4 font-semibold">KPI nền tảng</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {stats.campaigns} chiến dịch công khai, {stats.donationCount} giao dịch, tổng {formatCompactCurrency(stats.totalDonation)}.
              </p>
            </Card>
            <Card className="p-5">
              <Presentation className="h-7 w-7 text-primary" />
              <h2 className="mt-4 font-semibold">Luồng demo gợi ý</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Public xem chiến dịch, donor ủng hộ, organization gửi minh chứng, admin duyệt và transparency thay đổi.</p>
            </Card>
            <Card className="p-5">
              <FileDown className="h-7 w-7 text-primary" />
              <h2 className="mt-4 font-semibold">Báo cáo mô phỏng</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Trong MVP, export được mô phỏng bằng trang báo cáo để giảm rủi ro môi trường khi demo.</p>
            </Card>
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-semibold">Checklist thuyết trình</h2>
            <div className="mt-5 grid gap-3 text-sm text-slate-700">
              <p>1. Giải thích OpenCharity là marketplace thiện nguyện, không phải landing page.</p>
              <p>2. Chứng minh RBAC bằng 3 tài khoản: donor, charity, admin.</p>
              <p>3. Chạy donation flow để số tiền và audit log tăng.</p>
              <p>4. Duyệt campaign/update để public data thay đổi có kiểm soát.</p>
              <p>5. Mở transparency để cho thấy giao dịch, receipt, minh chứng và audit trail.</p>
            </div>
            <ButtonLink href="/transparency" className="mt-6" variant="secondary">Mở transparency center</ButtonLink>
          </Card>
        </div>
      </div>
    </div>
  );
}

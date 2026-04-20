import { useEffect, useState } from "react";
import { ArrowRight, PackageCheck, ShieldCheck, Truck, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import { apiFetch } from "@/lib/api.js";
import { money } from "@/lib/format.js";
import { CampaignCard } from "@/components/CampaignCard.jsx";
import { StatCard } from "@/components/StatCard.jsx";

export function Home() {
  const [stats, setStats] = useState(null);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    Promise.all([apiFetch("/stats"), apiFetch("/campaigns")]).then(([statsData, campaignData]) => {
      setStats(statsData);
      setCampaigns(campaignData.slice(0, 3));
    });
  }, []);

  return (
    <>
      <section className="border-b border-slate-200 bg-white">
        <div className="container grid min-h-[calc(100vh-5rem)] items-center gap-10 py-8 md:grid-cols-[0.95fr_1.05fr] md:py-10">
          <div>
            <span className="inline-flex rounded-md bg-teal-soft px-3 py-1 text-sm font-semibold text-teal-ink">
              B2B2C · Tài trợ vật phẩm · Proof of Delivery
            </span>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight text-slate-950 md:text-6xl">
              Chọn vật phẩm cần thiết, theo dõi giao nhận, xem bằng chứng minh bạch.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              OpenCharity kết nối tổ chức thiện nguyện, nhà hảo tâm và nhà cung cấp để thay thế quyên tiền trực tiếp bằng tài trợ vật phẩm có thể truy vết.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/campaigns" className="btn-primary">
                Tài trợ vật phẩm <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/transparency" className="btn-outline">
                Xem Proof of Transparency
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft">
              <img
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1400&q=80"
                alt="Tình nguyện viên sắp xếp vật phẩm thiện nguyện"
                className="h-72 w-full object-cover md:h-80"
              />
              <div className="grid gap-3 p-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-slate-500">Giá trị vật phẩm</p>
                  <p className="mt-1 font-semibold text-slate-950">{money(stats?.sponsoredValue || 0)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Đơn đã tạo</p>
                  <p className="mt-1 font-semibold text-slate-950">{stats?.orderCount || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">POD đã duyệt</p>
                  <p className="mt-1 font-semibold text-slate-950">{stats?.approvedPods || 0}</p>
                </div>
              </div>
            </div>
            <p className="text-sm leading-6 text-slate-500">
              Trang đầu tiên đã là trải nghiệm chính: donor có thể vào chiến dịch, chọn vật phẩm, thanh toán sandbox và theo dõi giao nhận.
            </p>
          </div>
        </div>
      </section>

      <section className="shell">
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard label="Chiến dịch công khai" value={stats?.activeCampaigns || 0} helper="Đã qua admin review" icon={<ShieldCheck className="h-5 w-5" />} />
          <StatCard label="Supplier xác minh" value={stats?.suppliers || 0} helper="Nhận đơn và giao trực tiếp" icon={<Truck className="h-5 w-5" />} />
          <StatCard label="Người dùng demo" value={stats?.users || 0} helper="Có đủ bốn vai trò" icon={<UsersRound className="h-5 w-5" />} />
          <StatCard label="Đang vận chuyển" value={stats?.activeDeliveries || 0} helper="Theo dõi trạng thái near real-time" icon={<PackageCheck className="h-5 w-5" />} />
        </div>
      </section>

      <section className="shell pt-0">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="section-title">Chiến dịch cần tài trợ vật phẩm</h2>
            <p className="section-lead">Mỗi chiến dịch hiển thị rõ tổ chức tiếp nhận, danh sách vật phẩm, supplier phụ trách, tiến độ và dữ liệu đối soát.</p>
          </div>
          <Link to="/campaigns" className="btn-outline">Xem tất cả</Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign._id} campaign={campaign} />
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="container grid gap-4 py-10 md:grid-cols-4">
          {[
            ["1. Charity tạo nhu cầu", "Tổ chức thiện nguyện khai báo chiến dịch, vật phẩm, địa điểm tiếp nhận và hồ sơ minh chứng."],
            ["2. Admin kiểm duyệt", "Platform operator xác minh chiến dịch, supplier, nội dung minh bạch trước khi công khai."],
            ["3. Donor tài trợ vật phẩm", "Nhà hảo tâm chọn vật phẩm, thêm vào giỏ và thanh toán MoMo Sandbox mô phỏng."],
            ["4. Supplier giao hàng + POD", "Supplier cập nhật trạng thái; tổ chức upload Proof of Delivery để admin xác thực."]
          ].map(([title, content]) => (
            <div key={title} className="rounded-lg border border-slate-200 bg-slate-50 p-5">
              <h3 className="font-semibold text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{content}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

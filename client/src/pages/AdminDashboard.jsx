import { useEffect, useState } from "react";
import { FileCheck2, PackageCheck, ShieldCheck, UsersRound } from "lucide-react";
import { apiFetch } from "@/lib/api.js";
import { money, shortDate } from "@/lib/format.js";
import { StatCard } from "@/components/StatCard.jsx";
import { StatusBadge } from "@/components/StatusBadge.jsx";

export function AdminDashboard() {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");

  async function load() {
    setData(await apiFetch("/admin/dashboard"));
  }

  useEffect(() => {
    load();
  }, []);

  async function reviewCampaign(id, status) {
    await apiFetch(`/admin/campaigns/${id}`, {
      method: "PATCH",
      body: { status, reviewNote: status === "ACTIVE" ? "Đủ hồ sơ demo, công khai chiến dịch." : "Cần bổ sung hồ sơ." }
    });
    setMessage("Đã cập nhật kiểm duyệt chiến dịch.");
    await load();
  }

  async function reviewProof(id, status) {
    await apiFetch(`/admin/proofs/${id}`, {
      method: "PATCH",
      body: { status, note: status === "APPROVED" ? "POD hợp lệ và được công khai." : "POD cần bổ sung." }
    });
    setMessage("Đã cập nhật kiểm duyệt POD.");
    await load();
  }

  const stats = data?.stats || {};

  return (
    <section className="shell">
      <h1 className="section-title">Dashboard quản trị nền tảng</h1>
      <p className="section-lead">Admin/Platform Operator kiểm duyệt chiến dịch, người dùng, supplier, giao dịch mô phỏng và nội dung minh bạch.</p>
      {message ? <p className="mt-5 rounded-md bg-teal-soft px-4 py-3 font-medium text-teal-ink">{message}</p> : null}

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <StatCard label="Giá trị tài trợ" value={money(stats.sponsoredValue || 0)} helper="Đơn không bị hủy" icon={<PackageCheck className="h-5 w-5" />} />
        <StatCard label="Chiến dịch public" value={stats.activeCampaigns || 0} helper="ACTIVE hoặc COMPLETED" icon={<ShieldCheck className="h-5 w-5" />} />
        <StatCard label="User active" value={stats.users || 0} helper="Bao gồm 4 vai trò" icon={<UsersRound className="h-5 w-5" />} />
        <StatCard label="POD đã duyệt" value={stats.approvedPods || 0} helper="Evidence công khai" icon={<FileCheck2 className="h-5 w-5" />} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="panel p-5">
          <h2 className="text-xl font-semibold text-slate-950">Kiểm duyệt chiến dịch</h2>
          <div className="mt-4 grid max-h-[520px] gap-3 overflow-auto pr-1">
            {(data?.campaigns || []).map((campaign) => (
              <div key={campaign._id} className="rounded-md border border-slate-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">{campaign.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{campaign.organization?.name} · {money(campaign.metrics.targetValue)}</p>
                  </div>
                  <StatusBadge status={campaign.status} />
                </div>
                {campaign.status === "PENDING_REVIEW" ? (
                  <div className="mt-4 flex gap-2">
                    <button className="btn-primary" onClick={() => reviewCampaign(campaign._id, "ACTIVE")}>Duyệt</button>
                    <button className="btn-outline" onClick={() => reviewCampaign(campaign._id, "REJECTED")}>Từ chối</button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-5">
          <h2 className="text-xl font-semibold text-slate-950">Xác thực Proof of Delivery</h2>
          <div className="mt-4 grid max-h-[520px] gap-3 overflow-auto pr-1">
            {(data?.proofs || []).map((proof) => (
              <div key={proof._id} className="rounded-md border border-slate-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-900">{proof.campaign?.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{proof.organization?.name} · {shortDate(proof.receivedAt)}</p>
                  </div>
                  <StatusBadge status={proof.status} />
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{proof.note}</p>
                {proof.status === "PENDING_REVIEW" ? (
                  <div className="mt-4 flex gap-2">
                    <button className="btn-primary" onClick={() => reviewProof(proof._id, "APPROVED")}>Duyệt POD</button>
                    <button className="btn-outline" onClick={() => reviewProof(proof._id, "REJECTED")}>Từ chối</button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="panel p-5">
          <h2 className="text-xl font-semibold text-slate-950">Giao dịch và đơn hàng</h2>
          <div className="mt-4 table-wrap">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Donor</th>
                  <th className="px-4 py-3">Supplier</th>
                  <th className="px-4 py-3">Giá trị</th>
                  <th className="px-4 py-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {(data?.orders || []).slice(0, 12).map((order) => (
                  <tr key={order._id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-medium text-slate-900">{order.orderCode}</td>
                    <td className="px-4 py-3 text-slate-600">{order.donor?.name}</td>
                    <td className="px-4 py-3 text-slate-600">{order.supplier?.name}</td>
                    <td className="px-4 py-3 text-slate-600">{money(order.totalAmount)}</td>
                    <td className="px-4 py-3"><StatusBadge status={order.deliveryStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel p-5">
          <h2 className="text-xl font-semibold text-slate-950">Audit log</h2>
          <div className="mt-4 grid gap-3">
            {(data?.logs || []).slice(0, 12).map((log) => (
              <div key={log._id} className="border-l-2 border-teal-brand pl-3">
                <p className="text-sm font-semibold text-slate-900">{log.action}</p>
                <p className="mt-1 text-xs text-slate-500">{shortDate(log.createdAt)} · {log.actor?.name || "System"} · {log.entityType}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

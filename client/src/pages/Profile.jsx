import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api.js";
import { money, shortDate } from "@/lib/format.js";
import { StatusBadge } from "@/components/StatusBadge.jsx";
import { useAuth } from "@/context/AuthContext.jsx";

export function Profile() {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    apiFetch("/profile").then(setData);
  }, []);

  return (
    <section className="shell">
      <h1 className="section-title">User Profile & Impact</h1>
      <p className="section-lead">Nhà hảo tâm theo dõi tổng giá trị vật phẩm đã tài trợ, đơn hàng và trạng thái giao nhận.</p>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <div className="panel p-5 md:col-span-1">
          <h2 className="text-xl font-semibold text-slate-950">{user?.name}</h2>
          <p className="mt-1 text-sm text-slate-500">{user?.email}</p>
          <p className="mt-4 rounded-md bg-teal-soft px-3 py-2 text-sm font-semibold text-teal-ink">{user?.role}</p>
          <div className="mt-5 border-t border-slate-100 pt-4">
            <p className="text-sm text-slate-500">Tổng giá trị đã tài trợ</p>
            <p className="mt-1 text-2xl font-semibold text-slate-950">{money(data?.user?.impact?.totalSponsored || 0)}</p>
          </div>
        </div>

        <div className="panel p-5 md:col-span-2">
          <h2 className="text-xl font-semibold text-slate-950">Đóng góp gần đây</h2>
          <div className="mt-4 grid gap-3">
            {(data?.orders || []).map((order) => (
              <div key={order._id} className="rounded-md border border-slate-100 p-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-semibold text-slate-900">{order.orderCode}</p>
                  <StatusBadge status={order.deliveryStatus} />
                </div>
                <p className="mt-1 text-sm text-slate-500">{order.campaign?.title} · {shortDate(order.createdAt)}</p>
                <p className="mt-1 text-sm font-medium text-teal-ink">{money(order.totalAmount)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

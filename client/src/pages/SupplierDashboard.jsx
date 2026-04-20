import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api.js";
import { money, shortDate } from "@/lib/format.js";
import { StatusBadge } from "@/components/StatusBadge.jsx";

const statuses = ["SUPPLIER_PROCESSING", "PACKED", "IN_TRANSIT", "DELIVERED"];

export function SupplierDashboard() {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState("");

  async function load() {
    setData(await apiFetch("/supplier/dashboard"));
  }

  useEffect(() => {
    load();
  }, []);

  async function update(orderId, status) {
    await apiFetch(`/orders/${orderId}/delivery`, {
      method: "PATCH",
      body: { status, note: "Supplier cập nhật trạng thái trong demo." }
    });
    setMessage("Đã cập nhật trạng thái giao nhận.");
    await load();
  }

  return (
    <section className="shell">
      <h1 className="section-title">Supplier Dashboard</h1>
      <p className="section-lead">Nhà cung cấp nhận đơn mua sắm, xử lý đơn, cập nhật vận chuyển và đánh dấu đã giao hàng.</p>
      {message ? <p className="mt-5 rounded-md bg-teal-soft px-4 py-3 font-medium text-teal-ink">{message}</p> : null}

      <div className="mt-8 grid gap-6">
        {(data?.orders || []).map((order) => (
          <article key={order._id} className="panel p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">{order.orderCode}</h2>
                <p className="mt-1 text-sm text-slate-500">{order.campaign?.title}</p>
              </div>
              <StatusBadge status={order.deliveryStatus} />
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-4">
              <div>
                <p className="text-xs text-slate-500">Donor</p>
                <p className="mt-1 font-medium text-slate-900">{order.donor?.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Nơi nhận</p>
                <p className="mt-1 font-medium text-slate-900">{order.organization?.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Giá trị</p>
                <p className="mt-1 font-medium text-slate-900">{money(order.totalAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Ngày tạo</p>
                <p className="mt-1 font-medium text-slate-900">{shortDate(order.createdAt)}</p>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {statuses.map((status) => (
                <button key={status} className="btn-outline" onClick={() => update(order._id, status)}>
                  {status}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

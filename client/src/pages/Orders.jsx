import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api.js";
import { money, shortDate, statusText } from "@/lib/format.js";
import { StatusBadge } from "@/components/StatusBadge.jsx";

export function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/orders").then(setOrders).catch((err) => setError(err.message));
  }, []);

  return (
    <section className="shell">
      <h1 className="section-title">Đơn hàng và giao nhận</h1>
      <p className="section-lead">Donor xem được order, supplier, trạng thái giao nhận và timeline trước khi POD được công khai.</p>

      {error ? <p className="mt-6 rounded-md bg-rose-50 px-4 py-3 text-rose-700">{error}</p> : null}

      <div className="mt-8 grid gap-5">
        {orders.map((order) => (
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
                <p className="text-xs text-slate-500">Nhà cung cấp</p>
                <p className="mt-1 font-medium text-slate-900">{order.supplier?.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Tổ chức nhận</p>
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
            <div className="mt-5 grid gap-2">
              {order.items.map((item) => (
                <div key={item.requestedItem} className="flex justify-between rounded-md bg-slate-50 px-3 py-2 text-sm">
                  <span>{item.name} × {item.quantity} {item.unit}</span>
                  <strong>{money(item.subtotal)}</strong>
                </div>
              ))}
            </div>
            {order.delivery?.timeline?.length ? (
              <div className="mt-5 border-t border-slate-100 pt-4">
                <h3 className="text-sm font-semibold text-slate-950">Timeline giao nhận</h3>
                <div className="mt-3 grid gap-3">
                  {order.delivery.timeline.map((step, index) => (
                    <div key={`${step.status}-${index}`} className="grid gap-1 border-l-2 border-teal-brand pl-3">
                      <p className="text-sm font-medium text-slate-900">{statusText(step.status)} · {step.label}</p>
                      <p className="text-xs text-slate-500">{shortDate(step.at)} · {step.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

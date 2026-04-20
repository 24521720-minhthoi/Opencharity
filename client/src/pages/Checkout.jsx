import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { apiFetch } from "@/lib/api.js";
import { money, sumCart } from "@/lib/format.js";

export function Checkout() {
  const [cart, setCart] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/cart").then(setCart).catch((err) => setError(err.message));
  }, []);

  async function pay() {
    setLoading(true);
    setError("");
    try {
      const data = await apiFetch("/checkout", { method: "POST", body: { provider: "MOMO_SANDBOX" } });
      setOrders(data.orders);
      setCart({ items: [] });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (orders.length) {
    return (
      <section className="shell">
        <div className="panel p-8">
          <CheckCircle2 className="h-12 w-12 text-teal-ink" />
          <h1 className="mt-4 text-3xl font-semibold text-slate-950">Thanh toán sandbox thành công</h1>
          <p className="mt-3 max-w-2xl leading-7 text-slate-600">
            Hệ thống đã tạo đơn mua sắm, payment record, delivery record và cập nhật tiến độ vật phẩm của chiến dịch.
          </p>
          <div className="mt-6 grid gap-3">
            {orders.map((order) => (
              <div key={order._id} className="rounded-md border border-slate-200 p-4">
                <p className="font-semibold text-slate-950">{order.orderCode}</p>
                <p className="mt-1 text-sm text-slate-600">{money(order.totalAmount)} · Chờ supplier xử lý</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/orders" className="btn-primary">Theo dõi đơn hàng</Link>
            <Link to="/transparency" className="btn-outline">Xem minh bạch</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="shell">
      <h1 className="section-title">Thanh toán MoMo Sandbox mô phỏng</h1>
      <p className="section-lead">Prototype không xử lý tiền thật. Flow này tạo dữ liệu Payment, Order, Delivery và Audit để minh họa sandbox đúng phạm vi báo cáo.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="panel p-5">
          <h2 className="text-xl font-semibold text-slate-950">Thông tin thanh toán</h2>
          <div className="mt-5 grid gap-4">
            <label>
              <span className="label">Phương thức</span>
              <select className="field mt-1" defaultValue="MOMO_SANDBOX">
                <option value="MOMO_SANDBOX">MoMo Sandbox</option>
              </select>
            </label>
            <label>
              <span className="label">Mã giao dịch mô phỏng</span>
              <input className="field mt-1" value="Tự sinh sau khi xác nhận" readOnly />
            </label>
            <div className="rounded-lg bg-teal-soft p-4 text-sm leading-6 text-teal-ink">
              <ShieldCheck className="mb-2 h-5 w-5" />
              Dữ liệu sau thanh toán sẽ được đối soát trạng thái `MATCHED`, không chuyển tiền thật và không gọi gateway production.
            </div>
          </div>
        </div>

        <aside className="panel h-fit p-5">
          <h2 className="text-xl font-semibold text-slate-950">Đơn tài trợ</h2>
          <div className="mt-4 space-y-3">
            {(cart?.items || []).map(({ requestedItem, quantity }) => (
              <div key={requestedItem._id} className="flex justify-between gap-3 text-sm">
                <span className="text-slate-600">{requestedItem.name} × {quantity}</span>
                <strong>{money(requestedItem.unitPrice * quantity)}</strong>
              </div>
            ))}
          </div>
          <div className="mt-5 border-t border-slate-100 pt-5">
            <div className="flex justify-between text-lg font-semibold text-slate-950">
              <span>Tổng</span>
              <span>{money(sumCart(cart))}</span>
            </div>
          </div>
          {error ? <p className="mt-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}
          <button className="btn-amber mt-5 w-full" disabled={loading || !cart?.items?.length} onClick={pay}>
            {loading ? "Đang xử lý..." : "Xác nhận sandbox payment"}
          </button>
        </aside>
      </div>
    </section>
  );
}

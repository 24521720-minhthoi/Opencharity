import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { apiFetch } from "@/lib/api.js";
import { money, sumCart } from "@/lib/format.js";

export function Cart() {
  const [cart, setCart] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    try {
      setCart(await apiFetch("/cart"));
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function removeItem(id) {
    await apiFetch(`/cart/items/${id}`, { method: "DELETE" });
    await load();
  }

  if (error) {
    return (
      <section className="shell">
        <div className="panel p-6">
          <h1 className="section-title">Giỏ tài trợ</h1>
          <p className="mt-3 text-slate-600">{error}</p>
          <Link to="/login" className="btn-primary mt-5">Đăng nhập donor</Link>
        </div>
      </section>
    );
  }

  const items = cart?.items || [];

  return (
    <section className="shell">
      <h1 className="section-title">Giỏ tài trợ vật phẩm</h1>
      <p className="section-lead">Giỏ hàng phản ánh đúng logic e-commerce của báo cáo, nhưng sản phẩm ở đây là vật phẩm thiện nguyện cần truy vết giao nhận.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="grid gap-4">
          {items.length ? (
            items.map(({ requestedItem, quantity }) => (
              <div key={requestedItem._id} className="panel grid gap-4 p-4 sm:grid-cols-[120px_1fr_auto]">
                <img src={requestedItem.imageUrl} alt={requestedItem.name} className="h-28 w-full rounded-md object-cover" />
                <div>
                  <h2 className="font-semibold text-slate-950">{requestedItem.name}</h2>
                  <p className="mt-1 text-sm text-slate-500">{requestedItem.campaign?.title}</p>
                  <p className="mt-2 text-sm text-slate-600">Supplier: {requestedItem.supplier?.name}</p>
                  <p className="mt-2 text-sm font-medium text-teal-ink">
                    {quantity} {requestedItem.unit} × {money(requestedItem.unitPrice)}
                  </p>
                </div>
                <button className="btn-outline self-start px-3" onClick={() => removeItem(requestedItem._id)}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="panel p-6">
              <p className="text-slate-600">Giỏ tài trợ đang trống.</p>
              <Link to="/campaigns" className="btn-primary mt-4">Chọn chiến dịch</Link>
            </div>
          )}
        </div>

        <aside className="panel h-fit p-5">
          <h2 className="text-xl font-semibold text-slate-950">Tóm tắt tài trợ</h2>
          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <div className="flex justify-between"><span>Số nhóm vật phẩm</span><strong>{items.length}</strong></div>
            <div className="flex justify-between"><span>Payment flow</span><strong>MoMo Sandbox</strong></div>
            <div className="flex justify-between"><span>Đối soát</span><strong>Auto matched</strong></div>
          </div>
          <div className="mt-5 border-t border-slate-100 pt-5">
            <div className="flex items-center justify-between text-lg font-semibold text-slate-950">
              <span>Tổng giá trị</span>
              <span>{money(sumCart(cart))}</span>
            </div>
          </div>
          <Link to="/checkout" className={`btn-amber mt-5 w-full ${items.length ? "" : "pointer-events-none opacity-60"}`}>
            Thanh toán mô phỏng
          </Link>
        </aside>
      </div>
    </section>
  );
}

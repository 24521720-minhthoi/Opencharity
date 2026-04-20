import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CheckCircle2, ShoppingCart, Truck } from "lucide-react";
import { apiFetch } from "@/lib/api.js";
import { money, shortDate, statusText } from "@/lib/format.js";
import { Progress } from "@/components/Progress.jsx";
import { StatusBadge } from "@/components/StatusBadge.jsx";
import { useAuth } from "@/context/AuthContext.jsx";

export function CampaignDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [campaign, setCampaign] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    apiFetch(`/campaigns/${slug}`).then(setCampaign);
  }, [slug]);

  async function addToCart(item, quantity) {
    if (!user) {
      setMessage("Vui lòng đăng nhập tài khoản donor để thêm vật phẩm vào giỏ.");
      return;
    }
    if (user.role !== "DONOR") {
      setMessage("Chỉ tài khoản donor mới có thể tài trợ vật phẩm.");
      return;
    }
    await apiFetch("/cart/items", {
      method: "POST",
      body: { requestedItemId: item._id, quantity }
    });
    setMessage(`Đã thêm ${quantity} ${item.unit} ${item.name} vào giỏ tài trợ.`);
  }

  if (!campaign) {
    return <section className="shell"><p>Đang tải chiến dịch...</p></section>;
  }

  return (
    <section className="shell">
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <img src={campaign.imageUrl} alt={campaign.title} className="h-80 w-full rounded-lg object-cover shadow-panel" />
          <div className="mt-6 flex flex-wrap gap-2">
            <StatusBadge status={campaign.status} />
            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{campaign.category}</span>
            <span className="rounded-md bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-ink">POD bắt buộc</span>
          </div>
          <h1 className="mt-4 text-3xl font-semibold leading-tight text-slate-950 md:text-5xl">{campaign.title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">{campaign.summary}</p>
          <div className="mt-6 panel p-5">
            <Progress value={campaign.metrics.progress} />
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-slate-500">Đã tài trợ</p>
                <p className="font-semibold text-slate-950">{money(campaign.metrics.fundedValue)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Mục tiêu vật phẩm</p>
                <p className="font-semibold text-slate-950">{money(campaign.metrics.targetValue)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Tiến độ</p>
                <p className="font-semibold text-teal-ink">{campaign.metrics.progress}%</p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-5">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Mô tả chiến dịch</h2>
              <p className="mt-3 leading-7 text-slate-600">{campaign.description}</p>
            </div>
            <div className="panel p-5">
              <h2 className="text-xl font-semibold text-slate-950">Tổ chức tiếp nhận</h2>
              <p className="mt-2 font-medium text-slate-900">{campaign.organization?.name}</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{campaign.organization?.mission}</p>
              <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                <span>Địa phương: {campaign.province}</span>
                <span>Người thụ hưởng: {campaign.beneficiary}</span>
                <span>Điểm minh bạch: {campaign.transparencyScore}/100</span>
                <span>Kết thúc: {shortDate(campaign.endDate)}</span>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="panel p-5">
            <h2 className="text-xl font-semibold text-slate-950">Chọn vật phẩm tài trợ</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Donor tài trợ từng vật phẩm; supplier giao trực tiếp đến tổ chức tiếp nhận.</p>
            {message ? <p className="mt-4 rounded-md bg-teal-soft px-3 py-2 text-sm font-medium text-teal-ink">{message}</p> : null}
            <div className="mt-5 grid gap-4">
              {campaign.items.map((item) => {
                const remaining = Math.max(0, item.quantityNeeded - item.quantityFunded);
                const defaultQty = Math.min(remaining || 1, 3);
                return (
                  <ItemSponsor key={item._id} item={item} defaultQty={defaultQty} remaining={remaining} onAdd={addToCart} />
                );
              })}
            </div>
            <Link to="/cart" className="btn-amber mt-5 w-full">
              Mở giỏ tài trợ <ShoppingCart className="h-4 w-4" />
            </Link>
          </div>

          <div className="panel p-5">
            <h2 className="text-xl font-semibold text-slate-950">Theo dõi giao nhận gần đây</h2>
            <div className="mt-4 grid gap-3">
              {campaign.recentOrders?.slice(0, 5).map((order) => (
                <div key={order._id} className="rounded-md border border-slate-100 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-slate-900">{order.orderCode}</span>
                    <StatusBadge status={order.deliveryStatus} />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{order.supplier?.name} · {money(order.totalAmount)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="panel p-5">
            <h2 className="text-xl font-semibold text-slate-950">Bằng chứng minh bạch</h2>
            <div className="mt-4 grid gap-3">
              {campaign.evidence?.length ? (
                campaign.evidence.map((evidence) => (
                  <a key={evidence._id} href={evidence.fileUrl} target="_blank" rel="noreferrer" className="rounded-md border border-slate-100 p-3 hover:border-teal-brand">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      {evidence.type === "POD" ? <Truck className="h-4 w-4 text-teal-ink" /> : <CheckCircle2 className="h-4 w-4 text-teal-ink" />}
                      {evidence.title}
                    </div>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{evidence.description}</p>
                  </a>
                ))
              ) : (
                <p className="text-sm text-slate-500">Bằng chứng sẽ xuất hiện sau khi admin duyệt POD.</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function ItemSponsor({ item, remaining, defaultQty, onAdd }) {
  const [quantity, setQuantity] = useState(defaultQty);

  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="grid gap-3 sm:grid-cols-[96px_1fr]">
        <img src={item.imageUrl} alt={item.name} className="h-24 w-full rounded-md object-cover" />
        <div>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-slate-950">{item.name}</h3>
              <p className="mt-1 text-xs text-slate-500">{item.supplier?.name}</p>
            </div>
            <span className="text-sm font-semibold text-teal-ink">{money(item.unitPrice)}</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          Còn cần {remaining}/{item.quantityNeeded} {item.unit}
        </p>
        <div className="flex items-center gap-2">
          <input
            className="field w-24"
            type="number"
            min="1"
            max={remaining || 1}
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
          />
          <button className="btn-primary" disabled={remaining <= 0} onClick={() => onAdd(item, quantity)}>
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
}

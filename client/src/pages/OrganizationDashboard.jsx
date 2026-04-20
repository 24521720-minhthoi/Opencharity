import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api.js";
import { money, shortDate } from "@/lib/format.js";
import { StatusBadge } from "@/components/StatusBadge.jsx";
import { Progress } from "@/components/Progress.jsx";

const emptyItem = {
  name: "",
  category: "Thực phẩm",
  unit: "phần",
  quantityNeeded: 10,
  unitPrice: 50000,
  supplierId: "",
  imageUrl: "https://dummyimage.com/900x600/ccfbf1/134e4a&text=Requested+Item",
  description: "Vật phẩm được giao trực tiếp đến tổ chức tiếp nhận."
};

export function OrganizationDashboard() {
  const [data, setData] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({
    title: "",
    summary: "",
    description: "",
    imageUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1300&q=80",
    province: "TP. Hồ Chí Minh",
    beneficiary: "",
    category: "Dinh dưỡng",
    endDate: "2026-06-30",
    riskNote: "Cần đối soát số lượng khi nhận hàng.",
    evidenceRequirement: "POD gồm ảnh nhận hàng, tên người nhận và ghi chú số lượng.",
    items: [{ ...emptyItem }]
  });
  const [pod, setPod] = useState({ orderId: "", receiverName: "", imageUrl: "https://images.unsplash.com/photo-1523289333742-be1143f6b766?auto=format&fit=crop&w=1000&q=80", note: "" });
  const [message, setMessage] = useState("");

  async function load() {
    const [dashboard, supplierList] = await Promise.all([apiFetch("/organization/dashboard"), apiFetch("/suppliers")]);
    setData(dashboard);
    setSuppliers(supplierList);
    setForm((current) => ({
      ...current,
      items: current.items.map((item) => ({ ...item, supplierId: item.supplierId || supplierList[0]?._id || "" }))
    }));
  }

  useEffect(() => {
    load();
  }, []);

  function updateItem(index, key, value) {
    setForm((current) => ({
      ...current,
      items: current.items.map((item, itemIndex) => (itemIndex === index ? { ...item, [key]: value } : item))
    }));
  }

  async function createCampaign(event) {
    event.preventDefault();
    if (form.title.length < 8 || form.summary.length < 20 || form.description.length < 40) {
      setMessage("Vui lòng nhập title, summary và description đủ dài để qua validation.");
      return;
    }
    await apiFetch("/campaigns", { method: "POST", body: form });
    setMessage("Đã gửi chiến dịch chờ admin duyệt.");
    await load();
  }

  async function uploadPod(event) {
    event.preventDefault();
    await apiFetch("/pod", { method: "POST", body: pod });
    setMessage("Đã upload POD, đang chờ admin xác thực trước khi công khai.");
    await load();
  }

  return (
    <section className="shell">
      <h1 className="section-title">Quản lý chiến dịch thiện nguyện</h1>
      <p className="section-lead">Charitable Organization tạo nhu cầu vật phẩm, gửi chờ duyệt và upload Proof of Delivery sau khi nhận hàng.</p>
      {message ? <p className="mt-5 rounded-md bg-teal-soft px-4 py-3 font-medium text-teal-ink">{message}</p> : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="panel p-5">
          <h2 className="text-xl font-semibold text-slate-950">Chiến dịch của tổ chức</h2>
          <div className="mt-4 grid gap-4">
            {(data?.campaigns || []).map((campaign) => (
              <div key={campaign._id} className="rounded-lg border border-slate-200 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-950">{campaign.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{campaign.category} · {campaign.province}</p>
                  </div>
                  <StatusBadge status={campaign.status} />
                </div>
                <div className="mt-4">
                  <Progress value={campaign.metrics.progress} />
                  <p className="mt-2 text-sm text-slate-600">{money(campaign.metrics.fundedValue)} / {money(campaign.metrics.targetValue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form className="panel p-5" onSubmit={createCampaign}>
          <h2 className="text-xl font-semibold text-slate-950">Tạo chiến dịch mới</h2>
          <div className="mt-4 grid gap-3">
            <input className="field" placeholder="Tên chiến dịch" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
            <textarea className="field min-h-20" placeholder="Tóm tắt nhu cầu" value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} />
            <textarea className="field min-h-28" placeholder="Mô tả chi tiết" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            <div className="grid gap-3 sm:grid-cols-2">
              <input className="field" placeholder="Tỉnh/thành" value={form.province} onChange={(event) => setForm({ ...form, province: event.target.value })} />
              <input className="field" placeholder="Người thụ hưởng" value={form.beneficiary} onChange={(event) => setForm({ ...form, beneficiary: event.target.value })} />
            </div>
            <input className="field" placeholder="URL ảnh chiến dịch" value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} />
            <div className="rounded-lg border border-slate-200 p-4">
              <p className="font-semibold text-slate-950">Vật phẩm cần tài trợ</p>
              {form.items.map((item, index) => (
                <div key={index} className="mt-3 grid gap-2">
                  <input className="field" placeholder="Tên vật phẩm" value={item.name} onChange={(event) => updateItem(index, "name", event.target.value)} />
                  <div className="grid gap-2 sm:grid-cols-3">
                    <input className="field" type="number" value={item.quantityNeeded} onChange={(event) => updateItem(index, "quantityNeeded", Number(event.target.value))} />
                    <input className="field" type="number" value={item.unitPrice} onChange={(event) => updateItem(index, "unitPrice", Number(event.target.value))} />
                    <select className="field" value={item.supplierId} onChange={(event) => updateItem(index, "supplierId", event.target.value)}>
                      {suppliers.map((supplier) => (
                        <option key={supplier._id} value={supplier._id}>{supplier.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
              <button type="button" className="btn-outline mt-3" onClick={() => setForm({ ...form, items: [...form.items, { ...emptyItem, supplierId: suppliers[0]?._id || "" }] })}>
                Thêm vật phẩm
              </button>
            </div>
            <button className="btn-primary" type="submit">Gửi chờ duyệt</button>
          </div>
        </form>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="panel p-5">
          <h2 className="text-xl font-semibold text-slate-950">Đơn cần xác nhận/POD</h2>
          <div className="mt-4 grid gap-3">
            {(data?.orders || []).map((order) => (
              <button key={order._id} className="rounded-md border border-slate-200 p-3 text-left hover:border-teal-brand" onClick={() => setPod((current) => ({ ...current, orderId: order._id }))}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="font-semibold text-slate-900">{order.orderCode}</span>
                  <StatusBadge status={order.deliveryStatus} />
                </div>
                <p className="mt-1 text-sm text-slate-500">{order.campaign?.title} · {shortDate(order.createdAt)}</p>
              </button>
            ))}
          </div>
        </div>

        <form className="panel p-5" onSubmit={uploadPod}>
          <h2 className="text-xl font-semibold text-slate-950">Upload Proof of Delivery</h2>
          <div className="mt-4 grid gap-3">
            <input className="field" placeholder="Order ID" value={pod.orderId} onChange={(event) => setPod({ ...pod, orderId: event.target.value })} required />
            <input className="field" placeholder="Người nhận hàng" value={pod.receiverName} onChange={(event) => setPod({ ...pod, receiverName: event.target.value })} required />
            <input className="field" placeholder="URL ảnh POD" value={pod.imageUrl} onChange={(event) => setPod({ ...pod, imageUrl: event.target.value })} required />
            <textarea className="field min-h-24" placeholder="Ghi chú số lượng, tình trạng hàng hóa" value={pod.note} onChange={(event) => setPod({ ...pod, note: event.target.value })} required />
            <button className="btn-amber" type="submit">Gửi POD chờ duyệt</button>
          </div>
        </form>
      </div>
    </section>
  );
}

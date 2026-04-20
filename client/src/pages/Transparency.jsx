import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { FileCheck2, ReceiptText, ShieldCheck, Truck } from "lucide-react";
import { apiFetch } from "@/lib/api.js";
import { money, shortDate } from "@/lib/format.js";
import { StatCard } from "@/components/StatCard.jsx";

export function Transparency() {
  const [data, setData] = useState(null);

  useEffect(() => {
    apiFetch("/transparency").then(setData);
  }, []);

  const stats = data?.stats || {};

  return (
    <section className="shell">
      <h1 className="section-title">Proof of Transparency</h1>
      <p className="section-lead">Trang này công khai dữ liệu đối soát: payment sandbox, trạng thái giao nhận, POD đã duyệt và audit trail nền tảng.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <StatCard label="Giá trị vật phẩm" value={money(stats.sponsoredValue || 0)} helper="Tổng payment sandbox đã matched" icon={<ReceiptText className="h-5 w-5" />} />
        <StatCard label="Đơn hàng" value={stats.orderCount || 0} helper="Từ donor đến supplier" icon={<Truck className="h-5 w-5" />} />
        <StatCard label="POD đã duyệt" value={stats.approvedPods || 0} helper="Chứng cứ giao nhận công khai" icon={<FileCheck2 className="h-5 w-5" />} />
        <StatCard label="Evidence" value={stats.evidenceCount || 0} helper="Minh chứng được admin xác thực" icon={<ShieldCheck className="h-5 w-5" />} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="panel p-5">
          <h2 className="text-xl font-semibold text-slate-950">Dòng giá trị tài trợ vật phẩm</h2>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.series || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `${Math.round(value / 1000000)}tr`} />
                <Tooltip formatter={(value) => money(value)} />
                <Area type="monotone" dataKey="amount" stroke="#0D9488" fill="#CCFBF1" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel p-5">
          <h2 className="text-xl font-semibold text-slate-950">POD công khai</h2>
          <div className="mt-4 grid max-h-80 gap-3 overflow-auto pr-1">
            {(data?.pods || []).map((pod) => (
              <a key={pod._id} href={pod.imageUrl} target="_blank" rel="noreferrer" className="rounded-md border border-slate-100 p-3 hover:border-teal-brand">
                <p className="font-semibold text-slate-900">{pod.campaign?.title}</p>
                <p className="mt-1 text-sm text-slate-500">{pod.supplier?.name} · {shortDate(pod.receivedAt)}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{pod.note}</p>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="panel p-5">
          <h2 className="text-xl font-semibold text-slate-950">Giao dịch sandbox gần đây</h2>
          <div className="mt-4 table-wrap">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-500">
                <tr>
                  <th className="px-4 py-3">Mã</th>
                  <th className="px-4 py-3">Chiến dịch</th>
                  <th className="px-4 py-3">Giá trị</th>
                  <th className="px-4 py-3">Đối soát</th>
                </tr>
              </thead>
              <tbody>
                {(data?.payments || []).map((payment) => (
                  <tr key={payment._id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-medium text-slate-900">{payment.sandboxTransactionId}</td>
                    <td className="px-4 py-3 text-slate-600">{payment.order?.campaign?.title}</td>
                    <td className="px-4 py-3 text-slate-600">{money(payment.amount)}</td>
                    <td className="px-4 py-3 text-teal-ink">{payment.reconciliationStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel p-5">
          <h2 className="text-xl font-semibold text-slate-950">Audit trail</h2>
          <div className="mt-4 grid gap-3">
            {(data?.logs || []).map((log) => (
              <div key={log._id} className="border-l-2 border-teal-brand pl-3">
                <p className="text-sm font-semibold text-slate-900">{log.action}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {shortDate(log.createdAt)} · {log.actor?.name || "System"} · {log.entityType}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

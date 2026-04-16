"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

const presets = [100000, 200000, 500000, 1000000];

export function DonationForm({ campaignId, campaignTitle }: { campaignId: string; campaignTitle: string }) {
  const router = useRouter();
  const [amount, setAmount] = useState(200000);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const response = await fetch("/api/donations", {
      method: "POST",
      body: JSON.stringify({
        campaignId,
        amount,
        method: formData.get("method"),
        message: formData.get("message")
      })
    });
    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(payload.error ?? "Không thể ghi nhận giao dịch");
      return;
    }

    router.push(payload.redirectUrl);
    router.refresh();
  }

  return (
    <form action={onSubmit} className="grid gap-5">
      <div>
        <p className="text-sm text-slate-500">Chiến dịch</p>
        <h2 className="mt-1 text-xl font-semibold text-slate-950">{campaignTitle}</h2>
      </div>
      <div className="grid gap-3">
        <label className="form-label">Chọn số tiền</label>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {presets.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setAmount(item)}
              className={`rounded-md border px-3 py-3 text-sm font-medium ${amount === item ? "border-primary bg-accent text-primary" : "bg-white text-slate-700"}`}
            >
              {formatCurrency(item)}
            </button>
          ))}
        </div>
        <input
          className="form-input"
          value={amount}
          onChange={(event) => setAmount(Number(event.target.value))}
          type="number"
          min={50000}
          step={50000}
        />
      </div>
      <div className="grid gap-2">
        <label className="form-label" htmlFor="method">Phương thức thanh toán demo</label>
        <select className="form-input" id="method" name="method" defaultValue="VNPAY">
          <option value="VNPAY">VNPay sandbox</option>
          <option value="MOMO">MoMo sandbox</option>
          <option value="BANK_TRANSFER">Chuyển khoản ngân hàng</option>
          <option value="CORPORATE_MATCHING">Doanh nghiệp matching</option>
        </select>
      </div>
      <div className="grid gap-2">
        <label className="form-label" htmlFor="message">Lời nhắn</label>
        <textarea className="form-input min-h-28" id="message" name="message" placeholder="Chúc chiến dịch sớm hoàn thành..." />
      </div>
      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      <Button disabled={loading} size="lg">{loading ? "Đang xử lý thanh toán..." : "Ủng hộ và nhận biên nhận"}</Button>
    </form>
  );
}

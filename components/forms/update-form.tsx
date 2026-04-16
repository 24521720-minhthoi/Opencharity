"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Campaign } from "@prisma/client";
import { Button } from "@/components/ui/button";

export function UpdateForm({ campaigns }: { campaigns: Campaign[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/organization/updates", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData.entries()))
    });
    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(payload.error ?? "Không thể gửi cập nhật");
      return;
    }

    setMessage("Đã gửi minh chứng, đang chờ admin duyệt.");
    router.refresh();
  }

  return (
    <form action={onSubmit} className="grid gap-5">
      <div className="grid gap-2">
        <label className="form-label" htmlFor="campaignId">Chiến dịch</label>
        <select className="form-input" id="campaignId" name="campaignId" required>
          {campaigns.map((campaign) => (
            <option key={campaign.id} value={campaign.id}>{campaign.title}</option>
          ))}
        </select>
      </div>
      <div className="grid gap-2">
        <label className="form-label" htmlFor="title">Tiêu đề cập nhật</label>
        <input className="form-input" id="title" name="title" required placeholder="Hoàn tất mua 60 bộ dụng cụ học tập đợt 1" />
      </div>
      <div className="grid gap-2">
        <label className="form-label" htmlFor="summary">Nội dung minh chứng</label>
        <textarea className="form-input min-h-32" id="summary" name="summary" required placeholder="Mô tả hoạt động, số lượng, đơn vị nhận, mã hóa đơn hoặc biên bản bàn giao..." />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <label className="form-label" htmlFor="fundUsed">Số tiền đã sử dụng</label>
          <input className="form-input" id="fundUsed" name="fundUsed" type="number" min={0} defaultValue={0} />
        </div>
        <div className="grid gap-2">
          <label className="form-label" htmlFor="evidenceUrl">Link tài liệu minh chứng</label>
          <input className="form-input" id="evidenceUrl" name="evidenceUrl" type="url" placeholder="https://drive.google.com/..." />
        </div>
      </div>
      <div className="grid gap-2">
        <label className="form-label" htmlFor="imageUrl">Ảnh cập nhật URL</label>
        <input className="form-input" id="imageUrl" name="imageUrl" type="url" placeholder="https://images.unsplash.com/..." />
      </div>
      {message ? <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800">{message}</p> : null}
      <Button disabled={loading}>{loading ? "Đang gửi..." : "Gửi cập nhật chờ duyệt"}</Button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@prisma/client";
import { Button } from "@/components/ui/button";

export function CampaignForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/organization/campaigns", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData.entries()))
    });
    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(payload.error ?? "Không thể gửi chiến dịch");
      return;
    }

    router.push("/organization/campaigns?created=1");
    router.refresh();
  }

  return (
    <form action={onSubmit} className="grid gap-5">
      <div className="grid gap-2">
        <label className="form-label" htmlFor="title">Tên chiến dịch</label>
        <input className="form-input" id="title" name="title" required placeholder="Trao máy tính học tập cho học sinh miền núi" />
      </div>
      <div className="grid gap-2">
        <label className="form-label" htmlFor="summary">Tóm tắt</label>
        <textarea className="form-input min-h-24" id="summary" name="summary" required placeholder="Mục tiêu, nhóm thụ hưởng, địa bàn triển khai..." />
      </div>
      <div className="grid gap-2">
        <label className="form-label" htmlFor="description">Mô tả nghiệp vụ</label>
        <textarea className="form-input min-h-40" id="description" name="description" required placeholder="Bối cảnh, kế hoạch mua sắm, cách đối soát, lịch cập nhật minh chứng..." />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <label className="form-label" htmlFor="categoryId">Lĩnh vực</label>
          <select className="form-input" id="categoryId" name="categoryId" required>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
        <div className="grid gap-2">
          <label className="form-label" htmlFor="province">Địa phương</label>
          <input className="form-input" id="province" name="province" required placeholder="Lào Cai" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <label className="form-label" htmlFor="beneficiary">Đơn vị thụ hưởng</label>
          <input className="form-input" id="beneficiary" name="beneficiary" required placeholder="Trường PTDTBT THCS Nậm Chảy" />
        </div>
        <div className="grid gap-2">
          <label className="form-label" htmlFor="targetAmount">Mục tiêu gây quỹ</label>
          <input className="form-input" id="targetAmount" name="targetAmount" type="number" min={1000000} required placeholder="250000000" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="grid gap-2">
          <label className="form-label" htmlFor="impactMetric">Chỉ số tác động</label>
          <input className="form-input" id="impactMetric" name="impactMetric" required placeholder="120 học sinh có thiết bị học tập" />
        </div>
        <div className="grid gap-2">
          <label className="form-label" htmlFor="endDate">Ngày kết thúc</label>
          <input className="form-input" id="endDate" name="endDate" type="date" required />
        </div>
      </div>
      <div className="grid gap-2">
        <label className="form-label" htmlFor="imageUrl">Ảnh đại diện URL</label>
        <input className="form-input" id="imageUrl" name="imageUrl" type="url" required placeholder="https://images.unsplash.com/..." />
      </div>
      <div className="grid gap-2">
        <label className="form-label" htmlFor="fundAllocation">Kế hoạch sử dụng quỹ</label>
        <textarea className="form-input min-h-28" id="fundAllocation" name="fundAllocation" required placeholder="70% mua hàng hóa, 20% logistics, 10% kiểm toán và dự phòng..." />
      </div>
      {message ? <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">{message}</p> : null}
      <Button disabled={loading} size="lg">{loading ? "Đang gửi..." : "Gửi chiến dịch chờ admin duyệt"}</Button>
    </form>
  );
}

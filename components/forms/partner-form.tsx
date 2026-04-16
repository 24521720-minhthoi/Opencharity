"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function PartnerForm() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/partners", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData.entries()))
    });
    const payload = await response.json();
    setLoading(false);
    setMessage(response.ok ? payload.message : payload.error);
  }

  return (
    <form action={onSubmit} className="grid gap-4 rounded-lg border bg-white p-5 shadow-soft">
      <div className="grid gap-2">
        <label className="form-label" htmlFor="name">Tên doanh nghiệp / tổ chức</label>
        <input className="form-input" id="name" name="name" required placeholder="Công ty TNHH ABC" />
      </div>
      <div className="grid gap-2">
        <label className="form-label" htmlFor="contactName">Người liên hệ</label>
        <input className="form-input" id="contactName" name="contactName" required placeholder="Trần Minh Khoa" />
      </div>
      <div className="grid gap-2">
        <label className="form-label" htmlFor="contactEmail">Email liên hệ</label>
        <input className="form-input" id="contactEmail" name="contactEmail" type="email" required placeholder="csr@company.vn" />
      </div>
      <div className="grid gap-2">
        <label className="form-label" htmlFor="contribution">Hình thức đồng hành</label>
        <textarea className="form-input min-h-28" id="contribution" name="contribution" required placeholder="Tài trợ matching fund, logistics, truyền thông, chuyên gia kiểm toán..." />
      </div>
      {message ? <p className="rounded-md bg-sky-50 px-3 py-2 text-sm text-sky-800">{message}</p> : null}
      <Button disabled={loading}>{loading ? "Đang gửi..." : "Gửi đăng ký hợp tác"}</Button>
    </form>
  );
}

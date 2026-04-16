"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function RegisterForm() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        password: formData.get("password")
      })
    });
    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      setMessage(payload.error ?? "Không thể tạo tài khoản");
      return;
    }

    router.push(payload.redirectTo ?? "/account");
    router.refresh();
  }

  return (
    <form action={onSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <label className="form-label" htmlFor="name">Họ tên</label>
        <input className="form-input" id="name" name="name" required placeholder="Nguyễn Minh An" />
      </div>
      <div className="grid gap-2">
        <label className="form-label" htmlFor="email">Email</label>
        <input className="form-input" id="email" name="email" type="email" required placeholder="ban@example.com" />
      </div>
      <div className="grid gap-2">
        <label className="form-label" htmlFor="phone">Số điện thoại</label>
        <input className="form-input" id="phone" name="phone" placeholder="09xxxxxxxx" />
      </div>
      <div className="grid gap-2">
        <label className="form-label" htmlFor="password">Mật khẩu</label>
        <input className="form-input" id="password" name="password" type="password" required placeholder="Tối thiểu 6 ký tự" />
      </div>
      {message ? <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">{message}</p> : null}
      <Button disabled={loading}>{loading ? "Đang tạo..." : "Tạo tài khoản donor"}</Button>
    </form>
  );
}

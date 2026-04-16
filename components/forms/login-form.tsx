"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const response = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password")
      })
    });
    const payload = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(payload.error ?? "Không thể đăng nhập");
      return;
    }

    router.push(searchParams.get("next") ?? payload.redirectTo ?? "/account");
    router.refresh();
  }

  return (
    <form action={onSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <label className="form-label" htmlFor="email">Email</label>
        <input className="form-input" id="email" name="email" type="email" placeholder="donor@opencharity.vn" required />
      </div>
      <div className="grid gap-2">
        <label className="form-label" htmlFor="password">Mật khẩu</label>
        <input className="form-input" id="password" name="password" type="password" placeholder="123456" required />
      </div>
      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      <Button disabled={loading}>{loading ? "Đang đăng nhập..." : "Đăng nhập"}</Button>
    </form>
  );
}

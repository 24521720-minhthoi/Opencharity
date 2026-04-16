import Link from "next/link";
import { LoginForm } from "@/components/forms/login-form";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="page-shell">
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[0.9fr_1fr]">
        <div className="rounded-lg border bg-white p-6 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">Demo access</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal text-slate-950">Đăng nhập OpenCharity</h1>
          <p className="mt-4 text-sm leading-6 text-slate-600">Dùng tài khoản demo trong README để thử từng vai trò: admin, donor, charity organization và partner.</p>
          <div className="mt-6 grid gap-3 rounded-lg bg-slate-50 p-4 text-sm">
            <p><strong>Admin:</strong> admin@opencharity.vn</p>
            <p><strong>Donor:</strong> donor@opencharity.vn</p>
            <p><strong>Charity:</strong> charity@opencharity.vn</p>
            <p><strong>Password:</strong> 123456</p>
          </div>
        </div>
        <Card className="p-6">
          <LoginForm />
          <div className="mt-5 flex flex-wrap justify-between gap-3 text-sm">
            <Link className="text-primary" href="/forgot-password">Quên mật khẩu?</Link>
            <Link className="text-primary" href="/register">Tạo tài khoản donor</Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

import Link from "next/link";
import { RegisterForm } from "@/components/forms/register-form";
import { Card } from "@/components/ui/card";

export default function RegisterPage() {
  return (
    <div className="page-shell">
      <div className="mx-auto max-w-xl">
        <Card className="p-6">
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">Donor onboarding</p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-950">Tạo tài khoản người ủng hộ</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">Sau khi đăng ký, bạn có thể ủng hộ, lưu chiến dịch và xem biên nhận giao dịch.</p>
          <div className="mt-6">
            <RegisterForm />
          </div>
          <p className="mt-5 text-sm text-slate-600">
            Đã có tài khoản? <Link href="/login" className="text-primary">Đăng nhập</Link>
          </p>
        </Card>
      </div>
    </div>
  );
}

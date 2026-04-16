import { Card } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  return (
    <div className="page-shell">
      <div className="mx-auto max-w-xl">
        <Card className="p-6">
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">Notification demo</p>
          <h1 className="mt-3 text-3xl font-semibold">Quên mật khẩu</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Trong MVP demo, email reset được mô phỏng bằng thông báo nội bộ. Form này thể hiện nghiệp vụ nhưng không gửi email thật.
          </p>
          <form className="mt-6 grid gap-4">
            <label className="form-label" htmlFor="email">Email</label>
            <input className="form-input" id="email" type="email" placeholder="ban@example.com" />
            <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white" type="button">
              Gửi yêu cầu reset demo
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
}

import Link from "next/link";
import { HeartHandshake } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container grid gap-8 py-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <div className="flex items-center gap-2 font-semibold text-slate-950">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-white">
              <HeartHandshake className="h-5 w-5" />
            </span>
            OpenCharity
          </div>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
            Nền tảng thương mại điện tử thiện nguyện giúp kết nối người ủng hộ, tổ chức xã hội và doanh nghiệp bằng dữ liệu minh bạch.
          </p>
          <p className="mt-4 text-xs text-slate-500">Đồ án IS207.Q22 - Quản trị dự án thương mại điện tử.</p>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Điều hướng</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-600">
            <Link href="/campaigns">Chiến dịch</Link>
            <Link href="/transparency">Minh bạch</Link>
            <Link href="/partners">Đối tác</Link>
            <Link href="/about">Giới thiệu</Link>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Demo accounts</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-600">
            <span>admin@opencharity.vn</span>
            <span>donor@opencharity.vn</span>
            <span>charity@opencharity.vn</span>
            <span>Mật khẩu: 123456</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

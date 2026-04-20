import { Link, NavLink, Outlet } from "react-router-dom";
import { HeartHandshake, LogOut, Menu, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext.jsx";

const nav = [
  ["Trang chủ", "/"],
  ["Chiến dịch", "/campaigns"],
  ["Minh bạch", "/transparency"],
  ["Giỏ hàng", "/cart"],
  ["Đơn hàng", "/orders"]
];

function roleHome(role) {
  if (role === "ADMIN") return "/admin";
  if (role === "CHARITY") return "/organization";
  if (role === "SUPPLIER") return "/supplier";
  return "/profile";
}

export function Layout() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/94 backdrop-blur">
        <div className="container flex min-h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 font-semibold text-slate-950">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-brand text-white">
              <HeartHandshake className="h-5 w-5" />
            </span>
            <span>OpenCharity</span>
          </Link>

          <button className="btn-outline px-3 md:hidden" onClick={() => setOpen((value) => !value)} aria-label="Mở menu">
            <Menu className="h-5 w-5" />
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {nav.map(([label, href]) => (
              <NavLink
                key={href}
                to={href}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm font-medium ${isActive ? "bg-teal-soft text-teal-ink" : "text-slate-600 hover:bg-slate-50"}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <>
                <Link to={roleHome(user.role)} className="btn-outline">
                  {user.role === "DONOR" ? "Hồ sơ" : user.role}
                </Link>
                <button className="btn-outline px-3" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-primary">
                Đăng nhập
              </Link>
            )}
            <Link to="/cart" className="btn-amber px-3" aria-label="Giỏ tài trợ">
              <ShoppingCart className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {open ? (
          <div className="border-t border-slate-100 bg-white md:hidden">
            <div className="container grid gap-2 py-3">
              {nav.map(([label, href]) => (
                <NavLink key={href} to={href} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  {label}
                </NavLink>
              ))}
              {user ? (
                <Link to={roleHome(user.role)} onClick={() => setOpen(false)} className="btn-outline">
                  Mở khu vực {user.role}
                </Link>
              ) : (
                <Link to="/login" onClick={() => setOpen(false)} className="btn-primary">
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        ) : null}
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="container grid gap-6 py-8 md:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="font-semibold text-slate-950">OpenCharity</p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
              Prototype học thuật cho mô hình tài trợ vật phẩm B2B2C: tổ chức thiện nguyện, donor, supplier và platform operator cùng tạo dữ liệu minh bạch.
            </p>
          </div>
          <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-3">
            <span>Payment: MoMo Sandbox mô phỏng</span>
            <span>Tracking: near real-time qua API</span>
            <span>POD: upload URL và admin xác thực</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

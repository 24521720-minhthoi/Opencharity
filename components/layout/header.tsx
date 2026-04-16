import Link from "next/link";
import { HeartHandshake, LayoutDashboard, LogIn, Menu, ShieldCheck, UserRound } from "lucide-react";
import { getCurrentUser, roleHome } from "@/lib/auth";
import { ButtonLink } from "@/components/ui/button";
import { LogoutButton } from "@/components/layout/logout-button";

const nav = [
  { href: "/campaigns", label: "Chiến dịch" },
  { href: "/transparency", label: "Minh bạch" },
  { href: "/partners", label: "Đối tác" },
  { href: "/about", label: "Giới thiệu" }
];

export async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b bg-white/92 backdrop-blur">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-950">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-primary text-white">
            <HeartHandshake className="h-5 w-5" />
          </span>
          <span>OpenCharity</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-primary">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <ButtonLink href={roleHome(user.role)} variant="secondary" size="sm">
                {user.role === "ADMIN" ? <ShieldCheck className="h-4 w-4" /> : <LayoutDashboard className="h-4 w-4" />}
                Bảng điều khiển
              </ButtonLink>
              <LogoutButton />
            </>
          ) : (
            <>
              <ButtonLink href="/login" variant="ghost" size="sm">
                <LogIn className="h-4 w-4" />
                Đăng nhập
              </ButtonLink>
              <ButtonLink href="/register" size="sm">
                <UserRound className="h-4 w-4" />
                Tạo tài khoản
              </ButtonLink>
            </>
          )}
        </div>

        <details className="relative md:hidden">
          <summary className="focus-ring grid h-10 w-10 list-none place-items-center rounded-md border bg-white">
            <Menu className="h-5 w-5" />
          </summary>
          <div className="absolute right-0 mt-2 w-64 rounded-lg border bg-white p-3 shadow-soft">
            <div className="grid gap-1">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-md px-3 py-2 text-sm hover:bg-slate-50">
                  {item.label}
                </Link>
              ))}
              <div className="my-2 border-t" />
              {user ? (
                <>
                  <Link href={roleHome(user.role)} className="rounded-md px-3 py-2 text-sm hover:bg-slate-50">
                    Bảng điều khiển
                  </Link>
                  <LogoutButton className="w-full justify-start" />
                </>
              ) : (
                <>
                  <Link href="/login" className="rounded-md px-3 py-2 text-sm hover:bg-slate-50">
                    Đăng nhập
                  </Link>
                  <Link href="/register" className="rounded-md px-3 py-2 text-sm hover:bg-slate-50">
                    Tạo tài khoản
                  </Link>
                </>
              )}
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}

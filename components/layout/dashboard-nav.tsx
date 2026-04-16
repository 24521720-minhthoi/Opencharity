import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

const adminLinks = [
  { href: "/admin", label: "Tổng quan" },
  { href: "/admin/campaigns", label: "Chiến dịch" },
  { href: "/admin/updates", label: "Minh chứng" },
  { href: "/admin/users", label: "Người dùng" },
  { href: "/admin/transactions", label: "Giao dịch" },
  { href: "/admin/audit", label: "Audit log" },
  { href: "/admin/reports", label: "Báo cáo" }
];

const orgLinks = [
  { href: "/organization/dashboard", label: "Tổng quan" },
  { href: "/organization/campaigns", label: "Chiến dịch" },
  { href: "/organization/campaigns/new", label: "Tạo chiến dịch" },
  { href: "/organization/updates", label: "Cập nhật minh chứng" }
];

export async function DashboardNav({ type }: { type: "admin" | "organization" }) {
  const user = await getCurrentUser();
  const links = type === "admin" ? adminLinks : orgLinks;

  return (
    <aside className="rounded-lg border bg-white p-3 shadow-soft">
      <div className="border-b px-3 py-3">
        <p className="text-sm font-semibold text-slate-950">{type === "admin" ? "Admin Center" : "Organization Portal"}</p>
        <p className="mt-1 text-xs text-slate-500">{user?.name}</p>
      </div>
      <nav className="mt-3 grid gap-1">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-primary">
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

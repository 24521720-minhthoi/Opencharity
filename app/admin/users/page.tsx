import { DashboardNav } from "@/components/layout/dashboard-nav";
import { Badge, toneFromStatus } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateTime, statusLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await requireUser(["ADMIN"]);
  const users = await prisma.user.findMany({
    include: { organization: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="page-shell">
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <DashboardNav type="admin" />
        <Card className="p-6">
          <h1 className="text-3xl font-semibold">Quản lý người dùng</h1>
          <p className="section-lead">Theo dõi vai trò RBAC, trạng thái tài khoản và tổ chức liên kết.</p>
          <div className="mt-6 table-wrap">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Người dùng</th>
                  <th className="px-4 py-3">Vai trò</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Tổ chức</th>
                  <th className="px-4 py-3">Ngày tạo</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t">
                    <td className="px-4 py-3">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </td>
                    <td className="px-4 py-3"><Badge tone="info">{user.role}</Badge></td>
                    <td className="px-4 py-3"><Badge tone={toneFromStatus(user.status)}>{statusLabel(user.status)}</Badge></td>
                    <td className="px-4 py-3">{user.organization?.name ?? "-"}</td>
                    <td className="px-4 py-3">{formatDateTime(user.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

import type { AuditLog, User } from "@prisma/client";
import { formatDateTime } from "@/lib/utils";

const actionLabels: Record<string, string> = {
  USER_LOGIN: "Đăng nhập",
  USER_REGISTERED: "Tạo tài khoản",
  CAMPAIGN_CREATED: "Tạo chiến dịch",
  CAMPAIGN_APPROVED: "Duyệt chiến dịch",
  CAMPAIGN_REJECTED: "Từ chối chiến dịch",
  DONATION_CREATED: "Ghi nhận ủng hộ",
  UPDATE_SUBMITTED: "Gửi minh chứng",
  UPDATE_APPROVED: "Duyệt minh chứng",
  UPDATE_REJECTED: "Từ chối minh chứng",
  PARTNER_REQUESTED: "Đăng ký đối tác",
  REPORT_EXPORTED: "Xuất báo cáo"
};

export function AuditTimeline({ logs }: { logs: Array<AuditLog & { actor?: User | null }> }) {
  return (
    <div className="grid gap-3">
      {logs.map((log) => (
        <div key={log.id} className="grid grid-cols-[12px_1fr] gap-3">
          <span className="mt-2 h-3 w-3 rounded-full bg-primary" />
          <div className="rounded-lg border bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-slate-950">{actionLabels[log.action] ?? log.action}</p>
              <time className="text-xs text-slate-500">{formatDateTime(log.createdAt)}</time>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              {log.actor?.name ?? "Hệ thống"} tác động đến {log.entityType}
            </p>
            <p className="mt-2 rounded-md bg-slate-50 px-3 py-2 text-xs leading-5 text-slate-600">{log.metadata}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

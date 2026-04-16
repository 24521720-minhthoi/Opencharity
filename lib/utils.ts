import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatCompactCurrency(amount: number) {
  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1)} tỷ`;
  }
  if (amount >= 1_000_000) {
    return `${Math.round(amount / 1_000_000)} triệu`;
  }
  return formatCurrency(amount);
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string) {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(date));
}

export function percent(current: number, target: number) {
  if (!target) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function daysLeft(endDate: Date | string) {
  const diff = new Date(endDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function statusLabel(status: string) {
  const map: Record<string, string> = {
    ACTIVE: "Đang gây quỹ",
    COMPLETED: "Hoàn thành",
    PENDING_REVIEW: "Chờ duyệt",
    DRAFT: "Bản nháp",
    REJECTED: "Từ chối",
    ARCHIVED: "Lưu trữ",
    APPROVED: "Đã duyệt",
    SUCCESS: "Thành công",
    FAILED: "Thất bại",
    PENDING: "Đang xử lý",
    VERIFIED: "Đã xác minh"
  };

  return map[status] ?? status;
}

export function money(value = 0) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0
  }).format(value);
}

export function shortDate(value) {
  if (!value) return "Chưa có";
  return new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }).format(
    new Date(value)
  );
}

export function statusText(status) {
  const labels = {
    DRAFT: "Bản nháp",
    PENDING_REVIEW: "Chờ duyệt",
    ACTIVE: "Đang mở",
    COMPLETED: "Hoàn tất",
    REJECTED: "Từ chối",
    PAYMENT_SUCCESS: "Đã thanh toán",
    SUPPLIER_PROCESSING: "Supplier xử lý",
    PACKED: "Đã đóng gói",
    IN_TRANSIT: "Đang giao",
    DELIVERED: "Đã giao",
    POD_UPLOADED: "Đã gửi POD",
    POD_APPROVED: "POD đã duyệt",
    POD_PENDING_REVIEW: "POD chờ duyệt",
    WAITING_SUPPLIER: "Chờ supplier",
    APPROVED: "Đã duyệt"
  };
  return labels[status] || status || "Không rõ";
}

export function sumCart(cart) {
  return (cart?.items || []).reduce((sum, item) => {
    const requested = item.requestedItem;
    return sum + (requested?.unitPrice || 0) * item.quantity;
  }, 0);
}

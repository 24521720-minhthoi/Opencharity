import {
  AdminLog,
  Campaign,
  Delivery,
  Order,
  Payment,
  ProofOfDelivery,
  RequestedItem,
  Supplier,
  TransparencyEvidence,
  User
} from "../models.js";

export function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function orderCode(prefix = "OC") {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
}

export async function logAction(req, action, entityType, entityId, metadata = {}) {
  return AdminLog.create({
    action,
    actor: req.user?._id,
    actorRole: req.user?.role || "SYSTEM",
    entityType,
    entityId: entityId?.toString?.() || entityId,
    metadata,
    ipAddress: req.ip
  });
}

export async function decorateCampaigns(campaigns) {
  const plainCampaigns = campaigns.map((campaign) => campaign.toObject?.() || campaign);
  const campaignIds = plainCampaigns.map((campaign) => campaign._id);
  const items = await RequestedItem.find({ campaign: { $in: campaignIds } }).populate("supplier").lean();

  const byCampaign = new Map();
  for (const item of items) {
    const key = item.campaign.toString();
    if (!byCampaign.has(key)) byCampaign.set(key, []);
    byCampaign.get(key).push(item);
  }

  return plainCampaigns.map((campaign) => {
    const campaignItems = byCampaign.get(campaign._id.toString()) || [];
    const targetValue = campaignItems.reduce((sum, item) => sum + item.quantityNeeded * item.unitPrice, 0);
    const fundedValue = campaignItems.reduce((sum, item) => sum + item.quantityFunded * item.unitPrice, 0);
    const requestedUnits = campaignItems.reduce((sum, item) => sum + item.quantityNeeded, 0);
    const fundedUnits = campaignItems.reduce((sum, item) => sum + item.quantityFunded, 0);
    const progress = targetValue > 0 ? Math.min(100, Math.round((fundedValue / targetValue) * 100)) : 0;

    return {
      ...campaign,
      items: campaignItems,
      metrics: {
        targetValue,
        fundedValue,
        requestedUnits,
        fundedUnits,
        progress,
        remainingValue: Math.max(0, targetValue - fundedValue)
      }
    };
  });
}

export async function platformStats() {
  const [activeCampaigns, pendingCampaigns, users, suppliers, orderAgg, deliveries, approvedPods, evidenceCount] =
    await Promise.all([
      Campaign.countDocuments({ status: { $in: ["ACTIVE", "COMPLETED"] } }),
      Campaign.countDocuments({ status: "PENDING_REVIEW" }),
      User.countDocuments({ status: "ACTIVE" }),
      Supplier.countDocuments({ verificationStatus: "VERIFIED" }),
      Order.aggregate([
        { $match: { status: { $ne: "CANCELLED" } } },
        { $group: { _id: null, total: { $sum: "$totalAmount" }, count: { $sum: 1 } } }
      ]),
      Delivery.countDocuments({ status: { $in: ["IN_TRANSIT", "PACKED", "WAITING_SUPPLIER"] } }),
      ProofOfDelivery.countDocuments({ status: "APPROVED" }),
      TransparencyEvidence.countDocuments({ status: "APPROVED" })
    ]);

  return {
    activeCampaigns,
    pendingCampaigns,
    users,
    suppliers,
    orderCount: orderAgg[0]?.count || 0,
    sponsoredValue: orderAgg[0]?.total || 0,
    activeDeliveries: deliveries,
    approvedPods,
    evidenceCount
  };
}

export async function paymentSeries() {
  const payments = await Payment.find({ status: "SUCCESS" }).sort({ paidAt: 1 }).lean();
  const grouped = new Map();

  for (const payment of payments) {
    const label = payment.paidAt.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
    grouped.set(label, (grouped.get(label) || 0) + payment.amount);
  }

  return Array.from(grouped.entries()).map(([date, amount]) => ({ date, amount }));
}

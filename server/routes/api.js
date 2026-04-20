import express from "express";
import { z } from "zod";
import {
  AdminLog,
  Campaign,
  Cart,
  Delivery,
  Order,
  Payment,
  ProofOfDelivery,
  RequestedItem,
  Supplier,
  TransparencyEvidence,
  User
} from "../models.js";
import { comparePassword, issueToken, publicUser, requireAuth } from "../lib/auth.js";
import { decorateCampaigns, logAction, orderCode, paymentSeries, platformStats, slugify } from "../lib/metrics.js";

export const api = express.Router();

const campaignInput = z.object({
  title: z.string().min(8),
  summary: z.string().min(20),
  description: z.string().min(40),
  imageUrl: z.string().url(),
  province: z.string().min(2),
  beneficiary: z.string().min(3),
  category: z.string().min(2),
  urgency: z.string().optional(),
  endDate: z.string().min(8),
  riskNote: z.string().optional(),
  evidenceRequirement: z.string().optional(),
  items: z
    .array(
      z.object({
        name: z.string().min(3),
        category: z.string().min(2),
        unit: z.string().min(1),
        quantityNeeded: z.coerce.number().int().positive(),
        unitPrice: z.coerce.number().int().positive(),
        priority: z.string().optional(),
        description: z.string().optional(),
        imageUrl: z.string().url().optional(),
        supplierId: z.string().min(12)
      })
    )
    .min(1)
});

function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function orderStatusFromDelivery(status) {
  const map = {
    WAITING_SUPPLIER: "PAYMENT_SUCCESS",
    SUPPLIER_PROCESSING: "SUPPLIER_PROCESSING",
    PACKED: "PACKED",
    IN_TRANSIT: "IN_TRANSIT",
    DELIVERED: "DELIVERED"
  };
  return map[status] || "PAYMENT_SUCCESS";
}

api.get("/health", (_req, res) => {
  res.json({ ok: true, service: "OpenCharity MERN API" });
});

api.post(
  "/auth/login",
  asyncRoute(async (req, res) => {
    const parsed = z.object({ email: z.string().email(), password: z.string().min(1) }).safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Email hoặc mật khẩu chưa hợp lệ." });

    const user = await User.findOne({ email: parsed.data.email.toLowerCase() }).populate("organization supplier");
    if (!user || !(await comparePassword(parsed.data.password, user.passwordHash))) {
      return res.status(401).json({ message: "Sai email hoặc mật khẩu." });
    }

    res.json({ token: issueToken(user), user: publicUser(user) });
  })
);

api.get("/auth/me", requireAuth(), (req, res) => {
  res.json({ user: publicUser(req.user) });
});

api.get(
  "/stats",
  asyncRoute(async (_req, res) => {
    res.json(await platformStats());
  })
);

api.get(
  "/suppliers",
  asyncRoute(async (_req, res) => {
    const suppliers = await Supplier.find({ verificationStatus: "VERIFIED" }).sort({ name: 1 }).lean();
    res.json(suppliers);
  })
);

api.get(
  "/campaigns",
  asyncRoute(async (req, res) => {
    const { q, province, category, status } = req.query;
    const filter = { status: status || { $in: ["ACTIVE", "COMPLETED"] } };

    const searchTerm = typeof q === "string" ? q.trim() : "";
    if (searchTerm) {
      const search = new RegExp(escapeRegExp(searchTerm), "i");
      filter.$or = [{ title: search }, { summary: search }];
    }
    if (province) filter.province = province;
    if (category) filter.category = category;

    const campaigns = await Campaign.find(filter).populate("organization").sort({ createdAt: -1 });
    res.json(await decorateCampaigns(campaigns));
  })
);

api.get(
  "/campaigns/:slug",
  asyncRoute(async (req, res) => {
    const campaign = await Campaign.findOne({ slug: req.params.slug, status: { $in: ["ACTIVE", "COMPLETED"] } })
      .populate("organization")
      .lean();

    if (!campaign) return res.status(404).json({ message: "Không tìm thấy chiến dịch công khai." });

    const [decorated] = await decorateCampaigns([campaign]);
    const [evidence, orders] = await Promise.all([
      TransparencyEvidence.find({ campaign: campaign._id, status: "APPROVED" })
        .populate("submittedBy verifiedBy")
        .sort({ publishedAt: -1, createdAt: -1 })
        .lean(),
      Order.find({ campaign: campaign._id }).populate("donor supplier").sort({ createdAt: -1 }).limit(8).lean()
    ]);

    res.json({ ...decorated, evidence, recentOrders: orders });
  })
);

api.post(
  "/campaigns",
  requireAuth(["CHARITY"]),
  asyncRoute(async (req, res) => {
    const parsed = campaignInput.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Dữ liệu chiến dịch chưa hợp lệ.", issues: parsed.error.flatten() });
    }

    const organizationId = req.user.organization?._id || req.user.organization;
    if (!organizationId) return res.status(400).json({ message: "Tài khoản chưa gắn với tổ chức thiện nguyện." });

    const campaign = await Campaign.create({
      ...parsed.data,
      slug: `${slugify(parsed.data.title)}-${Date.now().toString(36)}`,
      organization: organizationId,
      createdBy: req.user._id,
      status: "PENDING_REVIEW",
      startDate: new Date(),
      endDate: new Date(parsed.data.endDate)
    });

    await RequestedItem.insertMany(
      parsed.data.items.map((item) => ({
        campaign: campaign._id,
        supplier: item.supplierId,
        name: item.name,
        category: item.category,
        unit: item.unit,
        quantityNeeded: item.quantityNeeded,
        unitPrice: item.unitPrice,
        priority: item.priority || "MEDIUM",
        description: item.description,
        imageUrl: item.imageUrl
      }))
    );

    await logAction(req, "CHARITY_SUBMIT_CAMPAIGN", "Campaign", campaign._id, { title: campaign.title });
    res.status(201).json({ campaign });
  })
);

api.get(
  "/cart",
  requireAuth(["DONOR"]),
  asyncRoute(async (req, res) => {
    const cart = await Cart.findOne({ donor: req.user._id })
      .populate({
        path: "items.requestedItem",
        populate: [
          { path: "campaign", populate: "organization" },
          { path: "supplier" }
        ]
      })
      .lean();

    res.json(cart || { donor: req.user._id, items: [] });
  })
);

api.post(
  "/cart/items",
  requireAuth(["DONOR"]),
  asyncRoute(async (req, res) => {
    const parsed = z
      .object({ requestedItemId: z.string().min(12), quantity: z.coerce.number().int().positive() })
      .safeParse(req.body);

    if (!parsed.success) return res.status(400).json({ message: "Vật phẩm hoặc số lượng chưa hợp lệ." });

    const item = await RequestedItem.findById(parsed.data.requestedItemId).populate("campaign");
    if (!item || !["ACTIVE", "COMPLETED"].includes(item.campaign.status)) {
      return res.status(404).json({ message: "Vật phẩm không còn nhận tài trợ." });
    }

    const remaining = Math.max(0, item.quantityNeeded - item.quantityFunded);
    if (remaining <= 0) return res.status(400).json({ message: "Vật phẩm này đã được tài trợ đủ." });

    const quantity = Math.min(parsed.data.quantity, remaining);
    const cart = await Cart.findOneAndUpdate(
      { donor: req.user._id },
      { $setOnInsert: { donor: req.user._id } },
      { upsert: true, new: true }
    );

    const existing = cart.items.find((cartItem) => cartItem.requestedItem.toString() === item._id.toString());
    if (existing) {
      existing.quantity = Math.min(existing.quantity + quantity, remaining);
    } else {
      cart.items.push({ requestedItem: item._id, quantity });
    }

    await cart.save();
    await logAction(req, "DONOR_ADD_CART_ITEM", "RequestedItem", item._id, { quantity });
    res.json({ message: "Đã thêm vật phẩm vào giỏ tài trợ." });
  })
);

api.patch(
  "/cart/items/:itemId",
  requireAuth(["DONOR"]),
  asyncRoute(async (req, res) => {
    const parsed = z.object({ quantity: z.coerce.number().int().positive() }).safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Số lượng chưa hợp lệ." });

    const cart = await Cart.findOne({ donor: req.user._id });
    if (!cart) return res.status(404).json({ message: "Giỏ hàng trống." });

    const item = cart.items.find((cartItem) => cartItem.requestedItem.toString() === req.params.itemId);
    if (!item) return res.status(404).json({ message: "Không tìm thấy vật phẩm trong giỏ." });

    item.quantity = parsed.data.quantity;
    await cart.save();
    res.json({ message: "Đã cập nhật giỏ hàng." });
  })
);

api.delete(
  "/cart/items/:itemId",
  requireAuth(["DONOR"]),
  asyncRoute(async (req, res) => {
    await Cart.updateOne({ donor: req.user._id }, { $pull: { items: { requestedItem: req.params.itemId } } });
    res.json({ message: "Đã xóa vật phẩm khỏi giỏ." });
  })
);

api.post(
  "/checkout",
  requireAuth(["DONOR"]),
  asyncRoute(async (req, res) => {
    const cart = await Cart.findOne({ donor: req.user._id }).populate({
      path: "items.requestedItem",
      populate: [
        { path: "campaign", populate: "organization" },
        { path: "supplier" }
      ]
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Giỏ tài trợ đang trống." });
    }

    const groups = new Map();
    for (const cartItem of cart.items) {
      const item = cartItem.requestedItem;
      const remaining = Math.max(0, item.quantityNeeded - item.quantityFunded);
      const quantity = Math.min(cartItem.quantity, remaining);
      if (quantity <= 0) continue;

      const key = `${item.supplier._id.toString()}-${item.campaign._id.toString()}`;
      if (!groups.has(key)) groups.set(key, { supplier: item.supplier, campaign: item.campaign, items: [] });
      groups.get(key).items.push({ item, quantity });
    }

    if (groups.size === 0) {
      cart.items = [];
      await cart.save();
      return res.status(400).json({ message: "Các vật phẩm trong giỏ đã được tài trợ đủ." });
    }

    const provider = req.body.provider || "MOMO_SANDBOX";
    const orders = [];

    for (const group of groups.values()) {
      const orderItems = group.items.map(({ item, quantity }) => ({
        requestedItem: item._id,
        name: item.name,
        unit: item.unit,
        unitPrice: item.unitPrice,
        quantity,
        subtotal: item.unitPrice * quantity
      }));
      const totalAmount = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

      const order = await Order.create({
        orderCode: orderCode("OC"),
        donor: req.user._id,
        campaign: group.campaign._id,
        supplier: group.supplier._id,
        organization: group.campaign.organization._id || group.campaign.organization,
        items: orderItems,
        totalAmount,
        status: "PAYMENT_SUCCESS",
        paymentStatus: "SUCCESS",
        deliveryStatus: "WAITING_SUPPLIER"
      });

      await Payment.create({
        order: order._id,
        provider: provider === "MOMO_SANDBOX" ? "MoMo Sandbox" : "Payment Sandbox",
        method: provider,
        sandboxTransactionId: orderCode("MOMO"),
        amount: totalAmount,
        status: "SUCCESS",
        reconciliationStatus: "MATCHED"
      });

      await Delivery.create({
        order: order._id,
        campaign: group.campaign._id,
        supplier: group.supplier._id,
        receiverOrganization: group.campaign.organization._id || group.campaign.organization,
        status: "WAITING_SUPPLIER",
        trackingCode: orderCode("SHIP"),
        estimatedArrival: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        timeline: [
          {
            status: "PAYMENT_SUCCESS",
            label: "Thanh toán sandbox thành công",
            note: "Đơn hàng đã được chuyển sang nhà cung cấp để xử lý.",
            actorRole: "DONOR"
          }
        ]
      });

      for (const { item, quantity } of group.items) {
        await RequestedItem.updateOne({ _id: item._id }, { $inc: { quantityFunded: quantity } });
      }

      await User.updateOne(
        { _id: req.user._id },
        { $inc: { "impact.totalSponsored": totalAmount, "impact.ordersCompleted": 1 } }
      );
      orders.push(order);
    }

    cart.items = [];
    await cart.save();
    await logAction(req, "DONOR_CHECKOUT_SANDBOX", "Order", orders.map((order) => order._id).join(","), {
      count: orders.length,
      provider
    });

    res.status(201).json({ message: "Thanh toán mô phỏng thành công.", orders });
  })
);

api.get(
  "/orders",
  requireAuth(["DONOR", "CHARITY", "SUPPLIER", "ADMIN"]),
  asyncRoute(async (req, res) => {
    let filter = {};
    if (req.user.role === "DONOR") filter.donor = req.user._id;
    if (req.user.role === "SUPPLIER") filter.supplier = req.user.supplier?._id || req.user.supplier;
    if (req.user.role === "CHARITY") filter.organization = req.user.organization?._id || req.user.organization;

    const orders = await Order.find(filter)
      .populate("donor campaign supplier organization")
      .sort({ createdAt: -1 })
      .lean();
    const deliveries = await Delivery.find({ order: { $in: orders.map((order) => order._id) } }).lean();
    const deliveryByOrder = new Map(deliveries.map((delivery) => [delivery.order.toString(), delivery]));

    res.json(orders.map((order) => ({ ...order, delivery: deliveryByOrder.get(order._id.toString()) })));
  })
);

api.patch(
  "/orders/:id/delivery",
  requireAuth(["SUPPLIER"]),
  asyncRoute(async (req, res) => {
    const parsed = z
      .object({
        status: z.enum(["SUPPLIER_PROCESSING", "PACKED", "IN_TRANSIT", "DELIVERED"]),
        note: z.string().optional()
      })
      .safeParse(req.body);

    if (!parsed.success) return res.status(400).json({ message: "Trạng thái vận chuyển không hợp lệ." });

    const supplierId = req.user.supplier?._id || req.user.supplier;
    const order = await Order.findOne({ _id: req.params.id, supplier: supplierId });
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng của nhà cung cấp." });

    order.status = orderStatusFromDelivery(parsed.data.status);
    order.deliveryStatus = parsed.data.status;
    await order.save();

    const delivery = await Delivery.findOneAndUpdate(
      { order: order._id },
      {
        $set: { status: parsed.data.status, updatedBy: req.user._id },
        $push: {
          timeline: {
            status: parsed.data.status,
            label: `Nhà cung cấp cập nhật: ${parsed.data.status}`,
            note: parsed.data.note || "Cập nhật trạng thái giao nhận.",
            actorRole: "SUPPLIER"
          }
        }
      },
      { new: true }
    );

    await logAction(req, "SUPPLIER_UPDATE_DELIVERY", "Order", order._id, { status: parsed.data.status });
    res.json({ order, delivery });
  })
);

api.post(
  "/pod",
  requireAuth(["CHARITY"]),
  asyncRoute(async (req, res) => {
    const parsed = z
      .object({
        orderId: z.string().min(12),
        receiverName: z.string().min(3),
        imageUrl: z.string().url(),
        note: z.string().min(10)
      })
      .safeParse(req.body);

    if (!parsed.success) return res.status(400).json({ message: "Thông tin POD chưa hợp lệ." });

    const organizationId = req.user.organization?._id || req.user.organization;
    const order = await Order.findOne({ _id: parsed.data.orderId, organization: organizationId });
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn cần xác nhận nhận hàng." });

    const delivery = await Delivery.findOne({ order: order._id });
    const proof = await ProofOfDelivery.create({
      order: order._id,
      campaign: order.campaign,
      supplier: order.supplier,
      organization: order.organization,
      delivery: delivery?._id,
      receiverName: parsed.data.receiverName,
      imageUrl: parsed.data.imageUrl,
      note: parsed.data.note,
      status: "PENDING_REVIEW",
      uploadedBy: req.user._id
    });

    await TransparencyEvidence.create({
      campaign: order.campaign,
      order: order._id,
      type: "POD",
      title: `POD cho đơn ${order.orderCode}`,
      description: parsed.data.note,
      fileUrl: parsed.data.imageUrl,
      status: "PENDING_REVIEW",
      submittedBy: req.user._id
    });

    order.status = "POD_UPLOADED";
    order.deliveryStatus = "POD_PENDING_REVIEW";
    await order.save();
    await logAction(req, "CHARITY_UPLOAD_POD", "ProofOfDelivery", proof._id, { orderCode: order.orderCode });
    res.status(201).json({ proof });
  })
);

api.get(
  "/transparency",
  asyncRoute(async (_req, res) => {
    const [stats, payments, pods, evidence, logs, series] = await Promise.all([
      platformStats(),
      Payment.find({ status: "SUCCESS" })
        .populate({ path: "order", populate: [{ path: "campaign" }, { path: "donor" }, { path: "supplier" }] })
        .sort({ paidAt: -1 })
        .limit(12)
        .lean(),
      ProofOfDelivery.find({ status: "APPROVED" })
        .populate("campaign supplier organization")
        .sort({ receivedAt: -1 })
        .limit(12)
        .lean(),
      TransparencyEvidence.find({ status: "APPROVED" })
        .populate("campaign submittedBy verifiedBy")
        .sort({ publishedAt: -1, createdAt: -1 })
        .limit(12)
        .lean(),
      AdminLog.find({}).populate("actor").sort({ createdAt: -1 }).limit(12).lean(),
      paymentSeries()
    ]);

    res.json({ stats, payments, pods, evidence, logs, series });
  })
);

api.get(
  "/profile",
  requireAuth(["DONOR", "CHARITY", "SUPPLIER", "ADMIN"]),
  asyncRoute(async (req, res) => {
    const [orders, proofs] = await Promise.all([
      Order.find({ donor: req.user._id }).populate("campaign supplier").sort({ createdAt: -1 }).lean(),
      ProofOfDelivery.find({ uploadedBy: req.user._id }).populate("campaign").sort({ createdAt: -1 }).lean()
    ]);

    res.json({ user: publicUser(req.user), orders, proofs });
  })
);

api.get(
  "/organization/dashboard",
  requireAuth(["CHARITY"]),
  asyncRoute(async (req, res) => {
    const organizationId = req.user.organization?._id || req.user.organization;
    const [campaigns, orders, proofs] = await Promise.all([
      Campaign.find({ organization: organizationId }).populate("organization").sort({ createdAt: -1 }),
      Order.find({ organization: organizationId }).populate("campaign supplier donor").sort({ createdAt: -1 }).lean(),
      ProofOfDelivery.find({ organization: organizationId }).populate("campaign supplier").sort({ createdAt: -1 }).lean()
    ]);

    res.json({ campaigns: await decorateCampaigns(campaigns), orders, proofs });
  })
);

api.get(
  "/supplier/dashboard",
  requireAuth(["SUPPLIER"]),
  asyncRoute(async (req, res) => {
    const supplierId = req.user.supplier?._id || req.user.supplier;
    const [orders, items] = await Promise.all([
      Order.find({ supplier: supplierId }).populate("campaign donor organization").sort({ createdAt: -1 }).lean(),
      RequestedItem.find({ supplier: supplierId }).populate("campaign").sort({ createdAt: -1 }).limit(20).lean()
    ]);
    res.json({ orders, items });
  })
);

api.get(
  "/admin/dashboard",
  requireAuth(["ADMIN"]),
  asyncRoute(async (_req, res) => {
    const [stats, campaigns, users, suppliers, orders, proofs, logs] = await Promise.all([
      platformStats(),
      Campaign.find({}).populate("organization").sort({ createdAt: -1 }),
      User.find({}).populate("organization supplier").sort({ createdAt: -1 }).lean(),
      Supplier.find({}).sort({ name: 1 }).lean(),
      Order.find({}).populate("donor campaign supplier organization").sort({ createdAt: -1 }).lean(),
      ProofOfDelivery.find({}).populate("campaign supplier organization uploadedBy verifiedBy").sort({ createdAt: -1 }).lean(),
      AdminLog.find({}).populate("actor").sort({ createdAt: -1 }).limit(30).lean()
    ]);

    res.json({ stats, campaigns: await decorateCampaigns(campaigns), users, suppliers, orders, proofs, logs });
  })
);

api.patch(
  "/admin/campaigns/:id",
  requireAuth(["ADMIN"]),
  asyncRoute(async (req, res) => {
    const parsed = z
      .object({ status: z.enum(["ACTIVE", "REJECTED", "ARCHIVED"]), reviewNote: z.string().optional() })
      .safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Trạng thái kiểm duyệt không hợp lệ." });

    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { status: parsed.data.status, reviewNote: parsed.data.reviewNote, approvedBy: req.user._id },
      { new: true }
    );
    if (!campaign) return res.status(404).json({ message: "Không tìm thấy chiến dịch." });

    await logAction(req, "ADMIN_REVIEW_CAMPAIGN", "Campaign", campaign._id, parsed.data);
    res.json({ campaign });
  })
);

api.patch(
  "/admin/proofs/:id",
  requireAuth(["ADMIN"]),
  asyncRoute(async (req, res) => {
    const parsed = z.object({ status: z.enum(["APPROVED", "REJECTED"]), note: z.string().optional() }).safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ message: "Trạng thái POD không hợp lệ." });

    const proof = await ProofOfDelivery.findByIdAndUpdate(
      req.params.id,
      { status: parsed.data.status, verifiedBy: req.user._id },
      { new: true }
    );
    if (!proof) return res.status(404).json({ message: "Không tìm thấy POD." });

    await TransparencyEvidence.updateMany(
      { order: proof.order, type: "POD" },
      {
        status: parsed.data.status,
        verifiedBy: req.user._id,
        publishedAt: parsed.data.status === "APPROVED" ? new Date() : undefined
      }
    );

    if (parsed.data.status === "APPROVED") {
      await Order.updateOne({ _id: proof.order }, { status: "COMPLETED", deliveryStatus: "POD_APPROVED" });
      await Delivery.updateOne(
        { order: proof.order },
        {
          status: "POD_APPROVED",
          $push: {
            timeline: {
              status: "POD_APPROVED",
              label: "Admin xác thực POD",
              note: parsed.data.note || "Bằng chứng giao nhận đã được duyệt công khai.",
              actorRole: "ADMIN"
            }
          }
        }
      );
    }

    await logAction(req, "ADMIN_REVIEW_POD", "ProofOfDelivery", proof._id, parsed.data);
    res.json({ proof });
  })
);

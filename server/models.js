import mongoose from "mongoose";

const { Schema, model, models } = mongoose;
const baseOptions = { timestamps: true };

const roleSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    permissions: [{ type: String }]
  },
  baseOptions
);

const organizationSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    type: { type: String, default: "CHARITY" },
    verificationStatus: { type: String, default: "PENDING" },
    taxCode: String,
    representative: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    address: String,
    province: String,
    mission: String,
    documentUrl: String,
    transparencyScore: { type: Number, default: 72 }
  },
  baseOptions
);

const supplierSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    verificationStatus: { type: String, default: "VERIFIED" },
    categories: [{ type: String }],
    serviceAreas: [{ type: String }],
    contactName: String,
    email: String,
    phone: String,
    address: String,
    logoUrl: String,
    rating: { type: Number, default: 4.6 },
    metrics: {
      ordersCompleted: { type: Number, default: 0 },
      onTimeRate: { type: Number, default: 95 }
    }
  },
  baseOptions
);

const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    phone: String,
    avatarUrl: String,
    role: { type: String, required: true, enum: ["ADMIN", "DONOR", "CHARITY", "SUPPLIER"] },
    status: { type: String, default: "ACTIVE" },
    organization: { type: Schema.Types.ObjectId, ref: "Organization" },
    supplier: { type: Schema.Types.ObjectId, ref: "Supplier" },
    impact: {
      totalSponsored: { type: Number, default: 0 },
      ordersCompleted: { type: Number, default: 0 }
    }
  },
  baseOptions
);

const campaignSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    summary: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    province: { type: String, required: true },
    beneficiary: { type: String, required: true },
    category: { type: String, required: true },
    status: {
      type: String,
      default: "PENDING_REVIEW",
      enum: ["DRAFT", "PENDING_REVIEW", "ACTIVE", "COMPLETED", "REJECTED", "ARCHIVED"]
    },
    urgency: { type: String, default: "MEDIUM" },
    startDate: Date,
    endDate: Date,
    transparencyScore: { type: Number, default: 75 },
    riskNote: String,
    reviewNote: String,
    evidenceRequirement: String,
    organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    approvedBy: { type: Schema.Types.ObjectId, ref: "User" }
  },
  baseOptions
);

const requestedItemSchema = new Schema(
  {
    campaign: { type: Schema.Types.ObjectId, ref: "Campaign", required: true },
    supplier: { type: Schema.Types.ObjectId, ref: "Supplier", required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    unit: { type: String, default: "phần" },
    quantityNeeded: { type: Number, required: true },
    quantityFunded: { type: Number, default: 0 },
    unitPrice: { type: Number, required: true },
    priority: { type: String, default: "MEDIUM" },
    description: String,
    imageUrl: String
  },
  baseOptions
);

const cartSchema = new Schema(
  {
    donor: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [
      {
        requestedItem: { type: Schema.Types.ObjectId, ref: "RequestedItem", required: true },
        quantity: { type: Number, required: true, min: 1 }
      }
    ]
  },
  baseOptions
);

const orderItemSchema = new Schema(
  {
    requestedItem: { type: Schema.Types.ObjectId, ref: "RequestedItem", required: true },
    name: String,
    unit: String,
    unitPrice: Number,
    quantity: Number,
    subtotal: Number
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    orderCode: { type: String, required: true, unique: true },
    donor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    campaign: { type: Schema.Types.ObjectId, ref: "Campaign", required: true },
    supplier: { type: Schema.Types.ObjectId, ref: "Supplier", required: true },
    organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      default: "PAYMENT_SUCCESS",
      enum: [
        "ORDER_CREATED",
        "PAYMENT_SUCCESS",
        "SUPPLIER_PROCESSING",
        "PACKED",
        "IN_TRANSIT",
        "DELIVERED",
        "POD_UPLOADED",
        "COMPLETED",
        "CANCELLED"
      ]
    },
    paymentStatus: { type: String, default: "SUCCESS" },
    deliveryStatus: { type: String, default: "WAITING_SUPPLIER" }
  },
  baseOptions
);

const paymentSchema = new Schema(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    provider: { type: String, default: "MoMo Sandbox" },
    method: { type: String, default: "MOMO_SANDBOX" },
    status: { type: String, default: "SUCCESS" },
    sandboxTransactionId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    paidAt: { type: Date, default: Date.now },
    reconciliationStatus: { type: String, default: "MATCHED" }
  },
  baseOptions
);

const deliverySchema = new Schema(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    campaign: { type: Schema.Types.ObjectId, ref: "Campaign", required: true },
    supplier: { type: Schema.Types.ObjectId, ref: "Supplier", required: true },
    receiverOrganization: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    status: { type: String, default: "WAITING_SUPPLIER" },
    trackingCode: { type: String, required: true, unique: true },
    estimatedArrival: Date,
    timeline: [
      {
        status: String,
        label: String,
        note: String,
        actorRole: String,
        at: { type: Date, default: Date.now }
      }
    ],
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" }
  },
  baseOptions
);

const proofOfDeliverySchema = new Schema(
  {
    order: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    campaign: { type: Schema.Types.ObjectId, ref: "Campaign", required: true },
    supplier: { type: Schema.Types.ObjectId, ref: "Supplier", required: true },
    organization: { type: Schema.Types.ObjectId, ref: "Organization", required: true },
    delivery: { type: Schema.Types.ObjectId, ref: "Delivery" },
    imageUrl: String,
    documentUrl: String,
    receiverName: { type: String, required: true },
    receivedAt: { type: Date, default: Date.now },
    note: String,
    status: { type: String, default: "PENDING_REVIEW" },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
    verifiedBy: { type: Schema.Types.ObjectId, ref: "User" }
  },
  baseOptions
);

const transparencyEvidenceSchema = new Schema(
  {
    campaign: { type: Schema.Types.ObjectId, ref: "Campaign", required: true },
    order: { type: Schema.Types.ObjectId, ref: "Order" },
    type: { type: String, default: "POD" },
    title: { type: String, required: true },
    description: String,
    fileUrl: String,
    status: { type: String, default: "PENDING_REVIEW" },
    submittedBy: { type: Schema.Types.ObjectId, ref: "User" },
    verifiedBy: { type: Schema.Types.ObjectId, ref: "User" },
    publishedAt: Date
  },
  baseOptions
);

const adminLogSchema = new Schema(
  {
    action: { type: String, required: true },
    actor: { type: Schema.Types.ObjectId, ref: "User" },
    actorRole: String,
    entityType: String,
    entityId: String,
    metadata: Schema.Types.Mixed,
    ipAddress: String
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Role = models.Role || model("Role", roleSchema);
export const Organization = models.Organization || model("Organization", organizationSchema);
export const Supplier = models.Supplier || model("Supplier", supplierSchema);
export const User = models.User || model("User", userSchema);
export const Campaign = models.Campaign || model("Campaign", campaignSchema);
export const RequestedItem = models.RequestedItem || model("RequestedItem", requestedItemSchema);
export const Cart = models.Cart || model("Cart", cartSchema);
export const Order = models.Order || model("Order", orderSchema);
export const Payment = models.Payment || model("Payment", paymentSchema);
export const Delivery = models.Delivery || model("Delivery", deliverySchema);
export const ProofOfDelivery = models.ProofOfDelivery || model("ProofOfDelivery", proofOfDeliverySchema);
export const TransparencyEvidence =
  models.TransparencyEvidence || model("TransparencyEvidence", transparencyEvidenceSchema);
export const AdminLog = models.AdminLog || model("AdminLog", adminLogSchema);

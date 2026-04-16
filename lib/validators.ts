import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự")
});

export const registerSchema = z.object({
  name: z.string().min(2, "Vui lòng nhập họ tên"),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().optional(),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự")
});

export const donationSchema = z.object({
  campaignId: z.string().min(1),
  amount: z.coerce.number().int().min(50000, "Số tiền tối thiểu là 50.000đ"),
  method: z.enum(["BANK_TRANSFER", "MOMO", "VNPAY", "CORPORATE_MATCHING"]),
  message: z.string().max(180).optional()
});

export const campaignSchema = z.object({
  title: z.string().min(8, "Tên chiến dịch cần rõ ràng hơn"),
  summary: z.string().min(20, "Tóm tắt tối thiểu 20 ký tự"),
  description: z.string().min(60, "Mô tả cần đủ thông tin để admin duyệt"),
  categoryId: z.string().min(1),
  province: z.string().min(2),
  beneficiary: z.string().min(2),
  targetAmount: z.coerce.number().int().min(1000000),
  impactMetric: z.string().min(5),
  endDate: z.string().min(8),
  imageUrl: z.string().url("Cần URL hình ảnh hợp lệ"),
  fundAllocation: z.string().min(20, "Cần mô tả cách dùng quỹ")
});

export const updateSchema = z.object({
  campaignId: z.string().min(1),
  title: z.string().min(5),
  summary: z.string().min(30),
  evidenceUrl: z.string().url().optional().or(z.literal("")),
  imageUrl: z.string().url().optional().or(z.literal("")),
  fundUsed: z.coerce.number().int().min(0)
});

export const partnerSchema = z.object({
  name: z.string().min(2),
  contactName: z.string().min(2),
  contactEmail: z.string().email(),
  contribution: z.string().min(12)
});

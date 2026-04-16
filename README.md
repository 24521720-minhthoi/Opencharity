# OpenCharity - Website demo thương mại điện tử thiện nguyện minh bạch

Đồ án môn **Quản trị dự án thương mại điện tử**  
Lớp: **EC208.Q21**
GVHD: ThS. Huỳnh Đức Huy

Thành viên:

| Họ tên | MSSV | Vai trò |
|---|---|---|
| Nguyễn Minh Thời | 24521720 | Nhóm trưởng |
| Nguyễn Văn Gia Bảo | 24520176 | Thành viên |
| Lê Hiếu Huy | 24520666 | Thành viên |
| Bùi Quốc Trung | 24521872 | Thành viên |
| Lê Văn Hoàng | 24520545 | Thành viên |
| Lưu Nhật Quang | 24521496 | Thành viên |

## 1. Product Interpretation

OpenCharity là một nền tảng thương mại điện tử thiện nguyện theo mô hình **B2B2C**. Sản phẩm không chỉ cho phép người dùng quyên góp online, mà số hóa toàn bộ chuỗi vận hành:

- Tổ chức thiện nguyện tạo chiến dịch và gửi hồ sơ chờ duyệt.
- Admin kiểm tra chiến dịch, duyệt trước khi công khai.
- Người ủng hộ khám phá chiến dịch, thanh toán demo, nhận biên nhận.
- Tổ chức gửi minh chứng sử dụng quỹ.
- Admin duyệt minh chứng trước khi hiển thị public.
- Public xem dữ liệu minh bạch, giao dịch gần đây, audit trail và kết quả tác động.

Điểm khác biệt so với website quyên góp thông thường là lớp **transparency + reconciliation + audit log**. Đây là nơi thể hiện tư duy quản trị dự án thương mại điện tử: có stakeholder, workflow, trạng thái, dữ liệu, kiểm duyệt, dashboard và đo lường.

## 2. Key Assumptions

- Demo chạy local bằng **SQLite** để giảm lỗi môi trường, nhưng schema được tổ chức bằng **Prisma** để có thể nâng cấp PostgreSQL.
- Thanh toán là **fake payment success flow**: không tích hợp cổng thanh toán thật, nhưng vẫn tạo Donation, PaymentReceipt, AuditLog và cập nhật Campaign progress.
- Email notification được mô phỏng bằng bảng Notification và thông báo trong tài khoản.
- Các URL hình ảnh dùng ảnh public từ Unsplash/dummy image để demo trực quan.
- Trạng thái như role/status được lưu dạng `String` trong SQLite vì Prisma SQLite trên môi trường này không dùng enum native ổn định. README vẫn mô tả enum logic để bảo vệ thiết kế.
- Node hiện tại là v24, nên dự án có script `db:init` dùng `node:sqlite` để tạo database ổn định nếu `prisma db push` lỗi schema engine trên Windows.

## 3. MVP Scope

MVP được chốt theo tiêu chí demo chạy được và có chiều sâu nghiệp vụ:

- Public site: home, about, campaigns, campaign detail, partners, transparency.
- Donor portal: register/login, profile, donation history, receipt, saved campaigns.
- Charity portal: dashboard, create campaign, submit evidence update, track approval status.
- Admin portal: overview, campaign approval, update approval, user management, transactions, audit logs, report center.
- RBAC bằng session cookie và role: `ADMIN`, `DONOR`, `CHARITY`, `PARTNER`.
- Seed data Việt Nam: 5 tổ chức, 10 chiến dịch, 28+ giao dịch, đối tác, minh chứng, audit logs.

## 4. Feature List Theo Mức Ưu Tiên

### Must-have

- Campaign marketplace có search/filter.
- Campaign detail có tiến độ, tổ chức, kế hoạch dùng quỹ, cập nhật minh chứng.
- Auth + role-based access control.
- Donation flow tạo giao dịch, biên nhận và audit log.
- Charity tạo chiến dịch chờ duyệt.
- Admin duyệt chiến dịch để public.
- Charity gửi minh chứng chờ duyệt.
- Admin duyệt minh chứng để public thấy.
- Transparency page có số liệu, giao dịch, minh chứng, audit trail.

### Should-have

- Dashboard admin có KPI và biểu đồ Recharts.
- Dashboard organization có trạng thái chiến dịch và minh chứng.
- Saved campaign/wishlist cho donor.
- Partner registration form.
- README + demo script đầy đủ.

### Could-have

- Email thật.
- Payment gateway thật.
- Upload file thật lên storage.
- PostgreSQL production.
- Export PDF/Excel báo cáo.

## 5. Sitemap

```text
/
/about
/campaigns
/campaigns/[slug]
/campaigns/[slug]/donate
/partners
/transparency
/login
/register
/forgot-password
/payment/success

/account
/account/donations
/account/saved

/organization
/organization/dashboard
/organization/campaigns
/organization/campaigns/new
/organization/updates

/admin
/admin/campaigns
/admin/updates
/admin/users
/admin/transactions
/admin/audit
/admin/reports

/api/auth/login
/api/auth/logout
/api/auth/register
/api/donations
/api/saved
/api/organization/campaigns
/api/organization/updates
/api/admin/campaigns
/api/admin/updates
/api/partners
```

## 6. Database Schema / ERD Mô Tả

Thiết kế dữ liệu nằm trong `prisma/schema.prisma`.

```text
Organization 1 --- n User
Organization 1 --- n Campaign
Organization 1 --- n Partner

Category 1 --- n Campaign

Campaign 1 --- n CampaignUpdate
Campaign 1 --- n Donation
Campaign 1 --- n SavedCampaign

User 1 --- n Donation
User 1 --- n SavedCampaign
User 1 --- n Notification
User 1 --- n Session
User 1 --- n AuditLog as actor

Donation 1 --- 1 PaymentReceipt
```

Các bảng chính:

- `User`: tài khoản, role, status, organizationId.
- `Session`: custom auth session bằng cookie.
- `Organization`: tổ chức thiện nguyện/doanh nghiệp/cộng đồng, trạng thái xác minh, điểm minh bạch.
- `Category`: lĩnh vực chiến dịch.
- `Campaign`: thông tin chiến dịch, target/current amount, status, fundAllocation, transparencyScore.
- `CampaignUpdate`: cập nhật minh chứng, fundUsed, evidenceUrl, status.
- `Donation`: giao dịch ủng hộ, amount, method, transactionCode, status.
- `PaymentReceipt`: biên nhận, receiptNumber, reconciliation.
- `Partner`: đối tác đồng hành, tier, contribution, status.
- `SavedCampaign`: wishlist/follow campaign.
- `Notification`: thông báo nội bộ demo.
- `AuditLog`: nhật ký thao tác nền tảng.

Status logic:

```text
User role: ADMIN, DONOR, CHARITY, PARTNER
Campaign status: DRAFT, PENDING_REVIEW, ACTIVE, COMPLETED, REJECTED, ARCHIVED
Update status: PENDING_REVIEW, APPROVED, REJECTED
Donation status: PENDING, SUCCESS, FAILED, REFUNDED
Verification status: PENDING, VERIFIED, REJECTED
```

## 7. UI Page Plan

- **Home**: hero có value proposition, KPI, chiến dịch nổi bật, quy trình 4 bước, đối tác.
- **About**: sứ mệnh, tầm nhìn, mô hình hoạt động, lợi ích theo stakeholder.
- **Campaign listing**: filter theo search/category/province/status, campaign cards có progress.
- **Campaign detail**: ảnh, progress, CTA donate, tổ chức, giao dịch gần đây, minh chứng đã duyệt.
- **Transparency**: KPI, chart dòng tiền, bảng giao dịch, minh chứng, audit trail.
- **Donor account**: tổng đã ủng hộ, biên nhận, thông báo, saved campaigns.
- **Organization dashboard**: số chiến dịch, tổng nhận, minh chứng chờ duyệt, tiến độ.
- **Admin dashboard**: KPI nền tảng, biểu đồ dòng tiền, trạng thái chiến dịch, giao dịch mới.
- **Admin campaign/update pages**: thao tác duyệt/từ chối trực tiếp.
- **Admin reports**: trang tổng hợp để nhóm dùng khi thuyết trình.

## 8. Source Code Structure

```text
app/
  api/                         Route handlers cho auth, donation, admin, org
  campaigns/                   Public campaign marketplace và detail
  account/                     Donor portal
  organization/                Charity organization portal
  admin/                       Admin console
components/
  charts/                      Recharts components
  forms/                       Client forms và action buttons
  layout/                      Header, footer, dashboard nav
  ui/                          Button, card, badge, progress, stat card
lib/
  auth.ts                      Session auth + RBAC
  data.ts                      Shared data queries
  prisma.ts                    Prisma client singleton
  utils.ts                     Format currency/date/slug/status
  validators.ts                Zod validation
prisma/
  schema.prisma                Database design
  init-db.mjs                  SQLite fallback initializer
  seed.ts                      Seed data Việt Nam
```

## 9. Seed Data

Seed gồm:

- 5 tổ chức thiện nguyện/cộng đồng.
- 10 chiến dịch ở Việt Nam.
- 28 giao dịch mẫu ban đầu, cộng thêm giao dịch nếu chạy donation flow demo.
- 3 doanh nghiệp đối tác.
- 4 cập nhật minh chứng, trong đó có cập nhật chờ admin duyệt.
- Audit logs cho các nghiệp vụ quan trọng.
- Demo accounts đủ vai trò.

Tài khoản demo:

| Vai trò | Email | Mật khẩu |
|---|---|---|
| Admin | 24521720@gm.uit.edu.vn | 123456 |
| Donor | donor@opencharity.vn | 123456 |
| Charity organization | charity@opencharity.vn | 123456 |
| Partner | partner@opencharity.vn | 123456 |

## 10. Cài Đặt Và Chạy Local

Yêu cầu:

- Node.js 20+ khuyến nghị, hiện đã kiểm thử với Node v24.14.1.
- npm.

Cài đặt nhanh:

```bash
npm run setup
npm run dev
```

Mở:

```text
http://127.0.0.1:3000
```

Nếu đã cài dependency rồi và chỉ muốn reset dữ liệu:

```bash
npm run db:reset
```

Nếu muốn dùng Prisma CLI chuẩn:

```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

Ghi chú: trên một số máy Windows + Node 24, `prisma db push` có thể báo `Schema engine error`. Khi đó dùng script fallback:

```bash
npm run db:init
npm run db:seed
```

## 11. QA Checklist Đã Thực Hiện

- `npm install`: thành công.
- `npx prisma generate`: thành công.
- `npm run db:init`: tạo SQLite thành công.
- `npm run db:seed`: seed data thành công.
- `npm run build`: build production thành công.
- Public routes trả HTTP 200: `/`, `/campaigns`, `/transparency`, `/login`.
- API login donor trả 200.
- API donation tạo transaction + redirect payment success thành công.
- Admin dashboard sau login trả 200.
- Organization dashboard sau login trả 200.

## 12. Demo Script Cho Buổi Báo Cáo

### Luồng 1: Public -> Donor -> Donation -> Receipt

1. Mở `/`.
2. Giới thiệu value proposition và KPI.
3. Vào `/campaigns`, lọc theo lĩnh vực hoặc địa phương.
4. Mở một campaign detail.
5. Bấm `Ủng hộ ngay`.
6. Đăng nhập `donor@opencharity.vn / 123456` nếu chưa login.
7. Chọn số tiền, phương thức VNPay sandbox, submit.
8. Màn hình success hiển thị transaction code và receipt.
9. Mở `/account/donations` để xem lịch sử.
10. Mở `/transparency` để thấy dữ liệu giao dịch tăng.

### Luồng 2: Charity tạo campaign -> Admin duyệt -> Public thấy

1. Đăng nhập `charity@opencharity.vn / 123456`.
2. Vào `/organization/campaigns/new`.
3. Tạo chiến dịch mới, trạng thái sẽ là `PENDING_REVIEW`.
4. Đăng xuất, đăng nhập admin.
5. Vào `/admin/campaigns`.
6. Bấm `Duyệt`.
7. Quay lại `/campaigns`, chiến dịch xuất hiện public.

### Luồng 3: Charity gửi minh chứng -> Admin duyệt -> Transparency thay đổi

1. Đăng nhập charity.
2. Vào `/organization/updates`.
3. Gửi cập nhật minh chứng cho campaign ACTIVE.
4. Đăng nhập admin.
5. Vào `/admin/updates`.
6. Duyệt cập nhật.
7. Mở campaign detail và `/transparency` để thấy minh chứng công khai.

### Luồng 4: Admin vận hành nền tảng

1. Đăng nhập `admin@opencharity.vn / 123456`.
2. Mở `/admin`.
3. Trình bày KPI: tổng donation, số campaign, số user, minh chứng chờ duyệt.
4. Mở `/admin/transactions` để chứng minh logic e-commerce.
5. Mở `/admin/audit` để chứng minh governance.
6. Mở `/admin/reports` để kết luận bằng checklist thuyết trình.


## 13. Hạn Chế Và Hướng Phát Triển

- Chưa có upload file thật; hiện dùng evidence URL.
- Chưa gửi email thật; hiện mô phỏng notification.
- Chưa tích hợp payment gateway thật.
- Chưa có phân quyền chi tiết cấp permission/action, mới dừng ở role-level RBAC.
- Chưa có export PDF/Excel; report center đang là trang demo.

Hướng nâng cấp:

- Chuyển SQLite sang PostgreSQL.
- Tích hợp NextAuth hoặc provider OAuth.
- Tích hợp VNPay/MoMo sandbox thật.
- Upload chứng từ lên S3/R2.
- Export báo cáo PDF cho từng campaign.
- Thêm unit/integration tests cho API routes.

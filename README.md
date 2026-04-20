# OpenCharity - Nền tảng Gây quỹ & Từ thiện Minh bạch

Prototype website học thuật theo báo cáo đồ án: **OpenCharity – nền tảng thương mại điện tử thiện nguyện minh bạch theo mô hình B2B2C**.

Đồ án môn **Quản trị dự án thương mại điện tử**  
Lớp: **EC208.Q21**  
GVHD: ThS. Huỳnh Đức Huy

OpenCharity không phải website quyên tiền trực tiếp thông thường. Prototype này mô phỏng quy trình tài trợ **vật phẩm có thể truy vết**:

Thành viên:

| Họ tên | MSSV | Vai trò |
|---|---|---|
| Nguyễn Minh Thời | 24521720 | Nhóm trưởng |
| Nguyễn Văn Gia Bảo | 24520176 | Thành viên |
| Lê Hiếu Huy | 24520666 | Thành viên |
| Bùi Quốc Trung | 24521872 | Thành viên |
| Lê Văn Hoàng | 24520545 | Thành viên |
| Lưu Nhật Quang | 24521496 | Thành viên |

- Tổ chức thiện nguyện tạo chiến dịch và khai báo nhu cầu vật phẩm.
- Nhà hảo tâm chọn vật phẩm, thêm vào giỏ và thanh toán sandbox.
- Nhà cung cấp nhận đơn, xử lý và cập nhật giao nhận.
- Tổ chức tiếp nhận upload Proof of Delivery (POD).
- Admin kiểm duyệt chiến dịch, POD, giao dịch và dữ liệu minh bạch.

## 1. Tóm tắt yêu cầu hệ thống rút ra từ báo cáo

### Bài toán cốt lõi

Hoạt động từ thiện online dễ thiếu minh bạch nếu chỉ chuyển tiền trực tiếp mà không theo dõi được vật phẩm, giao nhận và bằng chứng sử dụng. OpenCharity chuyển trọng tâm sang mô hình tài trợ vật phẩm thông qua marketplace thiện nguyện, nơi mọi đơn tài trợ có supplier, trạng thái giao hàng và POD.

### Mô hình hoạt động

Mô hình B2B2C gồm bốn stakeholder:

1. **Charitable Organization / Mái ấm / Tổ chức từ thiện** tạo chiến dịch, khai báo nhu cầu vật phẩm, gửi hồ sơ chờ duyệt và upload POD sau khi nhận hàng.
2. **Donor / Nhà hảo tâm** duyệt chiến dịch, chọn vật phẩm, thêm vào giỏ, thanh toán sandbox, theo dõi đơn và xem bằng chứng minh bạch.
3. **Supplier / Nhà cung cấp** nhận đơn mua sắm, xử lý đơn, cập nhật giao nhận và đánh dấu đã giao hàng.
4. **Admin / Platform Operator** kiểm duyệt chiến dịch, quản lý người dùng, supplier, đơn hàng, payment sandbox và nội dung minh bạch.

### In-scope

- Website prototype chạy được trên local staging-like.
- Frontend ReactJS, backend NodeJS + Express, database MongoDB.
- Campaign marketplace, campaign detail, requested items.
- Cart, order, payment sandbox tương đương MoMo Sandbox.
- Delivery tracking near real-time qua API.
- Proof of Delivery và Proof of Transparency.
- RBAC cho `ADMIN`, `DONOR`, `CHARITY`, `SUPPLIER`.
- Dashboard cơ bản cho admin, charity, supplier và donor profile.
- Seed data tiếng Việt đủ để demo.

### Out-of-scope

- Không thanh toán thật.
- Không production deployment thật.
- Không mobile app native.
- Không GPS logistics thời gian thực thật.
- Không đa ngôn ngữ, đa tiền tệ.
- Không thương mại hóa thật.
- Không thêm module enterprise ngoài phạm vi học thuật.

### Module website bắt buộc

- Trang chủ có trải nghiệm chính ngay: vào campaign và tài trợ vật phẩm.
- Danh sách chiến dịch.
- Chi tiết chiến dịch.
- Giỏ hàng.
- Thanh toán sandbox.
- Đơn hàng và giao nhận.
- Quản lý chiến dịch cho tổ chức thiện nguyện.
- Supplier dashboard.
- Proof of Transparency.
- User Profile & Impact.
- Login/RBAC.
- Admin dashboard.

### Tiêu chí nghiệm thu prototype

- Chạy được bằng local dev server.
- Có dữ liệu thật, không lorem ipsum.
- Có đủ bốn actor và luồng nghiệp vụ chính.
- Donor hoàn tất được flow chọn vật phẩm -> cart -> checkout sandbox -> order tracking.
- Charity tạo campaign chờ duyệt và upload POD.
- Supplier cập nhật delivery.
- Admin duyệt campaign và POD.
- Dữ liệu minh bạch thể hiện payment, delivery, POD và audit trail.
- Form có validation ở client và server.

## 2. Các giả định bổ sung

Các giả định dưới đây chỉ để hoàn thiện prototype khi báo cáo chưa nêu chi tiết:

- Payment sandbox được mô phỏng bằng API nội bộ, provider mặc định là `MoMo Sandbox`, không gọi gateway thật.
- Upload file thật được thay bằng URL ảnh minh chứng để demo ổn định trên local.
- Tracking giao nhận là near real-time qua API refresh/action, không dùng GPS thật.
- Token auth là signed local token đủ cho demo RBAC, không phải giải pháp production.
- MongoDB chạy local qua MongoDB Community hoặc Docker Compose.

## 3. Sitemap

```text
/
/campaigns
/campaigns/:slug
/cart
/checkout
/orders
/transparency
/profile
/login
/organization
/supplier
/admin

/api/health
/api/auth/login
/api/auth/me
/api/stats
/api/suppliers
/api/campaigns
/api/campaigns/:slug
/api/cart
/api/cart/items
/api/checkout
/api/orders
/api/orders/:id/delivery
/api/pod
/api/transparency
/api/profile
/api/organization/dashboard
/api/supplier/dashboard
/api/admin/dashboard
/api/admin/campaigns/:id
/api/admin/proofs/:id
```

## 4. User flow

### Luồng 1: Donor

1. Vào `/`.
2. Mở `/campaigns`.
3. Xem chi tiết campaign.
4. Chọn vật phẩm cần tài trợ.
5. Thêm vào `/cart`.
6. Thanh toán tại `/checkout` bằng MoMo Sandbox mô phỏng.
7. Xem `/orders`.
8. Khi supplier và charity hoàn tất, xem POD tại `/transparency`.

### Luồng 2: Charitable Organization

1. Đăng nhập tài khoản charity.
2. Vào `/organization`.
3. Tạo campaign mới và khai báo requested items.
4. Campaign ở trạng thái `PENDING_REVIEW`.
5. Khi nhận hàng, chọn order và upload POD.
6. POD chờ admin duyệt trước khi public.

### Luồng 3: Supplier

1. Đăng nhập tài khoản supplier.
2. Vào `/supplier`.
3. Xem các order cần xử lý.
4. Cập nhật `SUPPLIER_PROCESSING`, `PACKED`, `IN_TRANSIT`, `DELIVERED`.
5. Order chuyển sang charity upload POD.

### Luồng 4: Admin

1. Đăng nhập admin.
2. Vào `/admin`.
3. Duyệt hoặc từ chối campaign.
4. Xác thực hoặc từ chối POD.
5. Theo dõi user, supplier, order, payment sandbox và audit log.

## 5. Database design

Backend dùng Mongoose models trong `server/models.js`.

```text
Role
User
Organization
Supplier
Campaign
RequestedItem
Cart
Order
Payment
Delivery
ProofOfDelivery
TransparencyEvidence
AdminLog
```

Quan hệ chính:

```text
Organization 1 --- n User
Organization 1 --- n Campaign
Supplier 1 --- n RequestedItem
Supplier 1 --- n Order
Campaign 1 --- n RequestedItem
Campaign 1 --- n Order
Campaign 1 --- n TransparencyEvidence
User(DONOR) 1 --- 1 Cart
User(DONOR) 1 --- n Order
Order 1 --- 1 Payment
Order 1 --- 1 Delivery
Order 1 --- n ProofOfDelivery
ProofOfDelivery n --- 1 Admin verifier
AdminLog n --- 1 User actor
```

Các trạng thái chính:

```text
User role: ADMIN, DONOR, CHARITY, SUPPLIER
Campaign status: DRAFT, PENDING_REVIEW, ACTIVE, COMPLETED, REJECTED, ARCHIVED
Order status: ORDER_CREATED, PAYMENT_SUCCESS, SUPPLIER_PROCESSING, PACKED, IN_TRANSIT, DELIVERED, POD_UPLOADED, COMPLETED, CANCELLED
Delivery status: WAITING_SUPPLIER, SUPPLIER_PROCESSING, PACKED, IN_TRANSIT, DELIVERED, POD_PENDING_REVIEW, POD_APPROVED
Payment status: SUCCESS, PENDING, FAILED
POD/Evidence status: PENDING_REVIEW, APPROVED, REJECTED
```

## 6. Danh sách tính năng theo mức ưu tiên

### Must-have

- Campaign marketplace.
- Campaign detail có requested items, supplier, progress.
- Cart và checkout sandbox.
- Order và delivery tracking.
- POD upload và admin review.
- Proof of Transparency.
- RBAC đủ bốn vai trò.
- Dashboard admin, charity, supplier, profile donor.
- Seed data đầy đủ.

### Should-have

- Chart thống kê transparency.
- Audit log.
- Docker Compose MongoDB.
- Demo script bảo vệ đồ án.

### Could-have

- Payment gateway sandbox thật.
- Upload file lên storage.
- Export PDF/Excel.
- GPS logistics thật.

## 7. Kế hoạch UI pages

Brand bám báo cáo:

- Font: Inter/system fallback.
- Primary: Teal `#0D9488`.
- CTA: Amber `#F59E0B`.
- Tone: minh bạch, đáng tin cậy, hiện đại, ấm áp.

Pages:

- **Home**: trải nghiệm chính, CTA tài trợ vật phẩm, KPI, quy trình B2B2C.
- **Campaigns**: search/filter campaign.
- **Campaign Detail**: mô tả, progress, requested item cards, supplier, recent tracking, evidence.
- **Cart**: danh sách vật phẩm theo campaign/supplier.
- **Checkout**: payment sandbox mô phỏng, tạo order/payment/delivery.
- **Orders**: tracking và timeline.
- **Transparency**: KPI, chart payment, POD, transaction table, audit trail.
- **Profile**: impact donor và donation/order history.
- **Organization**: tạo campaign, xem campaign, upload POD.
- **Supplier**: xử lý order và cập nhật delivery.
- **Admin**: duyệt campaign, duyệt POD, xem users/orders/audit.

## 8. Source code hoàn chỉnh

Cấu trúc code chính:

```text
client/src/
  App.jsx
  main.jsx
  index.css
  components/
  context/
  lib/
  pages/

server/
  index.js
  config/db.js
  lib/auth.js
  lib/metrics.js
  models.js
  routes/api.js
  seed.js

docker-compose.yml
vite.config.js
tailwind.config.ts
```

Các thư mục `app/`, `components/`, `lib/`, `prisma/` cũ trong repo là prototype trước đó và không còn là đường chạy chính. Scripts hiện tại chạy theo MERN ở `client/` và `server/`.

## 9. Seed data

Seed trong `server/seed.js` tạo:

- 5 tổ chức thiện nguyện.
- 4 nhà cung cấp.
- 8 chiến dịch.
- 25 donor bao gồm demo donor.
- 24 order/payment sandbox.
- Delivery ở nhiều trạng thái.
- POD approved và pending.
- Transparency evidence.
- Admin audit logs.
- Cart mẫu cho donor demo.

Tài khoản demo:

| Vai trò | Email | Mật khẩu |
|---|---|---|
| Admin | 24521720@gm.uit.edu.vn | 123456 |
| Donor | donor@opencharity.vn | 123456 |
| Charity organization | charity@opencharity.vn | 123456 |
| Supplier | supplier@opencharity.vn | 123456 |

## 10. Cài đặt và chạy local staging-like

Yêu cầu:

- Node.js 20+.
- npm.
- MongoDB local hoặc Docker Desktop.

Cài dependency:

```bash
npm install
```

Tạo `.env`:

```bash
cp .env.example .env
```

Nội dung mặc định:

```text
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/opencharity_demo
CLIENT_URL=http://127.0.0.1:5173
```

Chạy MongoDB bằng Docker:

```bash
npm run mongo:up
```

Hoặc dùng MongoDB Community đang chạy sẵn ở `127.0.0.1:27017`.

Seed data:

```bash
npm run seed
```

Chạy dev:

```bash
npm run dev
```

Mở:

```text
Frontend: http://127.0.0.1:5173
Backend:  http://127.0.0.1:5000/api/health
```

Build production:

```bash
npm run build
npm start
```

## 11. QA checklist

Đã kiểm tra trong phiên build:

- `npm install`: thành công sau khi cho phép tải dependency.
- `node --check server/index.js`: pass.
- `node --check server/seed.js`: pass.
- `npm run build`: pass.
- `npm run seed`: chưa chạy được vì MongoDB local/Docker daemon chưa bật trên máy hiện tại.
- `docker compose up -d`: Docker CLI có, nhưng Docker Desktop daemon chưa chạy.

Checklist cần chạy sau khi bật MongoDB:

- Seed tạo đủ campaign, users, orders, payments, deliveries, POD.
- Login đủ 4 tài khoản demo.
- Donor thêm vật phẩm vào cart và checkout sandbox.
- Supplier cập nhật delivery.
- Charity upload POD cho order đã giao.
- Admin duyệt campaign pending.
- Admin duyệt POD pending.
- `/transparency` hiển thị payment, POD, audit log.
- RBAC chặn donor vào `/admin`, supplier vào `/organization`.

## 12. Demo script bảo vệ đồ án

### Script mở đầu

"OpenCharity không phải website bán hàng thông thường và cũng không phải trang quyên tiền trực tiếp. Đây là charity marketplace theo mô hình B2B2C, trong đó donor tài trợ vật phẩm, supplier giao hàng trực tiếp, tổ chức upload POD và admin xác thực minh bạch."

### Demo 1: Donor tài trợ vật phẩm

1. Mở `/`.
2. Vào `/campaigns`.
3. Mở một campaign.
4. Chọn vật phẩm và bấm thêm vào giỏ.
5. Đăng nhập `donor@opencharity.vn / 123456` nếu cần.
6. Vào `/cart`.
7. Checkout bằng MoMo Sandbox.
8. Mở `/orders` để xem trạng thái giao nhận.

### Demo 2: Supplier xử lý đơn

1. Đăng nhập `supplier@opencharity.vn / 123456`.
2. Vào `/supplier`.
3. Chọn một order.
4. Cập nhật lần lượt `SUPPLIER_PROCESSING`, `PACKED`, `IN_TRANSIT`, `DELIVERED`.
5. Giải thích đây là tracking near real-time ở mức prototype.

### Demo 3: Charity upload POD

1. Đăng nhập `charity@opencharity.vn / 123456`.
2. Vào `/organization`.
3. Tạo campaign mới để thấy trạng thái `PENDING_REVIEW`.
4. Chọn một order và upload POD bằng URL ảnh.
5. Giải thích POD chưa public cho đến khi admin duyệt.

### Demo 4: Admin kiểm duyệt và minh bạch

1. Đăng nhập `admin@opencharity.vn / 123456`.
2. Vào `/admin`.
3. Duyệt campaign pending.
4. Duyệt POD pending.
5. Mở `/transparency`.
6. Chỉ ra payment sandbox, POD công khai, chart, audit trail và dữ liệu đối soát.

## 13. Điểm nhấn với giảng viên

- Prototype chạy thật, có frontend, backend và MongoDB.
- Bám mô hình B2B2C từ báo cáo.
- Tài trợ vật phẩm thay vì quyên tiền trực tiếp.
- Có cart/order/payment sandbox như e-commerce nhưng dùng cho social impact.
- Có supplier và delivery tracking.
- Có POD và admin review để minh bạch hóa.
- Có seed data Việt Nam, không dùng lorem ipsum.
- Có dashboard và RBAC đủ bốn actor.

## 14. Hạn Chế Và Hướng Phát Triển

- Chưa có upload file thật; hiện dùng evidence URL.
- Chưa gửi email thật; hiện mô phỏng notification trong dashboard/demo flow.
- Chưa tích hợp payment gateway thật; payment hiện là sandbox nội bộ.
- Chưa có phân quyền chi tiết cấp permission/action, mới dừng ở role-level RBAC.
- Chưa có export PDF/Excel; report center có thể bổ sung ở giai đoạn sau.

Hướng nâng cấp:

- Tách API service và frontend deployment rõ ràng hơn.
- Tích hợp VNPay/MoMo sandbox thật.
- Upload chứng từ lên S3/R2.
- Export báo cáo PDF cho từng campaign.
- Thêm unit/integration tests cho API routes.

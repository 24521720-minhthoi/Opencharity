import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const image = {
  classroom: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
  clinic: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
  food: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80",
  flood: "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=80",
  farmer: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80",
  library: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80",
  water: "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=80",
  women: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80",
  green: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80",
  elderly: "https://images.unsplash.com/photo-1516307365426-bea591f05011?auto=format&fit=crop&w=1200&q=80"
};

async function main() {
  await prisma.session.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.savedCampaign.deleteMany();
  await prisma.paymentReceipt.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.campaignUpdate.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  const passwordHash = await bcrypt.hash("123456", 10);

  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Giáo dục",
        slug: "giao-duc",
        description: "Học bổng, thiết bị học tập, thư viện và hạ tầng trường học."
      }
    }),
    prisma.category.create({
      data: {
        name: "Y tế cộng đồng",
        slug: "y-te-cong-dong",
        description: "Thiết bị y tế, khám sàng lọc, hỗ trợ bệnh nhân yếu thế."
      }
    }),
    prisma.category.create({
      data: {
        name: "Cứu trợ khẩn cấp",
        slug: "cuu-tro-khan-cap",
        description: "Lương thực, nước sạch, phục hồi sinh kế sau thiên tai."
      }
    }),
    prisma.category.create({
      data: {
        name: "Sinh kế bền vững",
        slug: "sinh-ke-ben-vung",
        description: "Hỗ trợ vốn, kỹ năng, công cụ lao động cho hộ khó khăn."
      }
    }),
    prisma.category.create({
      data: {
        name: "Môi trường",
        slug: "moi-truong",
        description: "Trồng cây, giảm rác thải, bảo vệ nguồn nước và đa dạng sinh học."
      }
    })
  ]);

  const bySlug = Object.fromEntries(categories.map((category) => [category.slug, category]));

  const organizations = await Promise.all([
    prisma.organization.create({
      data: {
        name: "Quỹ Sáng Đèn Bản Xa",
        slug: "quy-sang-den-ban-xa",
        type: "CHARITY",
        verificationStatus: "VERIFIED",
        taxCode: "031-OC-2024-01",
        representative: "Nguyễn Thị Mai",
        email: "contact@sangdenbanxa.vn",
        phone: "028 7300 1122",
        location: "TP. Hồ Chí Minh",
        mission: "Đưa điều kiện học tập thiết yếu đến học sinh vùng sâu bằng mô hình tài trợ minh bạch theo từng trường.",
        transparencyScore: 92,
        website: "https://sangdenbanxa.vn"
      }
    }),
    prisma.organization.create({
      data: {
        name: "Trung tâm Y tế Cộng đồng An Tâm",
        slug: "y-te-cong-dong-an-tam",
        type: "CHARITY",
        verificationStatus: "VERIFIED",
        taxCode: "010-OC-2024-02",
        representative: "Phạm Quốc Huy",
        email: "hello@antamhealth.vn",
        phone: "024 6688 0911",
        location: "Hà Nội",
        mission: "Tổ chức các chương trình khám sàng lọc và hỗ trợ thiết bị y tế cho điểm chăm sóc sức khỏe tuyến cơ sở.",
        transparencyScore: 88,
        website: "https://antamhealth.vn"
      }
    }),
    prisma.organization.create({
      data: {
        name: "Mạng lưới Bếp Ấm Việt",
        slug: "mang-luoi-bep-am-viet",
        type: "COMMUNITY",
        verificationStatus: "VERIFIED",
        taxCode: "079-OC-2024-03",
        representative: "Lê Thanh Vân",
        email: "ops@bepamviet.vn",
        phone: "0909 122 321",
        location: "Đà Nẵng",
        mission: "Điều phối thực phẩm và suất ăn khẩn cấp cho nhóm lao động yếu thế, người già neo đơn và khu vực bị thiên tai.",
        transparencyScore: 86
      }
    }),
    prisma.organization.create({
      data: {
        name: "Hợp tác xã Xanh Đồng Bằng",
        slug: "htx-xanh-dong-bang",
        type: "COMMUNITY",
        verificationStatus: "VERIFIED",
        taxCode: "180-OC-2024-04",
        representative: "Trần Văn Phúc",
        email: "info@xanhdongbang.vn",
        phone: "0292 377 8899",
        location: "Cần Thơ",
        mission: "Hỗ trợ sinh kế bền vững cho nông hộ và nhóm phụ nữ tại Đồng bằng sông Cửu Long.",
        transparencyScore: 84
      }
    }),
    prisma.organization.create({
      data: {
        name: "Viện Nước Sạch Cộng Đồng",
        slug: "vien-nuoc-sach-cong-dong",
        type: "CHARITY",
        verificationStatus: "PENDING",
        taxCode: "031-OC-2025-05",
        representative: "Bùi Minh Đức",
        email: "audit@nuocsach.org",
        phone: "028 3900 4567",
        location: "Long An",
        mission: "Lắp đặt trạm lọc nước quy mô nhỏ và đào tạo cộng đồng bảo trì hệ thống.",
        transparencyScore: 72
      }
    })
  ]);

  const org = Object.fromEntries(organizations.map((organization) => [organization.slug, organization]));

  const [admin, donor, charityUser, partnerUser] = await Promise.all([
    prisma.user.create({
      data: {
        email: "admin@opencharity.vn",
        passwordHash,
        name: "Admin OpenCharity",
        phone: "0900000001",
        role: "ADMIN",
        status: "ACTIVE"
      }
    }),
    prisma.user.create({
      data: {
        email: "donor@opencharity.vn",
        passwordHash,
        name: "Nguyễn Minh An",
        phone: "0900000002",
        role: "DONOR",
        status: "ACTIVE"
      }
    }),
    prisma.user.create({
      data: {
        email: "charity@opencharity.vn",
        passwordHash,
        name: "Nguyễn Thị Mai",
        phone: "0900000003",
        role: "CHARITY",
        status: "ACTIVE",
        organizationId: org["quy-sang-den-ban-xa"].id
      }
    }),
    prisma.user.create({
      data: {
        email: "partner@opencharity.vn",
        passwordHash,
        name: "Trần Khoa - CSR Manager",
        phone: "0900000004",
        role: "PARTNER",
        status: "ACTIVE"
      }
    })
  ]);

  const extraDonors = await Promise.all(
    [
      "Hoàng Anh Tuấn",
      "Lê Ngọc Hân",
      "Phạm Thu Trang",
      "Đỗ Minh Quân",
      "Võ Thảo Linh",
      "Bùi Gia Khánh"
    ].map((name, index) =>
      prisma.user.create({
        data: {
          email: `supporter${index + 1}@opencharity.vn`,
          passwordHash,
          name,
          role: "DONOR",
          status: "ACTIVE"
        }
      })
    )
  );

  const campaigns = await Promise.all([
    prisma.campaign.create({
      data: {
        title: "Trao 120 bộ máy tính học tập cho học sinh Nậm Chảy",
        slug: "trao-120-bo-may-tinh-hoc-tap-nam-chay",
        summary: "Trang bị phòng học số cho học sinh vùng cao Lào Cai, kèm quy trình bàn giao và bảo trì 12 tháng.",
        description:
          "Chiến dịch mua 120 bộ máy tính cấu hình cơ bản, thiết lập phòng học số tại Trường PTDTBT THCS Nậm Chảy và đào tạo giáo viên phụ trách. OpenCharity theo dõi chứng từ mua sắm, biên bản bàn giao, hình ảnh lớp học và phản hồi định kỳ từ nhà trường.",
        imageUrl: image.classroom,
        province: "Lào Cai",
        beneficiary: "Trường PTDTBT THCS Nậm Chảy",
        targetAmount: 420000000,
        impactMetric: "120 học sinh có thiết bị học tập số",
        startDate: new Date("2026-03-01"),
        endDate: new Date("2026-06-30"),
        status: "ACTIVE",
        transparencyScore: 94,
        fundAllocation: "82% mua thiết bị, 8% vận chuyển, 5% đào tạo giáo viên, 5% bảo trì và kiểm toán chứng từ.",
        organizationId: org["quy-sang-den-ban-xa"].id,
        categoryId: bySlug["giao-duc"].id
      }
    }),
    prisma.campaign.create({
      data: {
        title: "Tủ thuốc tuyến xã cho 6 điểm y tế miền Trung",
        slug: "tu-thuoc-tuyen-xa-6-diem-y-te-mien-trung",
        summary: "Bổ sung thiết bị sơ cứu, máy đo huyết áp và vật tư tiêu hao cho các điểm y tế xa trung tâm.",
        description:
          "Mỗi điểm y tế nhận một bộ thiết bị gồm máy đo huyết áp, máy đo đường huyết, bộ sơ cứu, vật tư tiêu hao và bộ hướng dẫn quản lý tồn kho. Dữ liệu đối soát gồm báo giá, hóa đơn, phiếu nhập kho và xác nhận nhận hàng của từng trạm.",
        imageUrl: image.clinic,
        province: "Quảng Trị",
        beneficiary: "6 trạm y tế xã vùng xa",
        targetAmount: 280000000,
        impactMetric: "18.000 lượt người dân được tiếp cận sơ cứu ban đầu",
        startDate: new Date("2026-02-15"),
        endDate: new Date("2026-05-30"),
        status: "ACTIVE",
        transparencyScore: 90,
        fundAllocation: "76% thiết bị y tế, 12% vật tư tiêu hao, 7% logistics, 5% kiểm định và đối soát.",
        organizationId: org["y-te-cong-dong-an-tam"].id,
        categoryId: bySlug["y-te-cong-dong"].id
      }
    }),
    prisma.campaign.create({
      data: {
        title: "10.000 suất ăn sau lũ cho Quảng Bình",
        slug: "10000-suat-an-sau-lu-quang-binh",
        summary: "Điều phối bếp cộng đồng, nguyên liệu và vận chuyển suất ăn đến khu dân cư bị chia cắt sau mưa lũ.",
        description:
          "Mạng lưới Bếp Ấm Việt phối hợp nhóm tình nguyện địa phương để chuẩn bị suất ăn nóng, nước uống và lương khô trong 10 ngày. Mỗi đợt phát có bảng kê số lượng, tuyến đường, người nhận đại diện và ảnh bàn giao được admin duyệt trước khi công khai.",
        imageUrl: image.food,
        province: "Quảng Bình",
        beneficiary: "2.500 hộ dân bị ảnh hưởng bởi lũ",
        targetAmount: 350000000,
        impactMetric: "10.000 suất ăn và 6.000 chai nước sạch",
        startDate: new Date("2026-03-12"),
        endDate: new Date("2026-04-30"),
        status: "ACTIVE",
        transparencyScore: 91,
        fundAllocation: "68% nguyên liệu, 15% nước uống, 10% vận chuyển, 7% bao bì và đối soát.",
        organizationId: org["mang-luoi-bep-am-viet"].id,
        categoryId: bySlug["cuu-tro-khan-cap"].id
      }
    }),
    prisma.campaign.create({
      data: {
        title: "Quỹ giống và phân hữu cơ cho nông hộ Cù Lao Dung",
        slug: "quy-giong-phan-huu-co-cu-lao-dung",
        summary: "Hỗ trợ giống cây chịu mặn, phân hữu cơ và tập huấn canh tác cho 80 hộ nông dân Sóc Trăng.",
        description:
          "Chiến dịch tài trợ theo gói sinh kế, mỗi hộ nhận giống cây phù hợp, phân hữu cơ và 2 buổi tập huấn. Hợp tác xã cập nhật danh sách hộ nhận, ảnh bàn giao và kết quả sau mùa vụ để donor theo dõi tác động dài hạn.",
        imageUrl: image.farmer,
        province: "Sóc Trăng",
        beneficiary: "80 hộ nông dân Cù Lao Dung",
        targetAmount: 240000000,
        impactMetric: "80 hộ có đầu vào sản xuất thích ứng mặn",
        startDate: new Date("2026-01-20"),
        endDate: new Date("2026-05-15"),
        status: "ACTIVE",
        transparencyScore: 86,
        fundAllocation: "70% giống và phân hữu cơ, 15% tập huấn, 10% vận chuyển, 5% đo lường tác động.",
        organizationId: org["htx-xanh-dong-bang"].id,
        categoryId: bySlug["sinh-ke-ben-vung"].id
      }
    }),
    prisma.campaign.create({
      data: {
        title: "Thư viện mở cho trẻ em đảo Thạnh An",
        slug: "thu-vien-mo-cho-tre-em-dao-thanh-an",
        summary: "Xây dựng góc đọc mở, tủ sách số và hoạt động đọc cuối tuần cho trẻ em xã đảo.",
        description:
          "Quỹ Sáng Đèn Bản Xa triển khai tủ sách giấy, máy đọc sách dùng chung và lịch sinh hoạt đọc. OpenCharity dùng tiến độ mua sách, danh mục ISBN, biên bản bàn giao và ảnh hoạt động để minh bạch hóa toàn bộ quá trình.",
        imageUrl: image.library,
        province: "TP. Hồ Chí Minh",
        beneficiary: "Trẻ em xã đảo Thạnh An",
        targetAmount: 160000000,
        impactMetric: "450 trẻ em có không gian đọc mở",
        startDate: new Date("2026-02-01"),
        endDate: new Date("2026-04-20"),
        status: "COMPLETED",
        transparencyScore: 96,
        fundAllocation: "60% sách và thiết bị đọc, 18% kệ tủ, 12% hoạt động đọc, 10% vận hành và đối soát.",
        organizationId: org["quy-sang-den-ban-xa"].id,
        categoryId: bySlug["giao-duc"].id
      }
    }),
    prisma.campaign.create({
      data: {
        title: "Trạm lọc nước học đường tại Tân Hưng",
        slug: "tram-loc-nuoc-hoc-duong-tan-hung",
        summary: "Lắp đặt hệ thống lọc nước và quy trình kiểm tra chất lượng nước cho 3 trường tiểu học.",
        description:
          "Viện Nước Sạch Cộng Đồng đề xuất lắp 3 trạm lọc nước quy mô trường học, kèm đo mẫu nước đầu vào và đầu ra mỗi tháng. Chiến dịch đang chờ admin kiểm tra pháp lý tổ chức và báo giá thiết bị.",
        imageUrl: image.water,
        province: "Long An",
        beneficiary: "3 trường tiểu học huyện Tân Hưng",
        targetAmount: 300000000,
        impactMetric: "1.200 học sinh có nước uống đạt chuẩn",
        startDate: new Date("2026-04-10"),
        endDate: new Date("2026-07-30"),
        status: "PENDING_REVIEW",
        transparencyScore: 72,
        fundAllocation: "78% thiết bị lọc, 10% lắp đặt, 7% xét nghiệm mẫu nước, 5% bảo trì.",
        riskNote: "Cần bổ sung giấy xác nhận năng lực vận hành sau lắp đặt.",
        organizationId: org["vien-nuoc-sach-cong-dong"].id,
        categoryId: bySlug["y-te-cong-dong"].id
      }
    }),
    prisma.campaign.create({
      data: {
        title: "Gói phục hồi sinh kế cho phụ nữ đơn thân Cần Thơ",
        slug: "goi-phuc-hoi-sinh-ke-phu-nu-don-than-can-tho",
        summary: "Tài trợ bộ dụng cụ bán hàng nhỏ, cố vấn tài chính và theo dõi doanh thu 3 tháng.",
        description:
          "Mỗi người tham gia nhận một gói dụng cụ phù hợp mô hình sinh kế nhỏ như bán bánh, may vá, tạp hóa. Hợp tác xã ghi nhận kế hoạch sử dụng vốn, hóa đơn mua dụng cụ, ảnh bàn giao và cập nhật doanh thu sau 30-60-90 ngày.",
        imageUrl: image.women,
        province: "Cần Thơ",
        beneficiary: "50 phụ nữ đơn thân thu nhập thấp",
        targetAmount: 180000000,
        impactMetric: "50 hộ gia đình tăng năng lực tạo thu nhập",
        startDate: new Date("2026-02-18"),
        endDate: new Date("2026-06-18"),
        status: "ACTIVE",
        transparencyScore: 87,
        fundAllocation: "72% dụng cụ sinh kế, 15% cố vấn tài chính, 8% vận chuyển, 5% đo lường tác động.",
        organizationId: org["htx-xanh-dong-bang"].id,
        categoryId: bySlug["sinh-ke-ben-vung"].id
      }
    }),
    prisma.campaign.create({
      data: {
        title: "Trồng 5.000 cây bản địa tại rừng ngập mặn Cần Giờ",
        slug: "trong-5000-cay-ban-dia-can-gio",
        summary: "Gây quỹ cây giống, công trồng, theo dõi tỷ lệ sống và báo cáo ảnh định vị theo từng lô.",
        description:
          "Chiến dịch tập trung vào cây bản địa phù hợp vùng rừng ngập mặn. Dữ liệu minh bạch gồm hóa đơn cây giống, biên bản nghiệm thu từng lô, ảnh định vị và báo cáo tỷ lệ sống sau 3 tháng.",
        imageUrl: image.green,
        province: "TP. Hồ Chí Minh",
        beneficiary: "Khu vực rừng ngập mặn Cần Giờ",
        targetAmount: 210000000,
        impactMetric: "5.000 cây bản địa được trồng và theo dõi",
        startDate: new Date("2026-03-05"),
        endDate: new Date("2026-08-05"),
        status: "ACTIVE",
        transparencyScore: 89,
        fundAllocation: "64% cây giống, 18% công trồng, 10% theo dõi định vị, 8% truyền thông cộng đồng.",
        organizationId: org["htx-xanh-dong-bang"].id,
        categoryId: bySlug["moi-truong"].id
      }
    }),
    prisma.campaign.create({
      data: {
        title: "Bộ chăm sóc tại nhà cho người cao tuổi neo đơn",
        slug: "bo-cham-soc-tai-nha-nguoi-cao-tuoi-neo-don",
        summary: "Cung cấp thiết bị theo dõi sức khỏe cơ bản và lịch thăm hỏi định kỳ cho người cao tuổi neo đơn.",
        description:
          "Tình nguyện viên y tế cộng đồng hỗ trợ trao bộ chăm sóc gồm máy đo huyết áp, nhiệt kế, hộp thuốc cơ bản và sổ theo dõi. Mỗi lượt bàn giao có chữ ký người nhận hoặc đại diện khu phố.",
        imageUrl: image.elderly,
        province: "Hà Nội",
        beneficiary: "120 người cao tuổi neo đơn",
        targetAmount: 220000000,
        impactMetric: "120 người cao tuổi được theo dõi sức khỏe tại nhà",
        startDate: new Date("2026-03-22"),
        endDate: new Date("2026-07-22"),
        status: "ACTIVE",
        transparencyScore: 88,
        fundAllocation: "74% bộ chăm sóc, 12% tập huấn tình nguyện viên, 8% vận chuyển, 6% hotline theo dõi.",
        organizationId: org["y-te-cong-dong-an-tam"].id,
        categoryId: bySlug["y-te-cong-dong"].id
      }
    }),
    prisma.campaign.create({
      data: {
        title: "Bộ dụng cụ học tập đầu năm cho học sinh Kon Plông",
        slug: "bo-dung-cu-hoc-tap-dau-nam-kon-plong",
        summary: "Chuẩn bị sách vở, balo và dụng cụ học tập cho học sinh bước vào năm học mới.",
        description:
          "Chiến dịch dự kiến triển khai trước năm học mới, đang ở trạng thái bản nháp để tổ chức hoàn thiện danh sách trường, báo giá và phương án bàn giao.",
        imageUrl: image.classroom,
        province: "Kon Tum",
        beneficiary: "Học sinh huyện Kon Plông",
        targetAmount: 190000000,
        impactMetric: "700 học sinh nhận bộ dụng cụ học tập",
        startDate: new Date("2026-05-01"),
        endDate: new Date("2026-08-15"),
        status: "DRAFT",
        transparencyScore: 75,
        fundAllocation: "85% dụng cụ học tập, 10% vận chuyển, 5% đối soát.",
        organizationId: org["quy-sang-den-ban-xa"].id,
        categoryId: bySlug["giao-duc"].id
      }
    })
  ]);

  const campaignBySlug = Object.fromEntries(campaigns.map((campaign) => [campaign.slug, campaign]));
  const donors = [donor, ...extraDonors];
  const donationPlans = [
    ["trao-120-bo-may-tinh-hoc-tap-nam-chay", 5000000, 0, "VNPAY"],
    ["trao-120-bo-may-tinh-hoc-tap-nam-chay", 12000000, 1, "BANK_TRANSFER"],
    ["trao-120-bo-may-tinh-hoc-tap-nam-chay", 25000000, 2, "CORPORATE_MATCHING"],
    ["trao-120-bo-may-tinh-hoc-tap-nam-chay", 7500000, 3, "MOMO"],
    ["tu-thuoc-tuyen-xa-6-diem-y-te-mien-trung", 10000000, 4, "VNPAY"],
    ["tu-thuoc-tuyen-xa-6-diem-y-te-mien-trung", 35000000, 5, "CORPORATE_MATCHING"],
    ["tu-thuoc-tuyen-xa-6-diem-y-te-mien-trung", 2000000, 6, "MOMO"],
    ["10000-suat-an-sau-lu-quang-binh", 18000000, 0, "BANK_TRANSFER"],
    ["10000-suat-an-sau-lu-quang-binh", 42000000, 1, "CORPORATE_MATCHING"],
    ["10000-suat-an-sau-lu-quang-binh", 5000000, 2, "MOMO"],
    ["10000-suat-an-sau-lu-quang-binh", 8000000, 3, "VNPAY"],
    ["quy-giong-phan-huu-co-cu-lao-dung", 6000000, 4, "VNPAY"],
    ["quy-giong-phan-huu-co-cu-lao-dung", 16000000, 5, "BANK_TRANSFER"],
    ["quy-giong-phan-huu-co-cu-lao-dung", 9000000, 6, "MOMO"],
    ["thu-vien-mo-cho-tre-em-dao-thanh-an", 50000000, 0, "CORPORATE_MATCHING"],
    ["thu-vien-mo-cho-tre-em-dao-thanh-an", 32000000, 1, "BANK_TRANSFER"],
    ["thu-vien-mo-cho-tre-em-dao-thanh-an", 28000000, 2, "VNPAY"],
    ["thu-vien-mo-cho-tre-em-dao-thanh-an", 50000000, 3, "CORPORATE_MATCHING"],
    ["goi-phuc-hoi-sinh-ke-phu-nu-don-than-can-tho", 12000000, 4, "VNPAY"],
    ["goi-phuc-hoi-sinh-ke-phu-nu-don-than-can-tho", 7000000, 5, "MOMO"],
    ["trong-5000-cay-ban-dia-can-gio", 15000000, 6, "BANK_TRANSFER"],
    ["trong-5000-cay-ban-dia-can-gio", 25000000, 0, "CORPORATE_MATCHING"],
    ["trong-5000-cay-ban-dia-can-gio", 5000000, 1, "MOMO"],
    ["bo-cham-soc-tai-nha-nguoi-cao-tuoi-neo-don", 9000000, 2, "VNPAY"],
    ["bo-cham-soc-tai-nha-nguoi-cao-tuoi-neo-don", 22000000, 3, "BANK_TRANSFER"],
    ["bo-cham-soc-tai-nha-nguoi-cao-tuoi-neo-don", 30000000, 4, "CORPORATE_MATCHING"],
    ["tu-thuoc-tuyen-xa-6-diem-y-te-mien-trung", 6000000, 5, "MOMO"],
    ["trao-120-bo-may-tinh-hoc-tap-nam-chay", 9500000, 6, "VNPAY"]
  ] as const;

  for (let i = 0; i < donationPlans.length; i += 1) {
    const [slug, amount, donorIndex, method] = donationPlans[i];
    const createdAt = new Date(Date.now() - (donationPlans.length - i) * 1000 * 60 * 60 * 9);
    const donation = await prisma.donation.create({
      data: {
        campaignId: campaignBySlug[slug].id,
        donorId: donors[donorIndex].id,
        amount,
        method,
        status: "SUCCESS",
        transactionCode: `OC-${createdAt.getFullYear()}-${(i + 1).toString().padStart(5, "0")}`,
        message: i % 3 === 0 ? "Mong dự án sớm hoàn thành và cập nhật minh chứng đầy đủ." : undefined,
        createdAt
      }
    });

    await prisma.paymentReceipt.create({
      data: {
        donationId: donation.id,
        receiptNumber: `RCT-${createdAt.getFullYear()}-${(i + 1).toString().padStart(5, "0")}`,
        payerName: donors[donorIndex].name,
        payerEmail: donors[donorIndex].email,
        issuedAt: createdAt,
        reconciliation: `Đã đối soát qua ${method} - batch DEMO-${(Math.floor(i / 5) + 1).toString().padStart(2, "0")}`
      }
    });
  }

  for (const campaign of campaigns) {
    const aggregate = await prisma.donation.aggregate({
      where: { campaignId: campaign.id, status: "SUCCESS" },
      _sum: { amount: true }
    });
    await prisma.campaign.update({
      where: { id: campaign.id },
      data: { currentAmount: aggregate._sum.amount ?? 0 }
    });
  }

  await Promise.all([
    prisma.savedCampaign.create({ data: { userId: donor.id, campaignId: campaignBySlug["trao-120-bo-may-tinh-hoc-tap-nam-chay"].id } }),
    prisma.savedCampaign.create({ data: { userId: donor.id, campaignId: campaignBySlug["10000-suat-an-sau-lu-quang-binh"].id } }),
    prisma.savedCampaign.create({ data: { userId: donor.id, campaignId: campaignBySlug["trong-5000-cay-ban-dia-can-gio"].id } })
  ]);

  await Promise.all([
    prisma.campaignUpdate.create({
      data: {
        campaignId: campaignBySlug["thu-vien-mo-cho-tre-em-dao-thanh-an"].id,
        title: "Hoàn tất bàn giao tủ sách và máy đọc dùng chung",
        summary: "Đội triển khai đã bàn giao 620 đầu sách, 8 máy đọc dùng chung và biên bản nghiệm thu có chữ ký đại diện xã đảo.",
        evidenceUrl: "https://drive.google.com/opencharity-demo/thu-vien-thanh-an",
        imageUrl: image.library,
        fundUsed: 154000000,
        status: "APPROVED",
        createdAt: new Date("2026-04-10T08:30:00")
      }
    }),
    prisma.campaignUpdate.create({
      data: {
        campaignId: campaignBySlug["10000-suat-an-sau-lu-quang-binh"].id,
        title: "Đợt 1 đã phát 2.400 suất ăn nóng",
        summary: "Bếp cộng đồng hoàn tất đợt phát tại xã Tân Hóa, có bảng kê nguyên liệu, ảnh bàn giao và xác nhận của trưởng thôn.",
        evidenceUrl: "https://drive.google.com/opencharity-demo/bep-am-dot-1",
        imageUrl: image.food,
        fundUsed: 78000000,
        status: "APPROVED",
        createdAt: new Date("2026-04-05T14:20:00")
      }
    }),
    prisma.campaignUpdate.create({
      data: {
        campaignId: campaignBySlug["trao-120-bo-may-tinh-hoc-tap-nam-chay"].id,
        title: "Đã chốt báo giá thiết bị và lịch vận chuyển",
        summary: "Tổ chức gửi bảng so sánh 3 nhà cung cấp, dự kiến vận chuyển đợt 1 gồm 40 bộ máy tính vào tuần cuối tháng 4.",
        evidenceUrl: "https://drive.google.com/opencharity-demo/nam-chay-bao-gia",
        imageUrl: image.classroom,
        fundUsed: 0,
        status: "APPROVED",
        createdAt: new Date("2026-04-08T09:10:00")
      }
    }),
    prisma.campaignUpdate.create({
      data: {
        campaignId: campaignBySlug["tu-thuoc-tuyen-xa-6-diem-y-te-mien-trung"].id,
        title: "Minh chứng nhập kho vật tư đợt 1",
        summary: "Tổ chức tải lên phiếu nhập kho và ảnh kiểm đếm 120 bộ sơ cứu. Admin cần duyệt trước khi công khai.",
        evidenceUrl: "https://drive.google.com/opencharity-demo/tu-thuoc-dot-1",
        imageUrl: image.clinic,
        fundUsed: 62000000,
        status: "PENDING_REVIEW",
        createdAt: new Date("2026-04-12T16:45:00")
      }
    })
  ]);

  await Promise.all([
    prisma.partner.create({
      data: {
        name: "FPT Smart Cloud",
        tier: "STRATEGIC",
        logoUrl: "https://dummyimage.com/240x120/0f8f86/ffffff&text=FPT+Cloud",
        contribution: "Tài trợ hạ tầng cloud demo, matching fund cho chiến dịch giáo dục số và cố vấn bảo mật dữ liệu.",
        contactName: "Trần Khoa",
        contactEmail: "csr@fptcloud.vn",
        status: "VERIFIED"
      }
    }),
    prisma.partner.create({
      data: {
        name: "VietinBank Chi nhánh Sài Gòn",
        tier: "IMPACT",
        logoUrl: "https://dummyimage.com/240x120/2563eb/ffffff&text=VietinBank",
        contribution: "Đồng hành đối soát giao dịch chuyển khoản, hỗ trợ báo cáo tài chính chiến dịch.",
        contactName: "Hoàng Minh",
        contactEmail: "csr@vietinbank.vn",
        status: "VERIFIED"
      }
    }),
    prisma.partner.create({
      data: {
        name: "Giao Hàng Xanh",
        tier: "COMMUNITY",
        logoUrl: "https://dummyimage.com/240x120/16a34a/ffffff&text=GHX",
        contribution: "Hỗ trợ 50% chi phí logistics cho chiến dịch cứu trợ và giáo dục vùng xa.",
        contactName: "Lưu Quang",
        contactEmail: "impact@giaohangxanh.vn",
        status: "VERIFIED"
      }
    })
  ]);

  await Promise.all([
    prisma.notification.create({
      data: {
        userId: donor.id,
        title: "Biên nhận đã sẵn sàng",
        content: "Giao dịch gần nhất của bạn đã được đối soát và có thể xem trong lịch sử ủng hộ."
      }
    }),
    prisma.notification.create({
      data: {
        userId: charityUser.id,
        title: "Cập nhật minh chứng đang chờ duyệt",
        content: "Minh chứng của chiến dịch giáo dục số đã được gửi đến admin OpenCharity."
      }
    })
  ]);

  const logs = [
    ["CAMPAIGN_APPROVED", admin.id, "Campaign", campaignBySlug["trao-120-bo-may-tinh-hoc-tap-nam-chay"].id, "Admin duyệt chiến dịch sau khi kiểm tra hồ sơ tổ chức, báo giá và kế hoạch đối soát."],
    ["DONATION_CREATED", donor.id, "Donation", null, "Giao dịch donor demo được ghi nhận, tạo receipt và cập nhật tiến độ gây quỹ."],
    ["UPDATE_APPROVED", admin.id, "CampaignUpdate", null, "Minh chứng tủ sách Thạnh An được duyệt, public có thể xem báo cáo sử dụng quỹ."],
    ["CAMPAIGN_CREATED", charityUser.id, "Campaign", campaignBySlug["bo-dung-cu-hoc-tap-dau-nam-kon-plong"].id, "Tổ chức tạo bản nháp chiến dịch đầu năm học mới."],
    ["PARTNER_REQUESTED", partnerUser.id, "Partner", null, "Doanh nghiệp gửi đề xuất matching fund cho nhóm chiến dịch giáo dục và y tế."]
  ] as const;

  for (const [action, actorId, entityType, entityId, metadata] of logs) {
    await prisma.auditLog.create({
      data: {
        action,
        actorId,
        entityType,
        entityId,
        metadata,
        ipAddress: "127.0.0.1"
      }
    });
  }

  console.log("Seed completed: OpenCharity demo data is ready.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

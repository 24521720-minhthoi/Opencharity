import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDb } from "./config/db.js";
import {
  AdminLog,
  Campaign,
  Cart,
  Delivery,
  Order,
  Payment,
  ProofOfDelivery,
  RequestedItem,
  Role,
  Organization,
  Supplier,
  TransparencyEvidence,
  User
} from "./models.js";
import { orderCode, slugify } from "./lib/metrics.js";

const passwordHash = await bcrypt.hash("123456", 10);

const img = {
  children: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1300&q=80",
  food: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1300&q=80",
  school: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1300&q=80",
  health: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1300&q=80",
  flood: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1300&q=80",
  shelter: "https://images.unsplash.com/photo-1494386346843-e12284507169?auto=format&fit=crop&w=1300&q=80",
  rice: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80",
  milk: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=900&q=80",
  book: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
  blanket: "https://images.unsplash.com/photo-1616627781431-23b776aad6d7?auto=format&fit=crop&w=900&q=80",
  medicine: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=900&q=80",
  pod: "https://images.unsplash.com/photo-1523289333742-be1143f6b766?auto=format&fit=crop&w=1000&q=80"
};

const organizationsData = [
  {
    name: "Mái ấm Hoa Hướng Dương",
    province: "TP. Hồ Chí Minh",
    representative: "Nguyễn Thị Mai",
    email: "hoahuongduong@opencharity.vn",
    phone: "0901112233",
    address: "Quận 8, TP. Hồ Chí Minh",
    mission: "Chăm sóc trẻ em mất nơi nương tựa bằng bữa ăn, học cụ và chăm sóc sức khỏe định kỳ."
  },
  {
    name: "Nhà mở Bình An",
    province: "Đà Nẵng",
    representative: "Trần Quốc Hưng",
    email: "binhan@opencharity.vn",
    phone: "0902223344",
    address: "Hòa Vang, Đà Nẵng",
    mission: "Tiếp nhận người già neo đơn và người khuyết tật cần hỗ trợ sinh hoạt cơ bản."
  },
  {
    name: "Quỹ Bếp Ấm Vùng Cao",
    province: "Lào Cai",
    representative: "Lý A Sáng",
    email: "bepam@opencharity.vn",
    phone: "0903334455",
    address: "Bát Xát, Lào Cai",
    mission: "Duy trì bếp ăn bán trú, áo ấm và đồ dùng học tập cho học sinh vùng cao."
  },
  {
    name: "Trung tâm Sống Xanh",
    province: "Cần Thơ",
    representative: "Phạm Minh Khoa",
    email: "songxanh@opencharity.vn",
    phone: "0904445566",
    address: "Ninh Kiều, Cần Thơ",
    mission: "Hỗ trợ hộ dân khó khăn phục hồi sinh kế sau thiên tai và cải thiện vệ sinh môi trường."
  },
  {
    name: "Nhóm Cầu Vồng Nhỏ",
    province: "Hà Nội",
    representative: "Đỗ An Nhiên",
    email: "cauvongnho@opencharity.vn",
    phone: "0905556677",
    address: "Long Biên, Hà Nội",
    mission: "Kết nối tài trợ vật phẩm cho lớp học tình thương và thư viện cộng đồng."
  }
];

const suppliersData = [
  {
    name: "An Tâm Food Supply",
    categories: ["Thực phẩm", "Sữa", "Nhu yếu phẩm"],
    serviceAreas: ["TP. Hồ Chí Minh", "Cần Thơ", "Đà Nẵng"],
    contactName: "Lê Hoài Nam",
    email: "supply@antam.vn",
    phone: "02873001122",
    address: "Kho Tân Bình, TP. Hồ Chí Minh",
    logoUrl: "https://dummyimage.com/320x160/0d9488/ffffff&text=An+Tam+Food"
  },
  {
    name: "Nhà sách Thiện Tri",
    categories: ["Học cụ", "Sách", "Thiết bị lớp học"],
    serviceAreas: ["Hà Nội", "Lào Cai", "Đà Nẵng"],
    contactName: "Vũ Minh Trang",
    email: "orders@thientri.vn",
    phone: "02473002233",
    address: "Cầu Giấy, Hà Nội",
    logoUrl: "https://dummyimage.com/320x160/f59e0b/1f2937&text=Thien+Tri"
  },
  {
    name: "MediCare Cộng Đồng",
    categories: ["Y tế", "Vệ sinh", "Chăm sóc sức khỏe"],
    serviceAreas: ["TP. Hồ Chí Minh", "Hà Nội", "Cần Thơ"],
    contactName: "Hoàng Minh Đức",
    email: "csr@medicare.vn",
    phone: "02873003344",
    address: "Quận 3, TP. Hồ Chí Minh",
    logoUrl: "https://dummyimage.com/320x160/14b8a6/ffffff&text=MediCare"
  },
  {
    name: "LogiHome Relief",
    categories: ["Chăn ấm", "Gia dụng", "Logistics"],
    serviceAreas: ["Lào Cai", "Đà Nẵng", "Cần Thơ", "Hà Nội"],
    contactName: "Bùi Khánh Linh",
    email: "relief@logihome.vn",
    phone: "02473004455",
    address: "Long Biên, Hà Nội",
    logoUrl: "https://dummyimage.com/320x160/134e4a/ffffff&text=LogiHome"
  }
];

const campaignsData = [
  {
    title: "Bữa sáng đủ chất cho 120 em nhỏ Mái ấm Hoa Hướng Dương",
    category: "Dinh dưỡng",
    province: "TP. Hồ Chí Minh",
    beneficiary: "120 trẻ em tại Quận 8",
    imageUrl: img.children,
    organizationIndex: 0,
    status: "ACTIVE",
    summary: "Tài trợ gạo, sữa và thực phẩm khô để duy trì bữa sáng trong 45 ngày.",
    description:
      "Chiến dịch tập trung vào vật phẩm có thể giao nhận và đối soát: gạo, sữa hộp, yến mạch và dầu ăn. Nhà cung cấp giao trực tiếp đến mái ấm, tổ chức xác nhận nhận hàng bằng POD.",
    items: [
      ["Gạo thơm 5kg", "Thực phẩm", "bao", 90, 145000, 0, img.rice],
      ["Sữa hộp tiệt trùng 180ml", "Sữa", "thùng", 70, 360000, 0, img.milk],
      ["Yến mạch ăn sáng", "Thực phẩm", "hộp", 80, 78000, 0, img.food]
    ]
  },
  {
    title: "Bộ học cụ đầu năm cho lớp học tình thương Long Biên",
    category: "Giáo dục",
    province: "Hà Nội",
    beneficiary: "85 học sinh lớp học tình thương",
    imageUrl: img.school,
    organizationIndex: 4,
    status: "ACTIVE",
    summary: "Cung cấp sách bài tập, balo và bộ dụng cụ học tập cho học sinh có hoàn cảnh khó khăn.",
    description:
      "Nhóm Cầu Vồng Nhỏ cần các bộ học cụ đồng nhất để phát trước kỳ học mới. Donor tài trợ từng nhóm vật phẩm, nhà sách Thiện Tri đóng gói theo danh sách lớp.",
    items: [
      ["Bộ vở ô ly 10 cuốn", "Học cụ", "bộ", 85, 72000, 1, img.book],
      ["Balo đi học chống nước", "Học cụ", "cái", 85, 185000, 1, img.school],
      ["Bộ bút viết và thước", "Học cụ", "bộ", 85, 43000, 1, img.book]
    ]
  },
  {
    title: "Tủ thuốc cộng đồng cho Nhà mở Bình An",
    category: "Y tế",
    province: "Đà Nẵng",
    beneficiary: "60 người cao tuổi và người khuyết tật",
    imageUrl: img.health,
    organizationIndex: 1,
    status: "ACTIVE",
    summary: "Tài trợ vật phẩm y tế cơ bản, khẩu trang và dụng cụ đo sức khỏe.",
    description:
      "Nhà mở Bình An cần tủ thuốc và vật phẩm chăm sóc cơ bản. OpenCharity ghi nhận từng đơn tài trợ, tình trạng giao hàng và POD từ người nhận.",
    items: [
      ["Bộ tủ thuốc cơ bản", "Y tế", "bộ", 12, 650000, 2, img.medicine],
      ["Khẩu trang y tế 4 lớp", "Y tế", "thùng", 25, 210000, 2, img.health],
      ["Máy đo huyết áp điện tử", "Y tế", "máy", 10, 720000, 2, img.medicine]
    ]
  },
  {
    title: "Áo ấm và chăn mùa đông cho học sinh Bát Xát",
    category: "Mùa đông",
    province: "Lào Cai",
    beneficiary: "160 học sinh vùng cao",
    imageUrl: img.flood,
    organizationIndex: 2,
    status: "ACTIVE",
    summary: "Tài trợ áo khoác, chăn ấm và tất len trước đợt rét cao điểm.",
    description:
      "Chiến dịch ưu tiên vật phẩm giữ ấm có thông tin số lượng rõ ràng. Nhà cung cấp LogiHome Relief giao theo lô và cập nhật vận chuyển.",
    items: [
      ["Áo khoác ấm trẻ em", "Chăn ấm", "cái", 160, 195000, 3, img.blanket],
      ["Chăn nỉ mùa đông", "Chăn ấm", "cái", 80, 240000, 3, img.blanket],
      ["Tất len trẻ em", "Chăn ấm", "đôi", 200, 28000, 3, img.blanket]
    ]
  },
  {
    title: "Gói vệ sinh khẩn cấp cho 90 hộ dân sau ngập",
    category: "Cứu trợ",
    province: "Cần Thơ",
    beneficiary: "90 hộ dân ven sông",
    imageUrl: img.shelter,
    organizationIndex: 3,
    status: "ACTIVE",
    summary: "Cung cấp nước sạch, xà phòng, dung dịch sát khuẩn và bộ vệ sinh gia đình.",
    description:
      "Sau đợt ngập, Trung tâm Sống Xanh cần vật phẩm vệ sinh có thể giao nhanh. Supplier cập nhật trạng thái từng đơn để donor theo dõi.",
    items: [
      ["Bộ vệ sinh gia đình", "Vệ sinh", "bộ", 90, 115000, 2, img.health],
      ["Nước uống đóng bình 20L", "Nhu yếu phẩm", "bình", 180, 38000, 0, img.food],
      ["Dung dịch sát khuẩn", "Vệ sinh", "chai", 220, 32000, 2, img.medicine]
    ]
  },
  {
    title: "Bếp ăn bán trú 30 ngày tại điểm trường Nậm Chạc",
    category: "Dinh dưỡng",
    province: "Lào Cai",
    beneficiary: "110 học sinh bán trú",
    imageUrl: img.food,
    organizationIndex: 2,
    status: "ACTIVE",
    summary: "Tài trợ lương thực và dầu ăn cho bếp bán trú trong một tháng.",
    description:
      "Bếp ăn bán trú cần nguồn vật phẩm ổn định. Nền tảng tách rõ đơn hàng, nhà cung cấp, giao nhận và bằng chứng nhận hàng.",
    items: [
      ["Gạo tẻ 10kg", "Thực phẩm", "bao", 80, 230000, 0, img.rice],
      ["Dầu ăn 5L", "Thực phẩm", "can", 45, 188000, 0, img.food],
      ["Trứng gà sạch", "Thực phẩm", "vỉ", 160, 42000, 0, img.food]
    ]
  },
  {
    title: "Thư viện nhỏ cho trẻ em khu lưu trú công nhân",
    category: "Giáo dục",
    province: "TP. Hồ Chí Minh",
    beneficiary: "70 trẻ em khu lưu trú",
    imageUrl: img.school,
    organizationIndex: 0,
    status: "COMPLETED",
    summary: "Tài trợ sách thiếu nhi, kệ sách và bàn đọc để hoàn thiện góc đọc cộng đồng.",
    description:
      "Chiến dịch đã hoàn tất tài trợ vật phẩm và có POD đã duyệt. Đây là mẫu minh họa rõ luồng donor, supplier, charity và admin.",
    items: [
      ["Sách thiếu nhi chọn lọc", "Sách", "bộ", 70, 98000, 1, img.book],
      ["Kệ sách gỗ an toàn", "Thiết bị lớp học", "cái", 6, 850000, 1, img.school],
      ["Bàn đọc nhóm", "Thiết bị lớp học", "cái", 8, 620000, 1, img.school]
    ]
  },
  {
    title: "Máy lọc nước cho điểm sinh hoạt cộng đồng Bình An",
    category: "Nước sạch",
    province: "Đà Nẵng",
    beneficiary: "40 cư dân đang lưu trú",
    imageUrl: img.health,
    organizationIndex: 1,
    status: "PENDING_REVIEW",
    summary: "Tổ chức gửi nhu cầu máy lọc nước và lõi lọc thay thế, đang chờ admin duyệt.",
    description:
      "Chiến dịch mẫu cho luồng charity tạo chiến dịch, gửi chờ duyệt và admin kiểm tra trước khi công khai.",
    items: [
      ["Máy lọc nước RO", "Nước sạch", "máy", 3, 4800000, 2, img.health],
      ["Bộ lõi lọc thay thế", "Nước sạch", "bộ", 12, 620000, 2, img.medicine]
    ]
  }
];

function datePlus(days) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

async function reset() {
  await Promise.all([
    Role.deleteMany({}),
    User.deleteMany({}),
    Organization.deleteMany({}),
    Supplier.deleteMany({}),
    Campaign.deleteMany({}),
    RequestedItem.deleteMany({}),
    Cart.deleteMany({}),
    Order.deleteMany({}),
    Payment.deleteMany({}),
    Delivery.deleteMany({}),
    ProofOfDelivery.deleteMany({}),
    TransparencyEvidence.deleteMany({}),
    AdminLog.deleteMany({})
  ]);
}

async function seed() {
  await connectDb();
  await reset();

  await Role.insertMany([
    { name: "ADMIN", description: "Platform Operator kiểm duyệt và đối soát.", permissions: ["review_campaign", "review_pod", "manage_users"] },
    { name: "DONOR", description: "Nhà hảo tâm tài trợ vật phẩm qua giỏ hàng và payment sandbox.", permissions: ["sponsor_item", "track_order"] },
    { name: "CHARITY", description: "Tổ chức thiện nguyện tạo chiến dịch, khai báo nhu cầu, upload POD.", permissions: ["create_campaign", "upload_pod"] },
    { name: "SUPPLIER", description: "Nhà cung cấp nhận đơn và cập nhật giao nhận.", permissions: ["process_order", "update_delivery"] }
  ]);

  const organizations = await Organization.insertMany(
    organizationsData.map((org, index) => ({
      ...org,
      slug: slugify(org.name),
      taxCode: `OC-CHARITY-${index + 101}`,
      type: "CHARITY",
      verificationStatus: "VERIFIED",
      documentUrl: "https://dummyimage.com/900x600/e0f2fe/0f172a&text=Verified+Charity+Profile",
      transparencyScore: 78 + index * 3
    }))
  );

  const suppliers = await Supplier.insertMany(
    suppliersData.map((supplier, index) => ({
      ...supplier,
      slug: slugify(supplier.name),
      rating: 4.5 + index * 0.1,
      metrics: { ordersCompleted: 24 + index * 7, onTimeRate: 92 + index }
    }))
  );

  const admin = await User.create({
    email: "admin@opencharity.vn",
    passwordHash,
    name: "Admin OpenCharity",
    role: "ADMIN",
    phone: "0900000001"
  });
  const charityUser = await User.create({
    email: "charity@opencharity.vn",
    passwordHash,
    name: "Nguyễn Thị Mai",
    role: "CHARITY",
    organization: organizations[0]._id,
    phone: "0901112233"
  });
  const supplierUser = await User.create({
    email: "supplier@opencharity.vn",
    passwordHash,
    name: "Lê Hoài Nam",
    role: "SUPPLIER",
    supplier: suppliers[0]._id,
    phone: "02873001122"
  });
  const donorDemo = await User.create({
    email: "donor@opencharity.vn",
    passwordHash,
    name: "Trần Minh Anh",
    role: "DONOR",
    phone: "0912345678"
  });

  const charityUsers = await Promise.all(
    organizations.slice(1).map((organization, index) =>
      User.create({
        email: `charity${index + 2}@opencharity.vn`,
        passwordHash,
        name: organization.representative,
        role: "CHARITY",
        organization: organization._id
      })
    )
  );
  const supplierUsers = await Promise.all(
    suppliers.slice(1).map((supplier, index) =>
      User.create({
        email: `supplier${index + 2}@opencharity.vn`,
        passwordHash,
        name: supplier.contactName,
        role: "SUPPLIER",
        supplier: supplier._id
      })
    )
  );

  const donorNames = [
    "Phạm Hoàng Long",
    "Võ Thảo Uyên",
    "Lê Gia Hân",
    "Đặng Quốc Bảo",
    "Ngô Minh Khang",
    "Bùi Thanh Tâm",
    "Hoàng Nhật Linh",
    "Trương Phúc An",
    "Đỗ Khánh Vy",
    "Mai Đức Huy",
    "Lâm Tuệ Nghi",
    "Đinh Hữu Phước",
    "Nguyễn Bảo Châu",
    "Phan Quỳnh Như",
    "Tạ Minh Quân",
    "Cao Lan Anh",
    "Hồ Thiên Ân",
    "Vũ Hải Đăng",
    "Trịnh Ngọc Diệp",
    "Huỳnh Gia Phúc",
    "Lý Thanh Ngân",
    "Kiều Minh Tâm",
    "Chu Hoàng Yến",
    "Đào Gia Bảo"
  ];
  const donors = [
    donorDemo,
    ...(await Promise.all(
      donorNames.map((name, index) =>
        User.create({
          email: `donor${index + 2}@opencharity.vn`,
          passwordHash,
          name,
          role: "DONOR",
          phone: `09${(20000000 + index * 13729).toString().slice(0, 8)}`
        })
      )
    ))
  ];

  const campaignDocs = [];
  const itemDocsByCampaign = [];
  for (const [index, data] of campaignsData.entries()) {
    const createdBy =
      data.organizationIndex === 0 ? charityUser : charityUsers[Math.max(0, data.organizationIndex - 1)];
    const campaign = await Campaign.create({
      title: data.title,
      slug: slugify(data.title),
      summary: data.summary,
      description: data.description,
      imageUrl: data.imageUrl,
      province: data.province,
      beneficiary: data.beneficiary,
      category: data.category,
      organization: organizations[data.organizationIndex]._id,
      status: data.status,
      urgency: index % 3 === 0 ? "HIGH" : "MEDIUM",
      startDate: datePlus(-20 + index),
      endDate: datePlus(35 + index * 3),
      transparencyScore: 76 + index * 2,
      riskNote: "Rủi ro chính là giao hàng trễ hoặc thiếu chứng từ nhận hàng; prototype xử lý bằng timeline và POD.",
      evidenceRequirement: "Ảnh nhận hàng, tên người nhận, ghi chú số lượng và xác nhận của tổ chức tiếp nhận.",
      createdBy: createdBy._id,
      approvedBy: data.status === "PENDING_REVIEW" ? undefined : admin._id
    });
    campaignDocs.push(campaign);

    const items = await RequestedItem.insertMany(
      data.items.map(([name, category, unit, quantityNeeded, unitPrice, supplierIndex, imageUrl]) => ({
        campaign: campaign._id,
        supplier: suppliers[supplierIndex]._id,
        name,
        category,
        unit,
        quantityNeeded,
        unitPrice,
        quantityFunded: 0,
        priority: quantityNeeded > 100 ? "HIGH" : "MEDIUM",
        description: `${name} được giao trực tiếp từ ${suppliers[supplierIndex].name} đến ${organizations[data.organizationIndex].name}.`,
        imageUrl
      }))
    );
    itemDocsByCampaign.push(items);
  }

  const seededOrders = [
    [0, 0, 0, 12, "COMPLETED", "POD_APPROVED"],
    [0, 1, 1, 8, "IN_TRANSIT", "IN_TRANSIT"],
    [0, 2, 2, 15, "SUPPLIER_PROCESSING", "SUPPLIER_PROCESSING"],
    [1, 0, 3, 20, "COMPLETED", "POD_APPROVED"],
    [1, 1, 4, 10, "DELIVERED", "DELIVERED"],
    [1, 2, 5, 18, "PACKED", "PACKED"],
    [2, 0, 6, 3, "COMPLETED", "POD_APPROVED"],
    [2, 1, 7, 6, "POD_UPLOADED", "POD_PENDING_REVIEW"],
    [2, 2, 8, 2, "IN_TRANSIT", "IN_TRANSIT"],
    [3, 0, 9, 25, "SUPPLIER_PROCESSING", "SUPPLIER_PROCESSING"],
    [3, 1, 10, 10, "COMPLETED", "POD_APPROVED"],
    [3, 2, 11, 30, "PACKED", "PACKED"],
    [4, 0, 12, 15, "DELIVERED", "DELIVERED"],
    [4, 1, 13, 20, "IN_TRANSIT", "IN_TRANSIT"],
    [4, 2, 14, 25, "COMPLETED", "POD_APPROVED"],
    [5, 0, 15, 10, "PAYMENT_SUCCESS", "WAITING_SUPPLIER"],
    [5, 1, 16, 6, "SUPPLIER_PROCESSING", "SUPPLIER_PROCESSING"],
    [5, 2, 17, 18, "IN_TRANSIT", "IN_TRANSIT"],
    [6, 0, 18, 70, "COMPLETED", "POD_APPROVED"],
    [6, 1, 19, 6, "COMPLETED", "POD_APPROVED"],
    [6, 2, 20, 8, "COMPLETED", "POD_APPROVED"],
    [0, 0, 21, 9, "PAYMENT_SUCCESS", "WAITING_SUPPLIER"],
    [1, 0, 22, 12, "SUPPLIER_PROCESSING", "SUPPLIER_PROCESSING"],
    [3, 2, 23, 20, "DELIVERED", "DELIVERED"]
  ];

  for (const [campaignIndex, itemIndex, donorIndex, quantity, status, deliveryStatus] of seededOrders) {
    const campaign = campaignDocs[campaignIndex];
    const item = itemDocsByCampaign[campaignIndex][itemIndex];
    const donor = donors[donorIndex % donors.length];
    const subtotal = item.unitPrice * quantity;
    const code = orderCode("OC");

    await RequestedItem.updateOne({ _id: item._id }, { $inc: { quantityFunded: quantity } });
    await User.updateOne(
      { _id: donor._id },
      { $inc: { "impact.totalSponsored": subtotal, "impact.ordersCompleted": status === "COMPLETED" ? 1 : 0 } }
    );

    const order = await Order.create({
      orderCode: code,
      donor: donor._id,
      campaign: campaign._id,
      supplier: item.supplier,
      organization: campaign.organization,
      items: [
        {
          requestedItem: item._id,
          name: item.name,
          unit: item.unit,
          unitPrice: item.unitPrice,
          quantity,
          subtotal
        }
      ],
      totalAmount: subtotal,
      status,
      paymentStatus: "SUCCESS",
      deliveryStatus
    });

    await Payment.create({
      order: order._id,
      provider: "MoMo Sandbox",
      method: "MOMO_SANDBOX",
      sandboxTransactionId: orderCode("MOMO"),
      amount: subtotal,
      status: "SUCCESS",
      reconciliationStatus: "MATCHED",
      paidAt: datePlus(-Math.max(1, 24 - donorIndex))
    });

    const timeline = [
      {
        status: "PAYMENT_SUCCESS",
        label: "Donor thanh toán sandbox",
        note: "Payment mô phỏng thành công và được ghi nhận đối soát.",
        actorRole: "DONOR",
        at: datePlus(-8)
      }
    ];
    if (["SUPPLIER_PROCESSING", "PACKED", "IN_TRANSIT", "DELIVERED", "POD_APPROVED"].includes(deliveryStatus)) {
      timeline.push({
        status: "SUPPLIER_PROCESSING",
        label: "Supplier xác nhận xử lý",
        note: "Nhà cung cấp đã nhận đơn và chuẩn bị hàng.",
        actorRole: "SUPPLIER",
        at: datePlus(-7)
      });
    }
    if (["PACKED", "IN_TRANSIT", "DELIVERED", "POD_APPROVED"].includes(deliveryStatus)) {
      timeline.push({
        status: "PACKED",
        label: "Đã đóng gói",
        note: "Vật phẩm đã được đóng gói theo đơn.",
        actorRole: "SUPPLIER",
        at: datePlus(-6)
      });
    }
    if (["IN_TRANSIT", "DELIVERED", "POD_APPROVED"].includes(deliveryStatus)) {
      timeline.push({
        status: "IN_TRANSIT",
        label: "Đang giao hàng",
        note: "Đơn hàng đang trên đường đến tổ chức tiếp nhận.",
        actorRole: "SUPPLIER",
        at: datePlus(-5)
      });
    }
    if (["DELIVERED", "POD_APPROVED"].includes(deliveryStatus)) {
      timeline.push({
        status: "DELIVERED",
        label: "Supplier đánh dấu đã giao",
        note: "Chờ tổ chức xác nhận nhận hàng bằng POD.",
        actorRole: "SUPPLIER",
        at: datePlus(-4)
      });
    }
    if (deliveryStatus === "POD_APPROVED") {
      timeline.push({
        status: "POD_APPROVED",
        label: "POD đã được admin xác thực",
        note: "Bằng chứng giao nhận đã công khai trên trang minh bạch.",
        actorRole: "ADMIN",
        at: datePlus(-3)
      });
    }

    const delivery = await Delivery.create({
      order: order._id,
      campaign: campaign._id,
      supplier: item.supplier,
      receiverOrganization: campaign.organization,
      status: deliveryStatus,
      trackingCode: orderCode("SHIP"),
      estimatedArrival: datePlus(4),
      timeline
    });

    if (["COMPLETED", "POD_UPLOADED"].includes(status)) {
      const approved = status === "COMPLETED";
      const proof = await ProofOfDelivery.create({
        order: order._id,
        campaign: campaign._id,
        supplier: item.supplier,
        organization: campaign.organization,
        delivery: delivery._id,
        imageUrl: img.pod,
        receiverName: organizationsData[campaignsData[campaignIndex].organizationIndex].representative,
        receivedAt: datePlus(-3),
        note: `Đã nhận ${quantity} ${item.unit} ${item.name}; số lượng khớp đơn ${code}.`,
        status: approved ? "APPROVED" : "PENDING_REVIEW",
        uploadedBy: charityUser._id,
        verifiedBy: approved ? admin._id : undefined
      });

      await TransparencyEvidence.create({
        campaign: campaign._id,
        order: order._id,
        type: "POD",
        title: `Biên nhận giao hàng ${code}`,
        description: proof.note,
        fileUrl: img.pod,
        status: approved ? "APPROVED" : "PENDING_REVIEW",
        submittedBy: charityUser._id,
        verifiedBy: approved ? admin._id : undefined,
        publishedAt: approved ? datePlus(-2) : undefined
      });
    }
  }

  await Cart.create({
    donor: donorDemo._id,
    items: [
      { requestedItem: itemDocsByCampaign[0][0]._id, quantity: 2 },
      { requestedItem: itemDocsByCampaign[1][2]._id, quantity: 3 }
    ]
  });

  await TransparencyEvidence.insertMany([
    {
      campaign: campaignDocs[0]._id,
      type: "ORGANIZATION_PROFILE",
      title: "Hồ sơ xác minh Mái ấm Hoa Hướng Dương",
      description: "Admin đã kiểm tra đại diện, địa chỉ tiếp nhận và kế hoạch sử dụng vật phẩm.",
      fileUrl: "https://dummyimage.com/900x600/ccfbf1/134e4a&text=Verified+Profile",
      status: "APPROVED",
      submittedBy: charityUser._id,
      verifiedBy: admin._id,
      publishedAt: datePlus(-12)
    },
    {
      campaign: campaignDocs[3]._id,
      type: "DELIVERY_RECONCILIATION",
      title: "Đối soát lô áo ấm Bát Xát",
      description: "Số lượng trên đơn hàng, phiếu xuất kho và POD được đối chiếu trùng khớp.",
      fileUrl: "https://dummyimage.com/900x600/fef3c7/92400e&text=Reconciliation",
      status: "APPROVED",
      submittedBy: charityUsers[1]._id,
      verifiedBy: admin._id,
      publishedAt: datePlus(-8)
    }
  ]);

  await AdminLog.insertMany([
    { action: "SYSTEM_SEED_DATA", actor: admin._id, actorRole: "ADMIN", entityType: "System", metadata: { campaigns: campaignDocs.length, orders: seededOrders.length } },
    { action: "ADMIN_APPROVE_SUPPLIERS", actor: admin._id, actorRole: "ADMIN", entityType: "Supplier", metadata: { count: suppliers.length } },
    { action: "ADMIN_APPROVE_CAMPAIGNS", actor: admin._id, actorRole: "ADMIN", entityType: "Campaign", metadata: { active: 6, completed: 1 } },
    { action: "RECONCILIATION_BATCH_MATCHED", actor: admin._id, actorRole: "ADMIN", entityType: "Payment", metadata: { provider: "MoMo Sandbox", status: "MATCHED" } }
  ]);

  console.log("Seed completed for OpenCharity MERN prototype.");
  console.log("Demo accounts: admin/donor/charity/supplier @opencharity.vn, password 123456");

  await import("mongoose").then(({ default: mongoose }) => mongoose.disconnect());
}

seed().catch(async (error) => {
  console.error(error);
  await import("mongoose").then(({ default: mongoose }) => mongoose.disconnect());
  process.exit(1);
});

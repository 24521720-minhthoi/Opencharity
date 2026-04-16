import { Building2, CheckCircle2, HandCoins, Landmark, ShieldCheck, UsersRound } from "lucide-react";
import { Card } from "@/components/ui/card";

const stakeholders = [
  {
    icon: <UsersRound className="h-5 w-5" />,
    title: "Người ủng hộ",
    text: "Tìm chiến dịch đáng tin, thanh toán nhanh, nhận biên nhận và theo dõi minh chứng sau khi quỹ được sử dụng."
  },
  {
    icon: <Building2 className="h-5 w-5" />,
    title: "Tổ chức thiện nguyện",
    text: "Quản trị chiến dịch, cập nhật tiến độ, gửi chứng từ và xây dựng uy tín bằng điểm minh bạch."
  },
  {
    icon: <Landmark className="h-5 w-5" />,
    title: "Doanh nghiệp đồng hành",
    text: "Triển khai CSR có dữ liệu, matching fund, đồng tài trợ logistics và đo lường tác động xã hội."
  }
];

export default function AboutPage() {
  return (
    <div className="page-shell">
      <div className="grid gap-8 md:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">About OpenCharity</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal text-slate-950">Nền tảng số hóa chuỗi giá trị thiện nguyện.</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            OpenCharity được thiết kế như một sản phẩm civic-tech có logic thương mại điện tử: có catalog chiến dịch, thanh toán, giao dịch, biên nhận, quản trị nội dung, kiểm duyệt và báo cáo tác động.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80"
          alt="Hoạt động cộng đồng"
          className="h-80 w-full rounded-lg object-cover shadow-soft"
        />
      </div>

      <section className="mt-12 grid gap-5 md:grid-cols-3">
        <Card className="p-5">
          <ShieldCheck className="h-7 w-7 text-primary" />
          <h2 className="mt-4 text-xl font-semibold">Sứ mệnh</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Làm cho hoạt động thiện nguyện online dễ tham gia hơn nhưng khó bị mập mờ hơn.</p>
        </Card>
        <Card className="p-5">
          <HandCoins className="h-7 w-7 text-primary" />
          <h2 className="mt-4 text-xl font-semibold">Tầm nhìn</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Trở thành lớp hạ tầng minh bạch cho các chương trình thiện nguyện, CSR và tác động xã hội tại Việt Nam.</p>
        </Card>
        <Card className="p-5">
          <CheckCircle2 className="h-7 w-7 text-primary" />
          <h2 className="mt-4 text-xl font-semibold">Cơ chế tin cậy</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">Mọi chiến dịch public đều có tổ chức xác minh, trạng thái kiểm duyệt, giao dịch đối soát và audit log.</p>
        </Card>
      </section>

      <section className="mt-12 rounded-lg border bg-white p-6 shadow-soft">
        <h2 className="section-title">Mô hình hoạt động</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            "Campaign marketplace cho donor và doanh nghiệp lựa chọn chiến dịch phù hợp.",
            "Back-office cho tổ chức tạo chiến dịch, cập nhật minh chứng và theo dõi tiến độ.",
            "Admin console kiểm duyệt tổ chức, chiến dịch, cập nhật và kiểm tra audit trail.",
            "Transparency layer công khai số liệu tổng, giao dịch gần đây và kết quả sử dụng quỹ."
          ].map((item, index) => (
            <div key={item} className="rounded-lg border bg-slate-50 p-4">
              <span className="text-sm font-semibold text-primary">0{index + 1}</span>
              <p className="mt-3 text-sm leading-6 text-slate-700">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="section-title">Lợi ích theo stakeholder</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {stakeholders.map((item) => (
            <Card key={item.title} className="p-5">
              <div className="grid h-10 w-10 place-items-center rounded-md bg-secondary text-primary">{item.icon}</div>
              <h3 className="mt-4 font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

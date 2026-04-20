import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { apiFetch } from "@/lib/api.js";
import { CampaignCard } from "@/components/CampaignCard.jsx";

export function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    apiFetch("/campaigns").then(setCampaigns);
  }, []);

  const categories = useMemo(() => Array.from(new Set(campaigns.map((campaign) => campaign.category))), [campaigns]);
  const filtered = campaigns.filter((campaign) => {
    const matchesQuery = `${campaign.title} ${campaign.summary}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category ? campaign.category === category : true;
    return matchesQuery && matchesCategory;
  });

  return (
    <section className="shell">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="section-title">Danh sách chiến dịch</h1>
          <p className="section-lead">Marketplace thiện nguyện tập trung vào nhu cầu vật phẩm, không phải chuyển tiền trực tiếp cho người nhận.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-[1fr_220px]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
          <input className="field pl-10" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm theo tên chiến dịch hoặc nhu cầu" />
        </label>
        <select className="field" value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">Tất cả lĩnh vực</option>
          {categories.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {filtered.map((campaign) => (
          <CampaignCard key={campaign._id} campaign={campaign} />
        ))}
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";
import { money } from "@/lib/format.js";
import { Progress } from "./Progress.jsx";
import { StatusBadge } from "./StatusBadge.jsx";

export function CampaignCard({ campaign }) {
  return (
    <Link to={`/campaigns/${campaign.slug}`} className="group block overflow-hidden rounded-lg border border-slate-200 bg-white shadow-panel transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="aspect-[16/10] overflow-hidden bg-slate-100">
        <img src={campaign.imageUrl} alt={campaign.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">{campaign.category}</span>
          <StatusBadge status={campaign.status} />
        </div>
        <h3 className="mt-4 line-clamp-2 min-h-14 text-lg font-semibold text-slate-950">{campaign.title}</h3>
        <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-slate-600">{campaign.summary}</p>
        <div className="mt-4">
          <Progress value={campaign.metrics?.progress || 0} />
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-950">{money(campaign.metrics?.fundedValue || 0)}</span>
            <span className="text-slate-500">{campaign.metrics?.progress || 0}%</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Cần {campaign.metrics?.requestedUnits || 0} vật phẩm qua {campaign.items?.length || 0} nhóm nhu cầu
          </p>
        </div>
        <div className="mt-4 border-t border-slate-100 pt-4 text-xs text-slate-500">
          {campaign.organization?.name} · {campaign.province}
        </div>
      </div>
    </Link>
  );
}

import Link from "next/link";
import type { Campaign, Category, Organization } from "@prisma/client";
import { Badge, toneFromStatus } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { daysLeft, formatCompactCurrency, percent, statusLabel } from "@/lib/utils";

type CampaignWithRelations = Campaign & {
  category: Category;
  organization: Organization;
};

export function CampaignCard({ campaign }: { campaign: CampaignWithRelations }) {
  return (
    <Link href={`/campaigns/${campaign.slug}`} className="group block overflow-hidden rounded-lg border bg-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={campaign.imageUrl}
          alt={campaign.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <div className="flex flex-wrap gap-2">
          <Badge tone="info">{campaign.category.name}</Badge>
          <Badge tone={toneFromStatus(campaign.status)}>{statusLabel(campaign.status)}</Badge>
        </div>
        <h3 className="mt-4 line-clamp-2 text-lg font-semibold text-slate-950">{campaign.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{campaign.summary}</p>
        <div className="mt-4">
          <ProgressBar current={campaign.currentAmount} target={campaign.targetAmount} />
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-950">{formatCompactCurrency(campaign.currentAmount)}</span>
            <span className="text-slate-500">{percent(campaign.currentAmount, campaign.targetAmount)}%</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>Mục tiêu {formatCompactCurrency(campaign.targetAmount)}</span>
            <span>{daysLeft(campaign.endDate)} ngày</span>
          </div>
        </div>
        <div className="mt-4 border-t pt-4 text-xs text-slate-500">
          {campaign.organization.name} - {campaign.province}
        </div>
      </div>
    </Link>
  );
}

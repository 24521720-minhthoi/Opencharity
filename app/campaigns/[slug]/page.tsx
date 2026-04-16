import { notFound } from "next/navigation";
import { CalendarDays, FileText, MapPin, ShieldCheck, Target } from "lucide-react";
import { Badge, toneFromStatus } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress";
import { SaveCampaignButton } from "@/components/forms/save-campaign-button";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { daysLeft, formatCompactCurrency, formatCurrency, formatDate, percent, statusLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CampaignDetailPage({ params }: { params: { slug: string } }) {
  const [campaign, user] = await Promise.all([
    prisma.campaign.findUnique({
      where: { slug: params.slug },
      include: {
        category: true,
        organization: true,
        updates: {
          where: { status: "APPROVED" },
          orderBy: { createdAt: "desc" }
        },
        donations: {
          where: { status: "SUCCESS" },
          include: { donor: true, receipt: true },
          orderBy: { createdAt: "desc" },
          take: 8
        }
      }
    }),
    getCurrentUser()
  ]);

  if (!campaign || !["ACTIVE", "COMPLETED"].includes(campaign.status)) notFound();

  const saved = user
    ? await prisma.savedCampaign.findUnique({
        where: { userId_campaignId: { userId: user.id, campaignId: campaign.id } }
      })
    : null;

  return (
    <div className="page-shell">
      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <img src={campaign.imageUrl} alt={campaign.title} className="h-[420px] w-full rounded-lg object-cover shadow-soft" />
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge tone="info">{campaign.category.name}</Badge>
            <Badge tone={toneFromStatus(campaign.status)}>{statusLabel(campaign.status)}</Badge>
            <Badge tone="success">Điểm minh bạch {campaign.transparencyScore}/100</Badge>
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-normal text-slate-950">{campaign.title}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">{campaign.summary}</p>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Đã gây quỹ</p>
                <p className="mt-1 text-3xl font-semibold text-slate-950">{formatCompactCurrency(campaign.currentAmount)}</p>
              </div>
              <div className="rounded-md bg-accent px-3 py-2 text-sm font-semibold text-primary">{percent(campaign.currentAmount, campaign.targetAmount)}%</div>
            </div>
            <ProgressBar current={campaign.currentAmount} target={campaign.targetAmount} className="mt-5" />
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-md bg-slate-50 p-3">
                <p className="text-slate-500">Mục tiêu</p>
                <p className="mt-1 font-semibold">{formatCompactCurrency(campaign.targetAmount)}</p>
              </div>
              <div className="rounded-md bg-slate-50 p-3">
                <p className="text-slate-500">Còn lại</p>
                <p className="mt-1 font-semibold">{daysLeft(campaign.endDate)} ngày</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              <ButtonLink href={user ? `/campaigns/${campaign.slug}/donate` : `/login?next=/campaigns/${campaign.slug}/donate`} size="lg">
                Ủng hộ ngay
              </ButtonLink>
              <SaveCampaignButton campaignId={campaign.id} initialSaved={Boolean(saved)} />
            </div>
          </Card>
        </aside>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        <section className="grid gap-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold">Mô tả chiến dịch</h2>
            <p className="mt-4 whitespace-pre-line text-base leading-8 text-slate-600">{campaign.description}</p>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold">Minh bạch sử dụng quỹ</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border bg-slate-50 p-4">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="mt-3 font-semibold">Chỉ số tác động</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{campaign.impactMetric}</p>
              </div>
              <div className="rounded-lg border bg-slate-50 p-4">
                <FileText className="h-5 w-5 text-primary" />
                <h3 className="mt-3 font-semibold">Phân bổ ngân sách</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{campaign.fundAllocation}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold">Cập nhật đã được duyệt</h2>
            <div className="mt-5 grid gap-4">
              {campaign.updates.map((update) => (
                <div key={update.id} className="rounded-lg border bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold text-slate-950">{update.title}</h3>
                    <span className="text-xs text-slate-500">{formatDate(update.createdAt)}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{update.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                    <span>Đã sử dụng: {formatCurrency(update.fundUsed)}</span>
                    {update.evidenceUrl ? <a href={update.evidenceUrl} className="text-primary" target="_blank">Tài liệu minh chứng</a> : null}
                  </div>
                </div>
              ))}
              {!campaign.updates.length ? <p className="text-sm text-slate-500">Chưa có cập nhật công khai.</p> : null}
            </div>
          </Card>
        </section>

        <aside className="grid gap-6 self-start">
          <Card className="p-5">
            <h2 className="font-semibold">Tổ chức thụ hưởng</h2>
            <p className="mt-3 text-lg font-semibold text-slate-950">{campaign.organization.name}</p>
            <div className="mt-4 grid gap-3 text-sm text-slate-600">
              <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {campaign.organization.location}</span>
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> {statusLabel(campaign.organization.verificationStatus)}</span>
              <span className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" /> {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}</span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">{campaign.organization.mission}</p>
          </Card>

          <Card className="p-5">
            <h2 className="font-semibold">Giao dịch gần đây</h2>
            <div className="mt-4 grid gap-3">
              {campaign.donations.map((donation) => (
                <div key={donation.id} className="rounded-md bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{donation.donor.name}</span>
                    <span className="text-sm font-semibold text-primary">{formatCompactCurrency(donation.amount)}</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{donation.receipt?.reconciliation}</p>
                </div>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
}

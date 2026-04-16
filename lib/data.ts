import { prisma } from "@/lib/prisma";

export async function getPlatformStats() {
  const [campaigns, completedCampaigns, donations, organizations, approvedUpdates] = await Promise.all([
    prisma.campaign.count({ where: { status: { in: ["ACTIVE", "COMPLETED"] } } }),
    prisma.campaign.count({ where: { status: "COMPLETED" } }),
    prisma.donation.aggregate({
      where: { status: "SUCCESS" },
      _sum: { amount: true },
      _count: true
    }),
    prisma.organization.count({ where: { verificationStatus: "VERIFIED" } }),
    prisma.campaignUpdate.count({ where: { status: "APPROVED" } })
  ]);

  return {
    campaigns,
    completedCampaigns,
    totalDonation: donations._sum.amount ?? 0,
    donationCount: donations._count,
    organizations,
    approvedUpdates
  };
}

export async function getFeaturedCampaigns(take = 3) {
  return prisma.campaign.findMany({
    where: { status: { in: ["ACTIVE", "COMPLETED"] } },
    include: {
      organization: true,
      category: true
    },
    orderBy: [
      { transparencyScore: "desc" },
      { currentAmount: "desc" }
    ],
    take
  });
}

export async function getRecentAuditLogs(take = 8) {
  return prisma.auditLog.findMany({
    include: { actor: true },
    orderBy: { createdAt: "desc" },
    take
  });
}

export async function getDonationSeries() {
  const donations = await prisma.donation.findMany({
    where: { status: "SUCCESS" },
    orderBy: { createdAt: "asc" },
    select: {
      amount: true,
      createdAt: true
    }
  });

  const grouped = new Map<string, number>();
  donations.forEach((donation) => {
    const label = `${donation.createdAt.getDate().toString().padStart(2, "0")}/${(donation.createdAt.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;
    grouped.set(label, (grouped.get(label) ?? 0) + donation.amount);
  });

  return Array.from(grouped.entries()).map(([date, amount]) => ({ date, amount }));
}

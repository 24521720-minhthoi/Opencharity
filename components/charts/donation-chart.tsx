"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompactCurrency } from "@/lib/utils";

export function DonationChart({ data }: { data: Array<{ date: string; amount: number }> }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: 0, right: 12, top: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="donationFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0f8f86" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#0f8f86" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#d8e5e7" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#64748b" />
          <YAxis tickFormatter={(value) => formatCompactCurrency(Number(value))} tick={{ fontSize: 12 }} stroke="#64748b" width={74} />
          <Tooltip formatter={(value) => formatCompactCurrency(Number(value))} labelClassName="text-slate-700" />
          <Area type="monotone" dataKey="amount" stroke="#0f8f86" strokeWidth={2} fill="url(#donationFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

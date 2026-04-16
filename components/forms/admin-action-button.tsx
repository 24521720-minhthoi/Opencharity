"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function AdminActionButton({
  endpoint,
  id,
  action,
  label,
  variant = "primary"
}: {
  endpoint: string;
  id: string;
  action: "approve" | "reject";
  label: string;
  variant?: "primary" | "outline" | "danger";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true);
    await fetch(endpoint, {
      method: "PATCH",
      body: JSON.stringify({ id, action })
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <Button type="button" size="sm" variant={variant} onClick={run} disabled={loading}>
      {loading ? "Đang xử lý..." : label}
    </Button>
  );
}

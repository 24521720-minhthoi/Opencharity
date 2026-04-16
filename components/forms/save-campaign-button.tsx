"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SaveCampaignButton({ campaignId, initialSaved }: { campaignId: string; initialSaved: boolean }) {
  const [saved, setSaved] = useState(initialSaved);

  async function toggle() {
    const response = await fetch("/api/saved", {
      method: "POST",
      body: JSON.stringify({ campaignId })
    });
    if (response.ok) {
      const payload = await response.json();
      setSaved(payload.saved);
    }
  }

  return (
    <Button type="button" variant="outline" onClick={toggle}>
      <Bookmark className="h-4 w-4" />
      {saved ? "Đã lưu" : "Lưu chiến dịch"}
    </Button>
  );
}

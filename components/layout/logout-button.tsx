"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <Button type="button" variant="outline" size="sm" className={cn(className)} onClick={logout}>
      <LogOut className="h-4 w-4" />
      Đăng xuất
    </Button>
  );
}

import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenCharity - Nền tảng thiện nguyện minh bạch",
  description: "Website demo thương mại điện tử thiện nguyện B2B2C cho môn Quản trị dự án thương mại điện tử."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

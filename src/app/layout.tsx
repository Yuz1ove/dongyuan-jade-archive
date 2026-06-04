import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "東源翡藏 | 私人翡翠收藏展示與販售",
  description:
    "東源翡藏是一個高端翡翠私人收藏展示與販售網站，包含精選藏品、分類目錄、翡翠知識庫、預約洽購與簡易藏品管理介面。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}

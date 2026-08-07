import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";

const thaiSans = Noto_Sans_Thai({
  variable: "--font-thai-sans",
  subsets: ["thai", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.nameTh} (${siteConfig.shortName})`,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.tagline,
};

/**
 * โครงนอกสุด — มีแค่ <html>/<body> และฟอนต์
 * เฮดเดอร์/ฟุตเตอร์ของเว็บสาธารณะอยู่ใน app/(site)/layout.tsx
 * ส่วนหลังบ้าน /admin มีโครงของตัวเองที่ไม่มีเฮดเดอร์
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${thaiSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}

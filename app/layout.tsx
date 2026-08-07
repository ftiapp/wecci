import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";

const thaiSans = Noto_Sans_Thai({
  variable: "--font-thai-sans",
  subsets: ["thai", "latin"],
  display: "swap",
});

/*
  LINE/Facebook อ่าน og:image เป็น URL เต็มเท่านั้น พาธแบบ /images/... จะไม่ขึ้น
  metadataBase คือตัวที่เติมโดเมนให้อัตโนมัติ — ต้องตั้ง NEXT_PUBLIC_SITE_URL บนเซิร์ฟเวอร์จริง
*/
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const title = `${siteConfig.nameTh} (${siteConfig.shortName})`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.tagline,
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: siteConfig.shortName,
    title,
    description: siteConfig.tagline,
    url: "/",
    images: [
      {
        url: "/images/brand/og-cover.png",
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: siteConfig.tagline,
    images: ["/images/brand/og-cover.png"],
  },
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

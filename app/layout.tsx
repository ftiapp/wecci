import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";

/*
  FCVision — ฟอนต์ประจำแบรนด์ ไม่ได้อยู่บน Google Fonts จึงต้องฝังไฟล์มาเอง

  ต้นฉบับที่ได้มาเป็น .ttf/.otf ครบ 20 น้ำหนัก แต่เว็บใช้จริงแค่ 4
  (ปกติ กลาง กึ่งหนา หนา) จึงแปลงเฉพาะเท่านี้เป็น woff2 ซึ่งเล็กกว่า ttf ราวสี่เท่า
  ไฟล์ละ 119KB เหลือ 32KB — ถ้าจะเพิ่มน้ำหนักอื่นให้แปลงเพิ่มแล้วมาประกาศตรงนี้

  next/font/local จะ inline ตัว @font-face ให้ พร้อม preload ไฟล์ทั้งชุด
  ไม่มีคำขอไปโดเมนภายนอก หน้าเว็บจึงไม่ต้องรอ DNS ของ Google Fonts
*/
const thaiSans = localFont({
  src: [
    { path: "./fonts/FCVision-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/FCVision-Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/FCVision-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/FCVision-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-thai-sans",
  /* swap ให้ตัวอักษรขึ้นด้วยฟอนต์สำรองก่อน ดีกว่าปล่อยหน้าว่างระหว่างรอไฟล์ฟอนต์ */
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
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

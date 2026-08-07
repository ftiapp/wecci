import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: { default: "ระบบจัดการเว็บไซต์", template: `%s | ${siteConfig.shortName} Admin` },
  robots: { index: false, follow: false },
};

/**
 * โครงของหลังบ้าน — ไม่มีเฮดเดอร์/ฟุตเตอร์ของเว็บสาธารณะ
 * (ตัว layout หลักที่ app/layout.tsx ยังครอบอยู่ จึงต้องซ่อนส่วนนั้นด้วย CSS ในหน้า)
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-slate-50">{children}</div>;
}

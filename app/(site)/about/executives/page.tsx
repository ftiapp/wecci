import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "โครงสร้างผู้บริหาร",
  description: "คณะผู้บริหารของสถาบันน้ำ สิ่งแวดล้อม และ Climate Change",
};

export default function ExecutivesPage() {
  // เหลือเฉพาะแบนเนอร์หัวหน้าเพจ รอเนื้อหาจริงจากสถาบันฯ มาแทนที่
  return (
    <PageHero
      title="โครงสร้างผู้บริหาร"
      description="คณะผู้บริหารที่กำกับทิศทางการดำเนินงานของสถาบันฯ"
      breadcrumb={[
        { label: "เกี่ยวกับเรา", href: "/about" },
        { label: "โครงสร้างผู้บริหาร", href: "/about/executives" },
      ]}
    />
  );
}

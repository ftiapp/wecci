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
      image="/images/about/executives-hero.webp"
      imageAlt="ผังโครงสร้างองค์กรลอยอยู่เหนือภูเขา แม่น้ำ และผืนป่า สื่อถึงการกำกับดูแลด้านน้ำและสิ่งแวดล้อม"
      breadcrumb={[
        { label: "เกี่ยวกับเรา" },
        { label: "โครงสร้างผู้บริหาร", href: "/about/executives" },
      ]}
    />
  );
}

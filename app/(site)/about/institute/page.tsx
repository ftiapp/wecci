import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Band } from "@/components/ui/Band";
import { RoleAccordion } from "@/components/about/RoleAccordion";
import { TargetPills } from "@/components/about/TargetPills";
import { ChairmanIntro } from "@/components/about/ChairmanIntro";
import { chairman, roleTargets, roles } from "@/lib/data/about";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "เกี่ยวกับสถาบัน",
  description: "จุดเริ่มต้นและบทบาทของสถาบันน้ำ สิ่งแวดล้อม และ Climate Change",
};

export default function Page() {
  return (
    <>
      <PageHero
        title="เกี่ยวกับสถาบัน"
        description="จุดเริ่มต้นและบทบาทของสถาบันน้ำ สิ่งแวดล้อม และ Climate Change"
        image="/images/about/institute-hero-v2.webp"
        imageAlt="มือคู่หนึ่งประคองต้นกล้าสีเขียว สื่อถึงการดูแลสิ่งแวดล้อมอย่างยั่งยืน"
        breadcrumb={[
          { label: "เกี่ยวกับเรา", href: "/about" },
          { label: "เกี่ยวกับสถาบัน", href: "/about/institute" },
        ]}
      />

        {/* บทบาทหน้าที่ WECCI — เนื้อหาตามเอกสารนำเสนอวาระปี 2569-2571 */}
        {/* หน้าที่ 1 — ประธานสถาบันฯ อยู่ซ้าย หัวเรื่องอยู่ขวา เต็มความสูงจอพอดี */}
        {/* ใช้ภาพพื้นหลังอย่างเดียว ไม่ต้องมีเมฆ/กังหันเคลื่อนไหวซ้อนอีกชั้น */}
        <Band
          tone="light"
          pattern="none"
          full
          image="/images/about/role-intro-bg.webp"
          imageDim="faint"
        >
          <ChairmanIntro
            chairman={chairman}
            eyebrow="บทบาทหน้าที่ WECCI"
            title="บทบาทของสถาบันฯ"
            subtitle={`${siteConfig.parentTh} — ${chairman.term}`}
            caption="สถาบันน้ำ สิ่งแวดล้อม และ Climate Change"
          >
            {/* เป้าหมายปลายทางสามข้อ ย้ายมาอยู่หน้าแรกเพื่อไม่ให้พื้นที่ว่างเกินไป */}
            <TargetPills targets={roleTargets} />
          </ChairmanIntro>
        </Band>

        {/* หน้าที่ 2 — แผงบทบาทกับเป้าหมาย เลื่อนลงมาเจอเต็มจออีกหน้า */}
        <Band id="roles" tone="light" pattern="windmill" variant={2} full>
          <RoleAccordion roles={roles} />
        </Band>

    </>
  );
}

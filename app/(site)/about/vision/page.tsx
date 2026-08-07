import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Band } from "@/components/ui/Band";
import { VisionBoard } from "@/components/about/VisionBoard";
import {
  chairman,
  visionLead,
  visionPeriod,
  visionPillars,
  visionQuote,
} from "@/lib/data/about";

export const metadata: Metadata = {
  title: "วิสัยทัศน์และพันธกิจ",
  description: "ทิศทางการดำเนินงานและพันธกิจหลักขององค์กร",
};

export default function Page() {
  return (
    <>
      <PageHero
        title="วิสัยทัศน์และพันธกิจ"
        description="ทิศทางการดำเนินงานและพันธกิจหลักขององค์กร"
        image="/images/about/vision-hero.webp"
        imageAlt="วิสัยทัศน์และพันธกิจขององค์กร"
        breadcrumb={[
          { label: "เกี่ยวกับเรา", href: "/about" },
          { label: "วิสัยทัศน์และพันธกิจ", href: "/about/vision" },
        ]}
      />

      {/* ทิศทางการขับเคลื่อนวาระ 2026-2028 — เต็มหนึ่งหน้าจอ */}
      <Band
        tone="light"
        pattern="none"
        full
        image="/images/about/vision-bg.webp"
        imageDim="faint"
      >
        <VisionBoard
          period={visionPeriod}
          lead={visionLead}
          pillars={visionPillars}
          quote={visionQuote}
          chairman={chairman}
        />
      </Band>
    </>
  );
}

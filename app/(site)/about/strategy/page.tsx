import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { Band } from "@/components/ui/Band";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "กลยุทธ์",
  description: "กลยุทธ์และแผนการดำเนินงานของสถาบันน้ำ สิ่งแวดล้อม และ Climate Change",
};

export default function StrategyPage() {
  return (
    <>
      <PageHero
        title="กลยุทธ์"
        description="กลยุทธ์และแผนการดำเนินงานของสถาบันฯ"
        image="/images/about/strategy-hero.webp"
        imageAlt="มือกำลังเดินหมากรุกแก้วที่มีลูกโลกอยู่บนยอด สื่อถึงการวางกลยุทธ์เพื่อโลก"
        breadcrumb={[
          { label: "เกี่ยวกับเรา" },
          { label: "กลยุทธ์", href: "/about/strategy" },
        ]}
      />

      <Band tone="cloud" pattern="windmill" variant={3}>
        <div>
          <Reveal>
            <SectionHeading
              eyebrow="ทิศทางองค์กร"
              title="กลยุทธ์การดำเนินงาน"
              description="แนวทางขับเคลื่อนงานด้านน้ำและสิ่งแวดล้อมของภาคอุตสาหกรรม"
              align="center"
            />
          </Reveal>

          {/* ยังไม่มีข้อมูลจริงจากสถาบัน — รอเนื้อหามาแทนที่ */}
          <Reveal delay={100}>
            <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white/60 p-16 text-center">
              <p className="text-lg font-bold text-wecci-navy">อยู่ระหว่างจัดทำเนื้อหา</p>
              <p className="mt-2 text-sm text-slate-500">
                รายละเอียดกลยุทธ์จะเผยแพร่ที่หน้านี้
              </p>
            </div>
          </Reveal>
        </div>
      </Band>
    </>
  );
}

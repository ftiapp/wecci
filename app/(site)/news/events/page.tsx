import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { EventBoard } from "@/components/news/EventBoard";
import { Band } from "@/components/ui/Band";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getPublishedEvents } from "@/lib/events/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ปฏิทินกิจกรรม",
  description: "ตารางอบรม สัมมนา ประชุม และศึกษาดูงานของสถาบัน",
};

/** หน้าปฏิทินกิจกรรมโดยเฉพาะ — เมนูย่อย "ปฏิทินกิจกรรม" ชี้มาที่นี่ */
export default async function EventsPage() {
  const events = await getPublishedEvents();

  return (
    <>
      <PageHero
        title="ปฏิทินกิจกรรม"
        description="ตารางอบรม สัมมนา ประชุม และศึกษาดูงานของสถาบันฯ ตลอดทั้งปี"
        breadcrumb={[
          { label: "ข่าวสาร" },
          { label: "ปฏิทินกิจกรรม", href: "/news/events" },
        ]}
        // ยังไม่มีภาพหัวหน้านี้ — พาธเดิม /images/news/reading-v2.webp ชี้ไปที่ไฟล์ที่ไม่มีอยู่
        // ปล่อยไว้เท่ากับยิงคำขอย่อภาพที่ล้มเหลวทุกครั้งที่เปิดหน้า จึงถอดออกและใช้พื้นไล่เฉดแทน
      />

      <Band tone="sky" pattern="windmill">
        <div>
          <Reveal>
            <SectionHeading
              eyebrow="ปฏิทินกิจกรรม"
              title="กิจกรรมของสถาบัน"
              description="เลือกดูตามเดือน ปี หรือสถานะของกิจกรรม"
              align="center"
            />
          </Reveal>

          <Reveal delay={100}>
            <EventBoard events={events} />
          </Reveal>
        </div>
      </Band>
    </>
  );
}

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
          { label: "ข่าวสาร", href: "/news" },
          { label: "ปฏิทินกิจกรรม", href: "/news/events" },
        ]}
        image="/images/news/reading-v2.webp"
        imageAlt="ผู้อ่านข่าวสารของสถาบันผ่านแท็บเล็ต"
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

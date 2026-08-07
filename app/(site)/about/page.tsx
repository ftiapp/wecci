import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Band } from "@/components/ui/Band";
import { WaterBackdrop } from "@/components/ui/WaterBackdrop";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { PersonCard } from "@/components/about/PersonCard";
import { GoalCard } from "@/components/about/GoalCard";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { prisma } from "@/lib/prisma";
import { levelRank } from "@/lib/staff/levels";
import { CountUp } from "@/components/ui/CountUp";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { serviceGroups } from "@/lib/data/services";
import { MissionAccordion } from "@/components/about/MissionAccordion";
import { foundedYear, goals, missionItems, vision } from "@/lib/data/about";

export const metadata: Metadata = {
  title: "เกี่ยวกับเรา",
  description: `ความเป็นมา วิสัยทัศน์ พันธกิจ คณะกรรมการ และบุคลากรของ${siteConfig.nameTh}`,
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  // รายชื่อจริงจากหลังบ้าน /admin/staff — หน้านี้แสดงพอเป็นตัวอย่างแล้วลิงก์ไปดูผังเต็ม
  const staff = await prisma.cms_staff
    .findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    })
    .catch((error) => {
      console.error("[about] ดึงรายชื่อบุคลากรไม่สำเร็จ", error);
      return [];
    });

  const people = [...staff]
    .sort((a, b) => levelRank(a.level) - levelRank(b.level))
    .slice(0, 6);

  return (
    <>
      <PageHero
        title="เกี่ยวกับเรา"
        description={`ทำความรู้จัก${siteConfig.nameTh} — ความเป็นมา วิสัยทัศน์ พันธกิจ และทีมงานของเรา`}
        breadcrumb={[{ label: "เกี่ยวกับเรา", href: "/about" }]}
        image="/images/about/team-meeting.webp"
        imageAlt="ทีมงานประชุมและนำเสนอผลการดำเนินงานร่วมกัน"
      />

      <div className="wecci-snap">
        {/* ประโยคหลักขององค์กร + ย่อหน้าแนะนำ (โครงเดียวกับหน้า About ของเว็บต้นแบบ) */}
        <Band id="history" tone="sky" pattern="windmill">
          <div className="relative">
            {/* เลขปีลายน้ำขนาดใหญ่เป็นฉากหลัง */}
            <span
              className="pointer-events-none absolute -top-24 right-0 select-none text-[9rem] font-bold leading-none text-wecci-navy/[0.04] sm:text-[15rem]"
              aria-hidden
            >
              2561
            </span>

            <div className="relative grid gap-12 lg:grid-cols-12 lg:items-start">
              <div className="lg:col-span-7">
                <Reveal>
                  <p className="text-sm font-bold tracking-wide text-wecci-blue">เกี่ยวกับเรา</p>
                  <h2 className="mt-3 text-2xl font-bold leading-snug text-wecci-navy sm:text-3xl 2xl:text-4xl 2xl:leading-snug">
                    สถาบันวิชาการด้านน้ำและสิ่งแวดล้อม
                    ที่เดินเคียงข้างภาคอุตสาหกรรมไทยสู่ความยั่งยืน
                  </h2>
                  <span className="mt-5 flex gap-1.5" aria-hidden>
                    <span className="block h-1 w-10 rounded-full bg-wecci-blue" />
                    <span className="block h-1 w-5 rounded-full bg-wecci-aqua" />
                  </span>
                </Reveal>
              </div>

              <div className="lg:col-span-5">
                <Reveal delay={100}>
                  <p className="leading-loose text-slate-600">
                    {siteConfig.nameTh} ({siteConfig.nameEn} : {siteConfig.shortName})
                    {" "}ก่อตั้งขึ้นในปี {foundedYear}{" "}
                    โดยเกิดจากการรวมตัวของสถาบันน้ำเพื่อความยั่งยืน และสถาบันสิ่งแวดล้อมอุตสาหกรรม
                    ภายใต้การกำกับดูแลของ{siteConfig.parentTh}
                  </p>
                </Reveal>

                <Reveal delay={200}>
                  <div className="mt-8 flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/70 p-5">
                    <span className="relative flex h-3 w-3 shrink-0">
                      <span
                        className="absolute inline-flex h-full w-full animate-ping rounded-full bg-wecci-aqua/60"
                        aria-hidden
                      />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-wecci-blue" />
                    </span>
                    <div>
                      <p className="text-2xl font-bold leading-none text-wecci-navy">
                        <CountUp to={2561} />
                      </p>
                      <p className="mt-1 text-xs text-slate-500">ปีที่ก่อตั้งสถาบัน</p>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </Band>

        {/* ขอบเขตการดำเนินงาน — การ์ดไอคอนเรียงกันแบบหน้า About ของเว็บต้นแบบ */}
        <Band tone="light" pattern="windmill" variant={2}>
          <div>
            <Reveal>
              <SectionHeading
                eyebrow="ขอบเขตการดำเนินงาน"
                title="งานหลักของสถาบัน"
                description="ครอบคลุมงานวิชาการ บริการ และความร่วมมือด้านการจัดการน้ำและสิ่งแวดล้อม"
                align="center"
              />
            </Reveal>

            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {serviceGroups.map((group, i) => (
                <Reveal key={group.id} delay={70 * i} className="h-full">
                  <li className="group flex h-full flex-col items-center rounded-2xl border border-slate-200 bg-white p-7 text-center wecci-shine relative transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-wecci-aqua hover:shadow-2xl">
                    <span
                      className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${group.gradient} text-white transition-transform duration-300 group-hover:scale-110`}
                    >
                      <ServiceIcon icon={group.icon} className="h-7 w-7" />
                    </span>
                    <p className="mt-5 font-bold text-wecci-navy">{group.title}</p>
                    <p className="mt-2 text-sm text-slate-600">{group.summary}</p>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </Band>

        {/* วิสัยทัศน์ — แบนด์สีเข้มคาดเต็มความกว้าง ข้อความอยู่กึ่งกลาง */}
        <section
          id="vision"
          className="relative flex scroll-mt-32 items-center overflow-hidden bg-gradient-to-br from-wecci-navy via-wecci-blue to-wecci-navy py-16 text-white sm:py-20"
        >
          {/* คลื่นนิ่ง ไม่มีแอนิเมชันในแบนด์วิสัยทัศน์ */}
          <WaterBackdrop tone="dark" animated={false} />
          <div
            className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-wecci-aqua/20 blur-3xl"
            aria-hidden
          />

          <Container className="relative w-full text-center">
            <Reveal>
              <p className="text-sm font-bold tracking-wide text-white">วิสัยทัศน์</p>
              <span
                className="mx-auto mt-2 block h-0.5 w-28 rounded-full bg-wecci-aqua"
                aria-hidden
              />
            </Reveal>

            <Reveal delay={150}>
              <p className="mx-auto mt-6 max-w-5xl text-xl font-bold leading-relaxed sm:text-2xl sm:leading-relaxed 2xl:text-3xl 2xl:leading-relaxed">
                “{vision}”
              </p>
            </Reveal>
          </Container>
        </section>

        {/* พันธกิจและเป้าหมาย — อยู่หน้าเดียวกัน */}
        <Band id="mission" tone="cloud" pattern="windmill" variant={3}>
          <div>
            <Reveal>
              <SectionHeading
                eyebrow="เกี่ยวกับเรา"
                title="พันธกิจและเป้าหมาย"
                description="กดที่พันธกิจแต่ละข้อเพื่อดูรายละเอียด"
                align="center"
              />
            </Reveal>

            <Reveal delay={100}>
              <MissionAccordion items={missionItems} />
            </Reveal>

            <Reveal className="mt-16 text-center">
              <p className="mb-6 font-bold text-wecci-navy">เป้าหมาย</p>
            </Reveal>
            <ol className="grid gap-5 md:grid-cols-3">
              {goals.map((goal, i) => (
                <Reveal key={goal} delay={100 * i} className="h-full">
                  <GoalCard index={i} text={goal} />
                </Reveal>
              ))}
            </ol>
          </div>
        </Band>

        {/* บุคลากรสถาบัน — พื้นเรียบ ไม่มีแอนิเมชัน เพราะเนื้อหาเป็นรูปบุคคล */}
        <Band id="staff" tone="mint" pattern="windmill" variant={4}>
          <Reveal>
            <SectionHeading
              eyebrow="เกี่ยวกับเรา"
              title="บุคลากรสถาบัน"
              description="ผู้ปฏิบัติงานประจำที่ดูแลบริการและโครงการต่าง ๆ"
              align="center"
            />
          </Reveal>
          {people.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white/60 p-12 text-center">
              <p className="font-bold text-wecci-navy">ยังไม่มีรายชื่อบุคลากร</p>
              <p className="mt-2 text-sm text-slate-500">
                รายชื่อจะแสดงที่นี่เมื่อเพิ่มข้อมูลในระบบจัดการ
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
                {people.map((person) => (
                  <PersonCard
                    key={person.id}
                    person={{
                      name: person.nameTh,
                      position: person.level,
                      photo: person.photo ?? undefined,
                    }}
                  />
                ))}
              </div>

              <div className="mt-8 text-center">
                <Link
                  href="/about/staff"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-wecci-navy ring-1 ring-wecci-aqua/30 transition hover:ring-wecci-aqua"
                >
                  ดูโครงสร้างบุคลากรทั้งหมด
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </>
          )}
        </Band>
      </div>

    </>
  );
}

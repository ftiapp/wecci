import type { Metadata } from "next";
import { ExecutiveBoard } from "@/components/about/ExecutiveBoard";
import { WaterContour } from "@/components/about/WaterContour";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { executiveLevelRank, executiveLevels } from "@/lib/executives/levels";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "โครงสร้างผู้บริหาร",
  description: "คณะผู้บริหารของสถาบันน้ำ สิ่งแวดล้อม และ Climate Change",
};

/*
  ข้อความประจำหน้า — ไม่ได้ผ่านหลังบ้านแบบบล็อกอีกแล้ว
  หน้าแก้เนื้อหา /admin/pages/about-executives ถูกถอดออกไป เหลือที่เดียวคือ /admin/executives
  ซึ่งจัดการ "รายชื่อผู้บริหาร" ที่เป็นเนื้อหาจริงของหน้านี้
  ส่วนพาดหัวกับแบนเนอร์เป็นข้อความคงที่ ถ้าจะแก้ต้องแก้ตรงนี้
*/
const HERO = {
  title: "โครงสร้างผู้บริหาร",
  description: "คณะผู้บริหารที่กำกับทิศทางการดำเนินงานของสถาบันฯ",
  image: "/images/about/executives-hero-v3.webp",
  imageAlt: "ทรงกลมแก้วใสวางอยู่บนพื้นมอสริมลำธารในป่า สะท้อนภาพผืนป่าอยู่ข้างใน",
  /* ทรงกลมอยู่ค่อนไปทางขวา บนมือถือจึงต้องยึดจุดนี้ไว้ไม่ให้โดนครอบทิ้ง */
  focus: "66% 50%",
};

const SECTION = {
  eyebrow: "คณะผู้บริหาร",
  title: "ผู้กำหนดทิศทางของสถาบันฯ",
  description:
    "คณะผู้บริหารสถาบันน้ำ สิ่งแวดล้อม และ Climate Change กำกับดูแลการดำเนินงานในแต่ละด้าน ตั้งแต่กลยุทธ์และแผนงาน การจัดการน้ำและสิ่งแวดล้อม ไปจนถึงการรับมือการเปลี่ยนแปลงสภาพภูมิอากาศ",
  watermark: "WECCI",
};

export default async function ExecutivesPage() {
  // รายชื่อผู้บริหารทั้งหมดเพิ่ม/แก้/ลบได้จากหลังบ้าน /admin/executives
  const executives = await prisma.cms_executive
    .findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    })
    .catch((error) => {
      console.error("[about] ดึงรายชื่อผู้บริหารไม่สำเร็จ", error);
      return [];
    });

  // จัดกลุ่มตามระดับ เรียงจากบนลงล่าง — ระดับที่หลังบ้านพิมพ์เองไปต่อท้าย
  const groups = [...executiveLevels, ...new Set(executives.map((person) => person.level))]
    .filter((level, index, all) => all.indexOf(level) === index)
    .map((level) => ({
      level,
      people: executives.filter((person) => person.level === level),
    }))
    .filter((group) => group.people.length > 0)
    .sort((a, b) => executiveLevelRank(a.level) - executiveLevelRank(b.level));

  return (
    <>
      <PageHero
        title={HERO.title}
        description={HERO.description}
        image={HERO.image}
        imageAlt={HERO.imageAlt}
        focus={HERO.focus}
        breadcrumb={[
          { label: "เกี่ยวกับเรา" },
          { label: "โครงสร้างผู้บริหาร", href: "/about/executives" },
        ]}
      />

      {/*
        พื้นขาว ฉากหลังเป็นเส้นสายน้ำ — ต่างจากหน้าโครงสร้างบุคลากรที่มีเมฆลอยกับกังหัน
        และไม่มีเส้นเชื่อมสายบังคับบัญชา ใช้หัวข้อระดับกับระยะห่างจัดลำดับแทน
        ให้อ่านแล้วได้น้ำหนักแบบหน้าคณะกรรมการในรายงานประจำปี

        section ตัวนอกห้ามใส่ overflow-hidden เด็ดขาด
        ถ้าใส่ ancestor จะกลายเป็นกรอบเลื่อนของตัวเอง แล้ว position:sticky ของลายน้ำจะตาย
        กลายเป็นเลื่อนหายไปพร้อมหน้าแทนที่จะค้างอยู่ — การตัดขอบไปทำที่ชั้นตกแต่งข้างในแทน
      */}
      <section className="relative bg-white">
        {/*
          ชั้นตกแต่ง — ก้อนแสงสีแบรนด์เบลอ ๆ กับลายจุดจาง
          ทั้งหมดจางมากพอที่จะไม่แย่งสายตาไปจากรูปและชื่อ แค่กันไม่ให้พื้นขาวโล่งจนน่าเบื่อ
          ชั้นนี้ตัดขอบได้ เพราะไม่มีอะไรข้างในที่ต้อง sticky
        */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          {/*
            ทรงเรขาคณิตแบนขนาดใหญ่สีเทาอ่อน วางเยื้องออกนอกขอบจอ
            เป็นสีทึบไม่เบลอ ขอบจึงคมและอ่านออกว่าเป็นรูปทรง ไม่ใช่คราบสี
            ตัวใหญ่กว่าการ์ดมาก เลยทำหน้าที่เป็นฉากหลังจริง ๆ ไม่ใช่จุดตกแต่งเล็ก ๆ
          */}
          <div className="absolute -top-40 -left-32 h-[34rem] w-[34rem] rotate-12 rounded-[6rem] bg-slate-100/80" />
          <div className="absolute top-[38%] -right-48 h-[40rem] w-[40rem] -rotate-6 rounded-[8rem] bg-slate-100/70" />

          {/* วงกลมโปร่งเส้นบาง คั่นไม่ให้ทรงทึบสองก้อนดูหนักเกินไป */}
          <div className="absolute top-[12%] right-[8%] h-72 w-72 rounded-full border border-wecci-aqua/20" />
          <div className="absolute bottom-[10%] left-[6%] h-56 w-56 rounded-full border border-wecci-mint/25" />

          {/* หยดน้ำทึบสีแบรนด์จาง ๆ — โยงกลับหางานหลักของสถาบันโดยไม่ต้องเขียนอธิบาย */}
          <div className="absolute top-[55%] left-[42%] h-40 w-40 rotate-45 rounded-[50%_50%_50%_0] bg-wecci-aqua/[0.07]" />

          {/* เส้นสายน้ำพาดทับทรงทั้งหมด ผูกทุกชิ้นให้เป็นฉากเดียวกัน */}
          <WaterContour className="absolute inset-0" />
        </div>

        {/*
          ลายน้ำตัวอักษรใหญ่ — อยู่คนละชั้นกับก้อนแสง เพราะชั้นนี้ห้ามตัดขอบ
          sticky จึงค้างอยู่กับที่ขณะเลื่อนอ่านรายชื่อ เหมือนตราน้ำที่อยู่กับแผ่นกระดาษ
          จางมากจนแทบเป็นเนื้อกระดาษ และทั้งชั้น aria-hidden อยู่แล้ว
          โปรแกรมอ่านหน้าจอจึงไม่หลุดไปอ่านตัวนี้ซ้ำกับชื่อสถาบันจริง
        */}
        {SECTION.watermark && (
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="sticky top-32 flex justify-end pr-2 sm:pr-8">
              <span className="text-[7rem] leading-none font-bold tracking-tighter text-wecci-navy/[0.05] select-none sm:text-[12rem] lg:text-[16rem]">
                {SECTION.watermark}
              </span>
            </div>
          </div>
        )}

        <div className="relative mx-auto w-full max-w-[1400px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12">
          <Reveal repeat>
            <div className="mb-14 max-w-3xl">
              {SECTION.eyebrow && (
                <p className="text-sm font-bold tracking-[0.2em] text-wecci-aqua uppercase">
                  {SECTION.eyebrow}
                </p>
              )}

              {SECTION.title && (
                <h2 className="mt-4 text-3xl font-bold text-wecci-navy sm:text-4xl">
                  {SECTION.title}
                </h2>
              )}

              <span className="mt-6 block h-1 w-24 rounded-full bg-wecci-aqua" aria-hidden />

              {SECTION.description && (
                <p className="mt-6 text-base leading-relaxed text-slate-600 sm:text-lg">
                  {SECTION.description}
                </p>
              )}
            </div>
          </Reveal>

          {groups.length > 0 ? (
            <ExecutiveBoard groups={groups} />
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 p-16 text-center">
              <p className="text-lg font-bold text-wecci-navy">ยังไม่มีรายชื่อผู้บริหาร</p>
              <p className="mt-2 text-sm text-slate-500">
                เพิ่มรายชื่อได้ที่หลังบ้าน เมนูโครงสร้างผู้บริหาร
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

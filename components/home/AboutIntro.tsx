import { Container } from "@/components/ui/Container";
import { CtaButton } from "@/components/ui/CtaButton";
import { MediaBackdrop } from "@/components/ui/MediaBackdrop";
import { vision } from "@/lib/data/about";
import { SectionHeading } from "@/components/ui/SectionHeading";

const pillars = [
  {
    title: "รู้คุณค่าน้ำ",
    detail: "สร้างความตระหนักในการใช้น้ำอย่างมีประสิทธิภาพตลอดกระบวนการผลิต",
  },
  {
    title: "ใช้ข้อมูลนำ",
    detail: "ตัดสินใจบนฐานข้อมูลคุณภาพน้ำและสถานการณ์น้ำที่เชื่อถือได้",
  },
  {
    title: "ร่วมมือกับชุมชน",
    detail: "อุตสาหกรรมและชุมชนอยู่ร่วมกับแหล่งน้ำเดียวกันได้อย่างสมดุล",
  },
];

/** เทียบเคียงส่วน "Bangchak Way" ของเว็บต้นแบบ */
export function AboutIntro() {
  return (
    <section className="bg-wecci-sand py-16 sm:py-20">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="WECCI Way"
              title="แนวทางการทำงานของสถาบันน้ำฯ"
              description="เราทำงานร่วมกับผู้ประกอบการในฐานะพันธมิตรระยะยาว เชื่อมโยงองค์ความรู้ทางวิชาการเข้ากับข้อจำกัดจริงของหน้างาน เพื่อให้แผนการจัดการน้ำนำไปปฏิบัติได้และวัดผลได้จริง"
            />

            <ul className="space-y-5">
              {pillars.map((pillar, i) => (
                <li key={pillar.title} className="flex gap-4">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-wecci-blue text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-bold text-wecci-navy">{pillar.title}</p>
                    <p className="text-sm text-slate-600">{pillar.detail}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <CtaButton href="/about">อ่านเพิ่มเติมเกี่ยวกับเรา</CtaButton>
            </div>
          </div>

          <div className="relative aspect-4/3 overflow-hidden rounded-3xl p-8 text-white shadow-xl">
            {/* ใส่ภาพจริงโดยส่ง src="/images/about/vision.jpg" */}
            <MediaBackdrop
              gradient="from-wecci-blue via-wecci-aqua to-wecci-mint"
              overlay="bg-wecci-navy/40"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="relative z-10 flex h-full flex-col justify-end">
              <p className="text-sm font-semibold text-white/80">วิสัยทัศน์</p>
              <p className="mt-2 text-xl font-bold leading-relaxed sm:text-2xl">
                “{vision}”
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

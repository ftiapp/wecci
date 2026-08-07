import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Band } from "@/components/ui/Band";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { serviceSections } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "บริการของเรา",
  description: "บริการที่ปรึกษา ตรวจวิเคราะห์คุณภาพน้ำ ประเมิน Water Footprint และฝึกอบรม",
};

/** หน้ารวมบริการ — การ์ดแต่ละใบพาไปหน้ารายละเอียดของบริการนั้น */
export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="บริการของเรา"
        description="บริการที่ปรึกษา ตรวจวิเคราะห์ ฝึกอบรม และศึกษาดูงานสำหรับภาคอุตสาหกรรม"
        breadcrumb={[{ label: "บริการของเรา", href: "/services" }]}
        image="/images/services/meeting-wecci.webp"
        imageAlt="การนำเสนอและอบรมด้านสิ่งแวดล้อมให้แก่ผู้ประกอบการ"
      />

      <Band tone="sky" pattern="windmill" variant={4}>
        <div>
          <Reveal>
            <SectionHeading
              eyebrow="บริการของเรา"
              title="บริการครบวงจร"
              description="เลือกดูรายละเอียดของแต่ละบริการที่สถาบันฯ ให้บริการแก่ภาคอุตสาหกรรม"
              align="center"
            />
          </Reveal>

          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {serviceSections.map((section, i) => (
              <Reveal key={section.id} delay={70 * i} className="h-full">
                <li className="h-full">
                  <Link
                    href={`/services/${section.id}`}
                    className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-7 wecci-shine relative transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-wecci-aqua hover:shadow-2xl"
                  >
                    <p className="font-bold text-wecci-navy group-hover:text-wecci-blue">
                      {section.label}
                    </p>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                      {section.description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-wecci-blue">
                      ดูรายละเอียด
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4 transition group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </span>
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </Band>
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { Band } from "@/components/ui/Band";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { serviceSections } from "@/lib/site-config";

function getSection(slug: string) {
  return serviceSections.find((section) => section.id === slug);
}

export function generateStaticParams() {
  return serviceSections.map((section) => ({ slug: section.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const section = getSection(slug);

  return {
    title: section?.label ?? "ไม่พบบริการ",
    description: section?.description,
  };
}

/** หน้าบริการรายหัวข้อ — โครงเดียวกันทุกหน้า ต่างกันแค่ชื่อและคำอธิบาย */
export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const section = getSection(slug);
  if (!section) notFound();

  return (
    <>
      <PageHero
        title={section.label}
        description={section.description}
        breadcrumb={[
          { label: "บริการของเรา", href: "/services" },
          { label: section.label, href: `/services/${section.id}` },
        ]}
      />

      <Band tone="sky" pattern="windmill" variant={3}>
        <div>
          <Reveal>
            <SectionHeading
              eyebrow="บริการของเรา"
              title={section.label}
              description={section.description}
              align="center"
            />
          </Reveal>

          {/* ยังไม่มีเนื้อหาจริงจากสถาบัน — รอข้อมูลมาแทนที่ */}
          <Reveal delay={100}>
            <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white/60 p-16 text-center">
              <p className="text-lg font-bold text-wecci-navy">อยู่ระหว่างจัดทำเนื้อหา</p>
              <p className="mt-2 text-sm text-slate-500">
                รายละเอียดบริการจะเผยแพร่ที่หน้านี้
              </p>
            </div>
          </Reveal>
        </div>
      </Band>
    </>
  );
}

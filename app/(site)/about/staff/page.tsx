import type { Metadata } from "next";
import { OrgChart } from "@/components/about/OrgChart";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { WindmillBackdrop } from "@/components/ui/WindmillBackdrop";
import { prisma } from "@/lib/prisma";
import { levelRank, staffLevels } from "@/lib/staff/levels";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "โครงสร้างบุคลากร",
  description: "บุคคลากรประจำสถาบันน้ำ สิ่งแวดล้อม และ Climate Change",
};

export default async function StaffPage() {
  // รายชื่อทั้งหมดเพิ่ม/แก้ไขได้จากหลังบ้าน /admin/staff
  const staff = await prisma.cms_staff
    .findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    })
    .catch((error) => {
      console.error("[about] ดึงรายชื่อบุคลากรไม่สำเร็จ", error);
      return [];
    });

  // จัดกลุ่มตามระดับตำแหน่ง เรียงจากบนลงล่างตามผังองค์กร
  const groups = [...staffLevels, ...new Set(staff.map((person) => person.level))]
    .filter((level, index, all) => all.indexOf(level) === index)
    .map((level) => ({ level, people: staff.filter((person) => person.level === level) }))
    .filter((group) => group.people.length > 0)
    .sort((a, b) => levelRank(a.level) - levelRank(b.level));

  return (
    <>
      <PageHero
        title="โครงสร้างบุคลากร"
        description="บุคคลากรประจำสถาบันน้ำ สิ่งแวดล้อม และ Climate Change"
        image="/images/about/staff-hero-v5.webp"
        imageAlt="ทีมงานสถาบันน้ำ สิ่งแวดล้อม และ Climate Change"
        breadcrumb={[
          { label: "เกี่ยวกับเรา", href: "/about" },
          { label: "โครงสร้างบุคลากร", href: "/about/staff" },
        ]}
      />

      {/* ส่วนผัง — ออกแบบให้อ่านจบได้โดยแทบไม่ต้องเลื่อน */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-sky-50/60">
        <WindmillBackdrop tone="light" variant={4} tall />

        <div className="relative mx-auto w-full max-w-[1760px] px-5 py-12 sm:px-8 lg:px-12">
          <Reveal>
            <div className="mb-6 text-center">
              <p className="text-sm font-bold text-wecci-aqua">ทีมงานของเรา</p>
              <h2 className="mt-1 text-2xl font-bold text-wecci-navy sm:text-3xl">
                โครงสร้างบุคลากร
              </h2>
              <span
                className="mx-auto mt-3 block h-[3px] w-32 rounded-full bg-gradient-to-r from-wecci-aqua to-wecci-mint"
                aria-hidden
              />
              <p className="mt-3 text-sm text-slate-500">
                ติดต่อเจ้าหน้าที่ตามสายงานที่เกี่ยวข้องได้โดยตรง
              </p>
            </div>
          </Reveal>

          {staff.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white/60 p-16 text-center">
              <p className="text-lg font-bold text-wecci-navy">ยังไม่มีรายชื่อบุคลากร</p>
              <p className="mt-2 text-sm text-slate-500">
                รายชื่อจะแสดงที่นี่เมื่อเพิ่มข้อมูลในระบบจัดการ
              </p>
            </div>
          ) : (
            // แต่ละชั้น/การ์ดมีจังหวะปรากฏของตัวเองอยู่แล้วใน OrgChart จึงไม่ห่อ Reveal ซ้ำ
            <OrgChart levels={groups} />
          )}
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { KnowledgeGrid, type KnowledgeCard } from "@/components/news/KnowledgeGrid";
import { Band } from "@/components/ui/Band";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { coverImage } from "@/lib/knowledge/kinds";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "องค์ความรู้/วีดีโอ",
  description: "คลังความรู้ คู่มือ และวีดีโอเผยแพร่ของสถาบัน",
};

export default async function KnowledgePage() {
  // รายการทั้งหมดเพิ่ม/แก้ไขได้จากหลังบ้าน /admin/knowledge
  const rows = await prisma.cms_knowledge_items
    .findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    })
    .catch((error) => {
      console.error("[knowledge] ดึงรายการไม่สำเร็จ", error);
      return [];
    });

  // คำนวณภาพปกตั้งแต่ฝั่งเซิร์ฟเวอร์ แล้วส่งเฉพาะค่าที่ต้องใช้ไปให้ตัวกรอง
  const items: KnowledgeCard[] = rows.map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    kind: row.kind,
    url: row.url,
    featured: row.featured,
    cover: coverImage(row),
  }));

  return (
    <>
      <PageHero
        title="องค์ความรู้/วีดีโอ"
        description="คลังความรู้ คู่มือปฏิบัติ และวีดีโอเผยแพร่ด้านการจัดการน้ำและสิ่งแวดล้อม"
        breadcrumb={[
          { label: "ข่าวสาร", href: "/news" },
          { label: "องค์ความรู้/วีดีโอ", href: "/news/knowledge" },
        ]}
      />

      <Band tone="sky" pattern="windmill" variant={2}>
        <div>
          <Reveal>
            <SectionHeading
              eyebrow="คลังความรู้"
              title="องค์ความรู้และวีดีโอ"
              description="เอกสารเผยแพร่ คู่มือ และสื่อวีดีโอสำหรับผู้ประกอบการ"
              align="center"
            />
          </Reveal>

          {items.length === 0 ? (
            <Reveal delay={100}>
              <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white/60 p-16 text-center">
                <p className="text-lg font-bold text-wecci-navy">ยังไม่มีเนื้อหาเผยแพร่</p>
                <p className="mt-2 text-sm text-slate-500">
                  เอกสารและวีดีโอจะทยอยเผยแพร่ที่หน้านี้
                </p>
              </div>
            </Reveal>
          ) : (
            <Reveal delay={100}>
              <KnowledgeGrid items={items} />
            </Reveal>
          )}
        </div>
      </Band>
    </>
  );
}

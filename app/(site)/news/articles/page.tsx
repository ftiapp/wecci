import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ArticleExplorer, type ArticleCard } from "@/components/news/ArticleExplorer";
import { Band } from "@/components/ui/Band";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ข่าวสาร/บทความ",
  description: "ข่าวประชาสัมพันธ์และบทความจากทีมวิชาการของสถาบัน",
};

const dateFormat = new Intl.DateTimeFormat("th-TH", { dateStyle: "long" });

export default async function ArticlesPage() {
  // บทความทั้งหมดเพิ่ม/แก้ไขได้จากหลังบ้าน /admin/articles
  const rows = await prisma.cms_articles
    .findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
    })
    .catch((error) => {
      console.error("[articles] ดึงบทความไม่สำเร็จ", error);
      return [];
    });

  const articles: ArticleCard[] = rows.map((row) => ({
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    image: row.image,
    featured: row.featured,
    dateText: dateFormat.format(row.publishedAt),
  }));

  return (
    <>
      <PageHero
        title="ข่าวสาร/บทความ"
        description="ติดตามข่าวประชาสัมพันธ์ บทความ และบทวิเคราะห์จากทีมงานของสถาบันฯ"
        breadcrumb={[
          { label: "ข่าวสาร" },
          { label: "ข่าวสาร/บทความ", href: "/news/articles" },
        ]}
      />

      <Band tone="sky" pattern="windmill" variant={3}>
        <div>
          <Reveal>
            <SectionHeading
              eyebrow="ข่าวสาร/บทความ"
              title="ข่าวสารและบทความ"
              description="ข่าวประชาสัมพันธ์ บทวิเคราะห์ และความเคลื่อนไหวล่าสุดของสถาบันฯ"
              align="center"
            />
          </Reveal>

          {articles.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white/60 p-16 text-center">
              <p className="text-lg font-bold text-wecci-navy">ยังไม่มีบทความเผยแพร่</p>
              <p className="mt-2 text-sm text-slate-500">บทความจะทยอยเผยแพร่ที่หน้านี้</p>
            </div>
          ) : (
            <ArticleExplorer articles={articles} />
          )}
        </div>
      </Band>
    </>
  );
}

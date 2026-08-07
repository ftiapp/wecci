import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { EventBoard } from "@/components/news/EventBoard";
import { KnowledgeGrid, type KnowledgeCard } from "@/components/news/KnowledgeGrid";
import { Band } from "@/components/ui/Band";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArticleTeaser, type ArticleCard } from "@/components/news/ArticleTeaser";
import { getPublishedEvents } from "@/lib/events/store";
import { coverImage } from "@/lib/knowledge/kinds";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const articleDate = new Intl.DateTimeFormat("th-TH", { dateStyle: "long" });

export const metadata: Metadata = {
  title: "ข่าวสาร",
  description: "ข่าวสาร กิจกรรม การอบรม และปฏิทินกิจกรรมของสถาบัน",
};

/** หน้ารวมของเมนูข่าวสาร — ไล่ทั้งสามหัวข้อย่อยต่อกันในหน้าเดียว */
export default async function NewsPage() {
  const events = await getPublishedEvents();

  const articleRows = await prisma.cms_articles
    .findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }],
      take: 3,
    })
    .catch((error) => {
      console.error("[news] ดึงบทความไม่สำเร็จ", error);
      return [];
    });

  const articles: ArticleCard[] = articleRows.map((row) => ({
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    image: row.image,
    featured: row.featured,
    dateText: articleDate.format(row.publishedAt),
  }));

  const knowledgeRows = await prisma.cms_knowledge_items
    .findMany({ where: { published: true }, orderBy: { createdAt: "desc" }, take: 6 })
    .catch((error) => {
      console.error("[news] ดึงองค์ความรู้ไม่สำเร็จ", error);
      return [];
    });

  const knowledge: KnowledgeCard[] = knowledgeRows.map((row) => ({
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
        title="ข่าวสาร"
        description="ติดตามข่าวสาร กิจกรรม หลักสูตรอบรม และความเคลื่อนไหวล่าสุดของสถาบัน"
        breadcrumb={[{ label: "ข่าวสาร", href: "/news" }]}
        image="/images/news/reading-v2.webp"
        imageAlt="ผู้อ่านข่าวสารของสถาบันผ่านแท็บเล็ต"
      />

      {/* 1) ข่าวสาร/บทความ */}
      <Band id="articles" tone="sky" pattern="windmill" variant={3}>
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
            <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {articles.map((article, i) => (
                <Reveal key={article.id} delay={70 * i} className="h-full">
                  <li className="h-full">
                    <ArticleTeaser article={article} />
                  </li>
                </Reveal>
              ))}
            </ul>
          )}

          <MoreLink href="/news/articles">ดูข่าวสาร/บทความทั้งหมด</MoreLink>
        </div>
      </Band>

      {/* 2) ปฏิทินกิจกรรม */}
      <Band id="events" tone="sky" pattern="windmill">
        <div>
          <Reveal>
            <SectionHeading
              eyebrow="ข่าวสาร"
              title="ปฏิทินกิจกรรม"
              description="ตารางอบรม สัมมนา ประชุม และศึกษาดูงานของสถาบัน"
              align="center"
            />
          </Reveal>

          <Reveal delay={100}>
            <EventBoard events={events} />
          </Reveal>

          <MoreLink href="/news/events">ดูปฏิทินกิจกรรมทั้งหมด</MoreLink>
        </div>
      </Band>

      {/* 3) องค์ความรู้/วีดีโอ */}
      <Band id="knowledge" tone="sky" pattern="windmill" variant={2}>
        <div>
          <Reveal>
            <SectionHeading
              eyebrow="คลังความรู้"
              title="องค์ความรู้และวีดีโอ"
              description="เอกสารเผยแพร่ คู่มือ และสื่อวีดีโอสำหรับผู้ประกอบการ"
              align="center"
            />
          </Reveal>

          {knowledge.length === 0 ? (
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
              {/* หน้ารวมไม่ต้องมีช่องค้นหา ให้ไปใช้ที่หน้าย่อยแทน */}
              <KnowledgeGrid items={knowledge} showSearch={false} />
            </Reveal>
          )}

          <MoreLink href="/news/knowledge">ดูองค์ความรู้ทั้งหมด</MoreLink>
        </div>
      </Band>
    </>
  );
}

/** ปุ่มลิงก์ไปหน้าย่อยที่มีแบนเนอร์และตัวกรองของตัวเอง */
function MoreLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <div className="mt-10 text-center">
      <Link
        href={href}
        className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-wecci-navy transition hover:gap-3 hover:border-wecci-blue hover:text-wecci-blue"
      >
        {children}
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </Link>
    </div>
  );
}

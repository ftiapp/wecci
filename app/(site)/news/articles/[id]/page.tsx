import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlockView } from "@/components/news/BlockView";
import { ShareRail } from "@/components/news/ShareRail";
import { WindmillBackdrop } from "@/components/ui/WindmillBackdrop";
import { parseBlocks } from "@/lib/events/content";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const dateFormat = new Intl.DateTimeFormat("th-TH", { dateStyle: "long" });

async function getArticle(id: string) {
  const articleId = Number(id);
  if (!Number.isInteger(articleId)) return null;

  return prisma.cms_articles.findUnique({ where: { id: articleId } });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const article = await getArticle(id);

  return {
    title: article?.title ?? "ไม่พบบทความ",
    description: article?.excerpt ?? undefined,
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticle(id);
  if (!article) notFound();

  // นับยอดวิว — ต้อง await ไม่งั้นการเรนเดอร์จบก่อนแล้วคำสั่งอาจถูกทิ้ง
  let views = article.views;
  try {
    const counted = await prisma.cms_articles.update({
      where: { id: article.id },
      data: { views: { increment: 1 } },
      select: { views: true },
    });
    views = counted.views;
  } catch (error) {
    console.error("[articles] นับยอดวิวไม่สำเร็จ", error);
  }

  const blocks = parseBlocks(article.content);

  return (
    <>
      {/* แถบเส้นทางนำพื้นอ่อน คั่นระหว่างเฮดเดอร์กับแบนเนอร์ */}
      <div className="border-b border-slate-200 bg-slate-50">
        <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-6 pb-3 pt-28 text-sm text-slate-500 sm:px-8 sm:pt-32">
          <Link href="/" className="transition hover:text-wecci-blue">
            หน้าแรก
          </Link>
          <span className="text-slate-300" aria-hidden>
            ›
          </span>
          <Link href="/news/articles" className="transition hover:text-wecci-blue">
            ข่าวสาร/บทความ
          </Link>
          <span className="text-slate-300" aria-hidden>
            ›
          </span>
          <span className="font-semibold text-wecci-navy">{article.title}</span>
        </nav>
      </div>

      {/* ส่วนหัวสีแบรนด์ — ภาพปกซ้าย รายละเอียดขวา */}
      <section className="relative overflow-hidden bg-gradient-to-br from-wecci-navy via-wecci-blue to-wecci-navy text-white">
        <WindmillBackdrop tone="dark" />

        <div className="relative mx-auto max-w-6xl px-6 py-14 sm:px-8">
          {/* ป้ายกำกับอยู่บนสุดของแบนเนอร์ */}
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold backdrop-blur">
              #{article.category}
            </span>
            {article.featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-4 py-1.5 text-xs font-bold text-amber-950">
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden>
                  <path d="m12 2 2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8Z" />
                </svg>
                ไฮไลท์
              </span>
            )}
            {!article.published && (
              <span className="rounded-full bg-amber-400/20 px-4 py-1.5 text-xs text-amber-100">
                ฉบับร่าง
              </span>
            )}
          </div>

          <div className="grid gap-8 lg:grid-cols-[22rem_minmax(0,1fr)]">
            {/* ภาพปก — ไม่มีกรอบขาว ใช้เงาให้ลอยจากพื้นหลัง */}
            <div className="mx-auto w-full max-w-sm shrink-0 lg:mx-0">
              <div className="relative aspect-16/9 overflow-hidden rounded-2xl bg-slate-100 shadow-2xl">
                {article.image ? (
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="352px"
                    className="object-cover"
                    preload
                  />
                ) : (
                  <span className="flex h-full items-center justify-center bg-gradient-to-br from-wecci-navy to-wecci-aqua text-white/40">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-12 w-12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.4}
                      strokeLinecap="round"
                      aria-hidden
                    >
                      <path d="M4 5h16v14H4zM8 9h8M8 13h5" />
                    </svg>
                  </span>
                )}
              </div>
            </div>

            <div>
              <h1 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl lg:text-[2.6rem]">
                {article.title}
              </h1>

              <span
                className="mt-4 block h-[3px] w-full max-w-3xl bg-gradient-to-r from-wecci-aqua to-wecci-mint"
                aria-hidden
              />

              <dl className="mt-7 space-y-3 text-sm text-slate-200 sm:text-base">
                <Meta icon="M3 5h18v16H3zM3 10h18M8 3v4M16 3v4">
                  {dateFormat.format(article.publishedAt)}
                </Meta>
                <Meta icon="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z">
                  {views ?? 0}
                </Meta>
              </dl>

              {article.excerpt && (
                <p className="mt-6 max-w-2xl leading-relaxed text-slate-200">
                  {article.excerpt}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* เนื้อหา */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-12 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[4.5rem_minmax(0,1fr)]">
            <ShareRail title={article.title} />

            <div className="min-w-0">
              <h2 className="text-xl font-bold text-wecci-navy">เนื้อหาบทความ</h2>
              <span className="mt-2 block h-0.5 w-16 rounded-full bg-wecci-aqua" aria-hidden />

              {blocks.length === 0 ? (
                <p className="mt-6 text-sm text-slate-400">ยังไม่มีเนื้อหาเพิ่มเติม</p>
              ) : (
                <div className="mt-6 space-y-5">
                  {blocks.map((block, index) => (
                    <BlockView key={index} block={block} />
                  ))}
                </div>
              )}

              <Link
                href="/news/articles"
                className="mt-12 inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-wecci-blue hover:text-wecci-blue"
              >
                ← บทความทั้งหมด
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/** บรรทัดข้อมูลกำกับพร้อมไอคอนในส่วนหัว */
function Meta({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5">
      <svg
        viewBox="0 0 24 24"
        className="mt-0.5 h-4 w-4 shrink-0 text-wecci-aqua"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d={icon} />
      </svg>
      <span>{children}</span>
    </div>
  );
}

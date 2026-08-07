import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlockView } from "@/components/news/BlockView";
import { ShareRail } from "@/components/news/ShareRail";
import { WindmillBackdrop } from "@/components/ui/WindmillBackdrop";
import { parseBlocks } from "@/lib/events/content";
import { coverImage, kindLabel, youtubeId } from "@/lib/knowledge/kinds";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const dateFormat = new Intl.DateTimeFormat("th-TH", { dateStyle: "long" });

async function getItem(id: string) {
  const itemId = Number(id);
  if (!Number.isInteger(itemId)) return null;

  return prisma.cms_knowledge_items.findUnique({ where: { id: itemId } });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const item = await getItem(id);

  return {
    title: item?.title ?? "ไม่พบเนื้อหา",
    description: item?.description ?? undefined,
  };
}

export default async function KnowledgeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getItem(id);
  if (!item) notFound();

  // นับยอดวิว — ต้อง await ไม่งั้นการเรนเดอร์จบก่อนแล้วคำสั่งอาจถูกทิ้ง
  let views = item.views;
  try {
    const counted = await prisma.cms_knowledge_items.update({
      where: { id: item.id },
      data: { views: { increment: 1 } },
      select: { views: true },
    });
    views = counted.views;
  } catch (error) {
    console.error("[knowledge] นับยอดวิวไม่สำเร็จ", error);
  }

  const blocks = parseBlocks(item.content);
  const video = youtubeId(item.url);
  const cover = coverImage(item);

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
          <Link href="/news/knowledge" className="transition hover:text-wecci-blue">
            องค์ความรู้/วีดีโอ
          </Link>
          <span className="text-slate-300" aria-hidden>
            ›
          </span>
          <span className="font-semibold text-wecci-navy">{item.title}</span>
        </nav>
      </div>

      {/* ส่วนหัวสีแบรนด์ — ภาพปกซ้าย รายละเอียดขวา */}
      <section className="relative overflow-hidden bg-gradient-to-br from-wecci-navy via-wecci-blue to-wecci-navy text-white">
        <WindmillBackdrop tone="dark" />

        <div className="relative mx-auto max-w-6xl px-6 py-14 sm:px-8">
          {/* ป้ายกำกับอยู่บนสุดของแบนเนอร์ */}
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold backdrop-blur">
              {kindLabel(item.kind)}
            </span>
            {item.featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-400 px-4 py-1.5 text-xs font-bold text-amber-950">
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor" aria-hidden>
                  <path d="m12 2 2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.3 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8Z" />
                </svg>
                ไฮไลท์
              </span>
            )}
            {!item.published && (
              <span className="rounded-full bg-amber-400/20 px-4 py-1.5 text-xs text-amber-100">
                ฉบับร่าง
              </span>
            )}
          </div>

          <div className="grid gap-8 lg:grid-cols-[22rem_minmax(0,1fr)]">
            {/* ภาพปก — ไม่มีกรอบขาว ใช้เงาให้ลอยจากพื้นหลัง */}
            <div className="mx-auto w-full max-w-sm shrink-0 lg:mx-0">
              <div className="relative aspect-16/9 overflow-hidden rounded-2xl bg-slate-100 shadow-2xl">
                {cover ? (
                  <Image
                    src={cover}
                    alt={item.title}
                    fill
                    sizes="352px"
                    className="object-cover"
                    unoptimized={cover.startsWith("http")}
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
                      aria-hidden
                    >
                      <path d="M4 5h16v14H4zM9 9l6 3-6 3z" strokeLinejoin="round" />
                    </svg>
                  </span>
                )}

                {/* วีดีโอมีปุ่มเล่นทับภาพ ให้รู้ว่าเลื่อนลงไปดูได้ */}
                {video && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-wecci-navy shadow-lg">
                      <svg
                        viewBox="0 0 24 24"
                        className="ml-1 h-7 w-7"
                        fill="currentColor"
                        aria-hidden
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  </span>
                )}
              </div>
            </div>

            <div>
              <h1 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl lg:text-[2.6rem]">
                {item.title}
              </h1>

              <span
                className="mt-4 block h-[3px] w-full max-w-3xl bg-gradient-to-r from-wecci-aqua to-wecci-mint"
                aria-hidden
              />

              <dl className="mt-7 space-y-3 text-sm text-slate-200 sm:text-base">
                <Meta icon="M3 5h18v16H3zM3 10h18M8 3v4M16 3v4">
                  {dateFormat.format(item.createdAt)}
                </Meta>
                <Meta icon="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z">
                  {views ?? 0}
                </Meta>
              </dl>

              {item.description && (
                <p className="mt-6 max-w-2xl leading-relaxed text-slate-200">
                  {item.description}
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
            <ShareRail title={item.title} />

            <div className="min-w-0">
              {/* วีดีโอเล่นในหน้าได้เลยถ้าเป็นคลิป YouTube */}
              {video && (
                <div className="mb-10 aspect-16/9 overflow-hidden rounded-2xl bg-slate-900 shadow-xl">
                  <iframe
                    src={`https://www.youtube.com/embed/${video}`}
                    title={item.title}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              <h2 className="text-xl font-bold text-wecci-navy">รายละเอียด</h2>
              <span
                className="mt-2 block h-0.5 w-16 rounded-full bg-wecci-aqua"
                aria-hidden
              />

              {blocks.length === 0 ? (
                <p className="mt-6 text-sm text-slate-400">ยังไม่มีรายละเอียดเพิ่มเติม</p>
              ) : (
                <div className="mt-6 space-y-5">
                  {blocks.map((block, index) => (
                    <BlockView key={index} block={block} />
                  ))}
                </div>
              )}

              {/* ลิงก์ต้นทาง เช่น ไฟล์ PDF หรือเว็บภายนอก */}
              {item.url && !video && (
                <div className="relative mt-12 overflow-hidden rounded-3xl bg-gradient-to-br from-wecci-navy via-wecci-blue to-wecci-navy p-8 text-center text-white sm:p-10">
                  <div
                    className="wecci-float pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-wecci-aqua/25 blur-3xl"
                    aria-hidden
                  />

                  <div className="relative">
                    <h3 className="text-xl font-bold">เปิดเอกสารต้นฉบับ</h3>
                    <p className="mt-2 text-sm text-slate-200">
                      กดปุ่มเพื่อเปิดไฟล์หรือเว็บไซต์ต้นทางในแท็บใหม่
                    </p>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold text-wecci-navy shadow-lg transition hover:gap-3 hover:bg-wecci-aqua hover:text-white"
                    >
                      เปิดเอกสาร
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
                        <path d="M7 17 17 7M9 7h8v8" />
                      </svg>
                    </a>
                  </div>
                </div>
              )}

              <Link
                href="/news/knowledge"
                className="mt-12 inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-wecci-blue hover:text-wecci-blue"
              >
                ← องค์ความรู้ทั้งหมด
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

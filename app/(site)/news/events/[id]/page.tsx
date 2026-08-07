import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { BlockView } from "@/components/news/BlockView";
import { WindmillBackdrop } from "@/components/ui/WindmillBackdrop";
import { ShareRail } from "@/components/news/ShareRail";
import { parseBlocks, type ContentBlock } from "@/lib/events/content";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const dateFormat = new Intl.DateTimeFormat("th-TH", { dateStyle: "long" });
const monthFormat = new Intl.DateTimeFormat("th-TH", { month: "long", year: "numeric" });

async function getEvent(id: string) {
  const eventId = Number(id);
  if (!Number.isInteger(eventId)) return null;

  return prisma.cms_events.findUnique({
    where: { id: eventId },
    include: { tags: true },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const event = await getEvent(id);

  return {
    title: event?.title ?? "ไม่พบกิจกรรม",
    description: event?.excerpt ?? undefined,
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEvent(id);
  if (!event) notFound();

  // นับยอดวิวแล้วใช้ค่าที่เพิ่งบวก เพื่อให้ตัวเลขบนหน้าตรงกับที่บันทึกจริง
  // ต้อง await ไม่งั้นการเรนเดอร์จบก่อนแล้วคำสั่งอาจถูกทิ้ง
  let views = event.views;
  try {
    const counted = await prisma.cms_events.update({
      where: { id: event.id },
      data: { views: { increment: 1 } },
      select: { views: true },
    });
    views = counted.views;
  } catch (error) {
    console.error("[news] นับยอดวิวไม่สำเร็จ", error);
  }

  const [blocks, qr] = await Promise.all([
    Promise.resolve(parseBlocks(event.content)),
    event.registerUrl
      ? QRCode.toDataURL(event.registerUrl, {
          margin: 1,
          width: 400,
          color: { dark: "#16357c", light: "#ffffff" },
        })
      : null,
  ]);

  // กิจกรรมวันเดียวไม่ต้องแสดงวันที่ซ้ำสองครั้ง
  const sameDay =
    !event.endDate || event.endDate.toDateString() === event.startDate.toDateString();
  const dateText = sameDay
    ? dateFormat.format(event.startDate)
    : `${dateFormat.format(event.startDate)} – ${dateFormat.format(event.endDate!)}`;

  const today = new Date();
  const endMoment = new Date(event.endDate ?? event.startDate);
  endMoment.setHours(23, 59, 59);
  const status =
    today < event.startDate ? "เร็ว ๆ นี้" : today > endMoment ? "เสร็จสิ้น" : "กำลังจัด";

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
          <Link href="/news/events" className="transition hover:text-wecci-blue">
            ปฏิทินกิจกรรม
          </Link>
          <span className="text-slate-300" aria-hidden>
            ›
          </span>
          <span className="font-semibold text-wecci-navy">{event.title}</span>
        </nav>
      </div>

      {/* ส่วนหัวสีแบรนด์ — โปสเตอร์ซ้าย รายละเอียดขวา */}
      <section className="relative overflow-hidden bg-gradient-to-br from-wecci-navy via-wecci-blue to-wecci-navy text-white">
        <WindmillBackdrop tone="dark" />

        <div className="relative mx-auto max-w-6xl px-6 py-14 sm:px-8">

          <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
            {/* โปสเตอร์ — ไม่มีกรอบขาว ใช้เงาให้ลอยจากพื้นหลังแทน */}
            <div className="mx-auto w-56 shrink-0 sm:w-64 lg:mx-0">
              <div className="relative aspect-3/4 overflow-hidden rounded-2xl bg-slate-100 shadow-2xl">
                {event.image ? (
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    sizes="256px"
                    className="object-cover"
                    preload
                  />
                ) : (
                  // ยังไม่ได้อัปโหลดโปสเตอร์ — แสดงวันที่ตัวใหญ่แทนช่องว่าง
                  <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-wecci-navy via-wecci-blue to-wecci-aqua text-white">
                    <span className="text-6xl font-bold leading-none">
                      {event.startDate.getUTCDate()}
                    </span>
                    <span className="mt-2 text-sm text-white/80">
                      {monthFormat.format(event.startDate)}
                    </span>
                    <span className="mt-6 rounded-full border border-white/30 px-4 py-1 text-xs">
                      {event.category}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold backdrop-blur">
                  {status}
                </span>
                {event.registerUrl && status !== "เสร็จสิ้น" && (
                  <span className="relative inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-wecci-mint px-4 py-1.5 text-xs font-semibold text-white">
                    <span className="wecci-pulse-glow h-1.5 w-1.5 rounded-full bg-white" aria-hidden />
                    เปิดลงทะเบียน
                  </span>
                )}
                <span className="rounded-full bg-white/10 px-4 py-1.5 text-xs backdrop-blur">
                  {event.category}
                </span>
                {event.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-full bg-white/10 px-4 py-1.5 text-xs backdrop-blur"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>

              <h1 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl lg:text-[2.6rem]">
                {event.title}
              </h1>
              {/* เส้นคาดใต้ชื่อ — ลายพู่กันสะบัด หนาช่วงต้นแล้วเรียวสะบัดปลาย */}
              <svg
                viewBox="0 0 600 22"
                preserveAspectRatio="none"
                className="mt-3 block h-4 w-full max-w-3xl"
                aria-hidden
              >
                <defs>
                  <linearGradient id="brush-stroke" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="var(--wecci-aqua)" />
                    <stop offset="100%" stopColor="var(--wecci-mint)" />
                  </linearGradient>
                </defs>
                {/* ขอบบนโค้งลงเล็กน้อย ขอบล่างโค้งกลับ ทำให้ช่วงต้นหนาแล้วค่อยเรียวจนแหลม */}
                <path
                  d="M4 6 C 150 1, 330 3, 596 9 C 330 13, 150 15, 4 15 Z"
                  fill="url(#brush-stroke)"
                />
              </svg>

              <dl className="mt-7 space-y-3 text-sm text-slate-200 sm:text-base">
                <Meta icon="M3 5h18v16H3zM3 10h18M8 3v4M16 3v4">{dateText}</Meta>
                {event.time && <Meta icon="M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z">{event.time}</Meta>}
                {event.place && (
                  <Meta icon="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11ZM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z">
                    {event.place}
                  </Meta>
                )}
                <Meta icon="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z">
                  {views ?? 0}
                </Meta>
              </dl>

              {event.excerpt && (
                <p className="mt-6 max-w-2xl leading-relaxed text-slate-200">
                  {event.excerpt}
                </p>
              )}

              {!event.published && (
                <p className="mt-6 inline-block rounded-xl bg-amber-400/20 px-4 py-2 text-sm text-amber-100">
                  ฉบับร่าง — ยังไม่แสดงในปฏิทินหน้าข่าวสาร
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
            <ShareRail title={event.title} />

            <article className="min-w-0">
              <h2 className="text-xl font-bold text-wecci-navy">ไฮไลต์</h2>
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

              {/* ลงทะเบียน — วางโล่ง ๆ กลางหน้า ไม่มีกรอบ */}
              {event.registerUrl && (
                <section className="mt-16 text-center">
                  <span
                    className="mx-auto block h-px w-24 bg-slate-200"
                    aria-hidden
                  />

                  <p className="mt-8 text-xs font-semibold tracking-widest text-wecci-aqua uppercase">
                    Registration
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-wecci-navy">
                    ลงทะเบียนเข้าร่วมกิจกรรม
                  </h3>

                  <a
                    href={event.registerUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-wecci-navy to-wecci-blue px-12 py-3.5 font-semibold text-white shadow-xl shadow-wecci-blue/20 transition hover:gap-3 hover:from-wecci-blue hover:to-wecci-aqua"
                  >
                    ลงทะเบียน
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

                  {qr && (
                    <>
                      <p className="mt-10 text-sm text-slate-400">หรือสแกน QR Code</p>
                      {/* QR เป็น data URL จึงใช้ img ธรรมดา ไม่ผ่านตัวปรับขนาดภาพของ Next */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={qr}
                        alt="QR code สำหรับลงทะเบียน"
                        className="mx-auto mt-4 h-48 w-48"
                      />
                    </>
                  )}
                </section>
              )}
            </article>
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

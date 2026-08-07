import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { MediaBackdrop } from "@/components/ui/MediaBackdrop";

/**
 * แบนเนอร์หัวหน้าเพจ — ใช้รูปแบบเดียวกับแบนเนอร์หน้าแรก
 * คือสูงเต็มจอ ภาพเต็มขอบ และเนื้อหาชิดล่างซ้าย
 */
export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumb = [],
  image,
  imageAlt = "",
  gradient = "from-wecci-navy via-wecci-blue to-wecci-aqua",
  /* เงาดำโปร่งไล่จากซ้าย ไม่ย้อมสีรูป แค่พอให้ตัวอักษรขาวอ่านออก */
  overlay = "bg-gradient-to-r from-black/60 via-black/25 to-transparent",
  zoom = true,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumb?: { label: string; href: string }[];
  /** ภาพหัวหน้าเพจ วางไฟล์ที่ public/images/page/ */
  image?: string;
  imageAlt?: string;
  gradient?: string;
  /** ชั้นสีทับภาพ ปรับได้ตามความสว่างของภาพแต่ละหน้า */
  overlay?: string;
  /** ซูมภาพเข้าช้า ๆ ตอนเปิดหน้า ปิดได้เมื่ออยากให้ภาพนิ่ง */
  zoom?: boolean;
}) {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden text-white">
      <MediaBackdrop
        src={image}
        alt={imageAlt}
        gradient={gradient}
        overlay={overlay}
        priority
        zoom={zoom}
      />

      <Container className="relative z-10 pb-16 pt-40 sm:pb-20">
        <nav aria-label="เส้นทางนำทาง" className="mb-5 text-xs text-slate-200">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-white">
                หน้าแรก
              </Link>
            </li>
            {breadcrumb.map((crumb) => (
              <li key={crumb.href} className="flex items-center gap-2">
                <span aria-hidden>/</span>
                <Link href={crumb.href} className="hover:text-white">
                  {crumb.label}
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        <div className="wecci-fade-up max-w-4xl 2xl:max-w-5xl">
          {eyebrow && (
            <p className="mb-4 inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold backdrop-blur-sm sm:text-sm">
              {eyebrow}
            </p>
          )}
          <h1 className="text-3xl font-bold leading-snug tracking-tight drop-shadow-sm sm:text-4xl lg:text-5xl lg:leading-tight 2xl:text-6xl">
            {title}
          </h1>
          {description && (
            <p className="mt-5 max-w-3xl text-base text-slate-100 sm:text-lg 2xl:text-xl">
              {description}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}

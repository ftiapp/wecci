import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { HeroPanel } from "@/components/ui/HeroPanel";
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
  focus,
  gradient = "from-wecci-navy via-wecci-blue to-wecci-aqua",
  /* ข้อความมีแถบสีรองของตัวเองแล้ว ตรงนี้จึงเหลือแค่เงาบาง ๆ ไม่ย้อมสีรูป */
  overlay = "bg-gradient-to-t from-black/30 via-transparent to-transparent",
  zoom = true,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  /** ไม่ใส่ href = แสดงเป็นข้อความเฉย ๆ ใช้กับหมวดที่ไม่มีหน้ารวมของตัวเอง */
  breadcrumb?: { label: string; href?: string }[];
  /** ภาพหัวหน้าเพจ วางไฟล์ที่ public/images/page/ */
  image?: string;
  imageAlt?: string;
  /** จุดโฟกัสของภาพแบบ object-position เช่น "68% 45%" ใส่เมื่อประธานของภาพไม่ได้อยู่กลาง */
  focus?: string;
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
        preload
        zoom={zoom}
        focus={focus}
        /*
          ต้องเป็นค่าที่มีใน images.qualities ไม่งั้น Next 16 จะปัดให้เงียบ ๆ
          (เดิมส่ง 82 แล้วโดนปัดขึ้นเป็น 88) แบนเนอร์เต็มจอโดน ken burns ซูมเข้าด้วย
          จึงใช้ 85 ไม่ลดลงไปถึง 75 เพราะจะเห็นรอยบีบอัดบนพื้นเรียบ ๆ อย่างท้องฟ้า
        */
        quality={85}
      />

      <Container className="relative z-10 pb-12 pt-32 sm:pb-20 sm:pt-40">
        <HeroPanel className="max-w-4xl 2xl:max-w-5xl">
        <nav aria-label="เส้นทางนำทาง" className="mb-5 text-xs text-slate-200">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-white">
                หน้าแรก
              </Link>
            </li>
            {breadcrumb.map((crumb) => (
              <li key={crumb.label} className="flex items-center gap-2">
                <span aria-hidden>/</span>
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-white">
                    {crumb.label}
                  </Link>
                ) : (
                  <span>{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="wecci-fade-up">
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
        </HeroPanel>
      </Container>
    </section>
  );
}

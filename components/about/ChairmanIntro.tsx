import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

type Chairman = {
  name: string;
  position: string;
  term: string;
  /** ภาพประธานสถาบันฯ เต็มตัว วางที่ public/images/about/ */
  photo?: string;
};

/**
 * หัวเรื่องส่วนบทบาท — ประธานสถาบันฯ ยืนอยู่ฝั่งซ้าย หัวข้อและโลโก้อยู่ฝั่งขวา
 * วางแบบเดียวกับหน้า "สารจากผู้บริหาร" ของเว็บองค์กร คือรูปคนนำสายตาเข้าหาข้อความ
 */
export function ChairmanIntro({
  chairman,
  eyebrow,
  title,
  subtitle,
  caption,
  children,
}: {
  chairman: Chairman;
  eyebrow: string;
  title: string;
  subtitle: string;
  /** ชื่อสถาบันที่แสดงคู่กับโลโก้ */
  caption: string;
  /** เนื้อหาเสริมใต้หัวเรื่อง เช่น การ์ดเป้าหมาย */
  children?: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="grid items-center gap-8 lg:grid-cols-[30rem_minmax(0,1fr)] lg:gap-10 2xl:grid-cols-[36rem_minmax(0,1fr)]">
      {chairman.photo && (
        <Reveal className="order-2 lg:order-1">
          {/* จำกัดความสูงไม่ให้ตัวคนล้นออกนอกหน้าจอ — กันไว้ราว 15rem สำหรับเฮดเดอร์ ชื่อใต้รูป และระยะขอบ */}
          <figure className="relative mx-auto flex w-60 flex-col items-center sm:w-72 lg:h-[calc(100svh-11rem)] lg:w-full lg:justify-end">
            {/* วงแสงหลังตัว ดันให้ภาพเด่นขึ้นมาจากพื้น */}
            <span
              className="pointer-events-none absolute inset-x-0 bottom-10 mx-auto aspect-square w-[88%] rounded-full bg-gradient-to-br from-wecci-aqua/25 to-wecci-mint/20 blur-2xl"
              aria-hidden
            />

            {/* เส้นโค้งสีเขียวลากผ่านด้านหลังตัว — ล้นออกนอกกรอบรูปทั้งซ้ายและขวา */}
            <svg
              viewBox="0 0 400 520"
              className="pointer-events-none absolute -inset-x-[22%] -top-6 bottom-0 h-full w-[144%]"
              fill="none"
              aria-hidden
            >
              <path
                d="M-20 300 C 80 300, 150 250, 200 170 C 250 90, 300 40, 400 60"
                stroke="var(--wecci-mint)"
                strokeWidth={3}
                strokeLinecap="round"
              />
              <path
                d="M-20 380 C 120 380, 210 320, 260 220"
                stroke="var(--wecci-aqua)"
                strokeWidth={2}
                strokeLinecap="round"
                opacity={0.5}
              />
            </svg>

            <Image
              src={chairman.photo}
              alt={chairman.name}
              width={991}
              height={1923}
              // เผื่อจอ retina — ขอไฟล์กว้างกว่าพื้นที่แสดงผลจริงราวสองเท่า ภาพจึงคม
              sizes="(min-width: 1024px) 60rem, 30rem"
              // ต้องเป็นค่าที่มีใน images.qualities ไม่งั้นโดนปัดให้เงียบ ๆ (เดิมส่ง 90 โดนปัดเป็น 100)
              quality={85}
              // ไฟล์นี้ไดคัตพื้นหลังมาแล้ว จึงไม่ต้องใช้ mask ไล่จางขอบอีก
              className="relative h-auto w-full min-h-0 object-contain drop-shadow-xl lg:h-full lg:w-auto"
            />

            <figcaption className="relative mt-4 text-center">
              <p className="text-lg font-bold text-wecci-navy">{chairman.name}</p>
              <p className="mt-1 text-xs text-slate-500">{chairman.position}</p>
            </figcaption>
          </figure>
        </Reveal>
      )}

      <Reveal delay={120} className="order-1 lg:order-2">
        {/* ชิดขอบขวาของจอ ตัวใหญ่ อ่านจบได้ในสายตาเดียว */}
        <div className="text-center lg:ml-auto lg:max-w-2xl lg:text-right">
          <p className="text-base font-bold tracking-wide text-wecci-blue sm:text-lg">{eyebrow}</p>

          <h2 className="mt-3 text-4xl font-bold leading-snug text-wecci-navy sm:text-5xl 2xl:text-6xl 2xl:leading-tight">
            {title}
          </h2>

          <span className="mx-auto mt-5 flex w-fit gap-1.5 lg:mr-0 lg:ml-auto" aria-hidden>
            <span className="block h-1 w-10 rounded-full bg-wecci-blue" />
            <span className="block h-1 w-5 rounded-full bg-wecci-aqua" />
          </span>

          <p className="mt-6 text-lg text-slate-600 sm:text-xl">{subtitle}</p>

          {/* โลโก้สถาบันคู่กับชื่อเต็ม */}
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-end">
            <Image
              src="/images/brand/fti-wecci-light.png"
              alt={caption}
              width={340}
              height={175}
              className="h-12 w-auto object-contain sm:h-14"
            />
            <span className="hidden h-10 w-px bg-slate-300 sm:block" aria-hidden />
            <p className="text-sm font-bold text-wecci-navy">{caption}</p>
          </div>

          {children}
        </div>
      </Reveal>
      </div>

      {/*
        ปุ่มลงไปยังส่วนบทบาท — วางกลางขอบล่างของหน้า ตำแหน่งที่สายตาไปหยุดพอดี
        เป็นลิงก์ anchor ธรรมดา จึงทำงานแม้ JavaScript ไม่ทำงาน
      */}
      <div className="mt-10 flex justify-center lg:absolute lg:inset-x-0 lg:-bottom-2 lg:mt-0">
        <a
          href="#roles"
          className="wecci-nudge group inline-flex flex-col items-center gap-2 text-wecci-navy transition hover:text-wecci-blue"
        >
          <span className="text-base font-bold sm:text-lg">ดูบทบาททั้ง 3 ด้าน</span>
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M12 5v14" />
            <path d="m6 13 6 6 6-6" />
          </svg>
        </a>
      </div>
    </div>
  );
}

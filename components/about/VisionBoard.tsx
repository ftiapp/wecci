import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

type PillarIcon = "drop" | "leaf" | "globe" | "co2";

type Pillar = { id: string; label: string; icon: PillarIcon };

/** สีประจำเสาหลักแต่ละด้าน ให้แยกออกจากกันได้ตั้งแต่ตาแรก */
const tones: Record<PillarIcon, string> = {
  drop: "bg-wecci-aqua/15 text-wecci-aqua ring-wecci-aqua/30",
  leaf: "bg-wecci-mint/15 text-wecci-mint ring-wecci-mint/30",
  globe: "bg-wecci-blue/15 text-wecci-blue ring-wecci-blue/30",
  co2: "bg-wecci-teal/15 text-wecci-teal ring-wecci-teal/30",
};

/** ไอคอนเส้นของแต่ละเสาหลัก วาดเองทั้งหมด */
function PillarIcon({ icon }: { icon: PillarIcon }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {icon === "drop" && <path d="M12 3s6 6.4 6 10.5a6 6 0 0 1-12 0C6 9.4 12 3 12 3Z" />}

      {icon === "leaf" && (
        <>
          <path d="M20 5c0 7-4 11-9 11-2.8 0-5-1.6-5-4 0-4.5 5.5-7 14-7Z" />
          <path d="M6 20c1.5-4.5 4.5-8 10-11" />
        </>
      )}

      {icon === "globe" && (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3c2.5 2.6 3.8 5.7 3.8 9S14.5 18.4 12 21c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3Z" />
        </>
      )}

      {icon === "co2" && (
        <>
          <path d="M7 15h9a3.5 3.5 0 0 0 .4-7A5 5 0 0 0 7 9.5 2.8 2.8 0 0 0 7 15Z" />
          <path d="M12 18v3" />
          <path d="m9.8 19 2.2 2.2L14.2 19" />
        </>
      )}
    </svg>
  );
}

/**
 * บอร์ดวิสัยทัศน์ตามวาระ — ข้อความอยู่ซ้าย ประธานสถาบันฯ อยู่ขวา
 * วางตามเอกสารนำเสนอของสถาบันฯ คือปีวาระตัวใหญ่ เสาหลักสี่ด้าน แล้วปิดท้ายด้วยประโยคหลัก
 */
export function VisionBoard({
  period,
  lead,
  pillars,
  quote,
  chairman,
}: {
  period: { title: string; years: string };
  lead: string;
  pillars: Pillar[];
  quote: { text: string; highlight: string };
  chairman: { name: string; position: string; term: string; photo?: string };
}) {
  const [before, after] = quote.text.split(quote.highlight);

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_28rem] lg:gap-8 2xl:grid-cols-[minmax(0,1fr)_34rem]">
      <div className="text-center lg:text-left">
        <Reveal>
          {/* ใช้โลโก้แทนคำว่า WECCI ให้เป็นแบรนด์จริง ไม่ใช่ตัวอักษรพิมพ์เอา */}
          <Image
            src="/images/brand/fti-wecci-light.png"
            alt={period.title}
            width={680}
            height={350}
            sizes="320px"
            className="mx-auto h-16 w-auto object-contain sm:h-20 2xl:h-24 lg:mx-0"
          />
          {/* ปีวาระ — ไล่เฉดสีแบรนด์ในตัวอักษร แล้วมีขีดหนาใต้เลข */}
          <p className="mt-2 bg-gradient-to-r from-wecci-navy via-wecci-blue to-wecci-aqua bg-clip-text text-4xl leading-none font-bold text-transparent sm:text-5xl 2xl:text-6xl">
            {period.years}
          </p>
          <span
            className="mx-auto mt-3 block h-1.5 w-24 rounded-full bg-gradient-to-r from-wecci-aqua to-wecci-mint lg:mx-0"
            aria-hidden
          />

          <p className="mt-4 flex items-center justify-center gap-3 text-sm font-bold tracking-[0.2em] text-wecci-navy uppercase sm:text-base lg:justify-start">
            <span className="hidden h-px w-8 bg-wecci-aqua lg:block" aria-hidden />
            {lead}
          </p>
        </Reveal>

        {/* เสาหลักสี่ด้าน */}
        <ul className="mt-6 space-y-2.5">
          {pillars.map((pillar, i) => (
            <Reveal key={pillar.id} delay={80 * i} distance={16} fade>
              {/* ชี้ที่ข้อไหน ข้อนั้นขยับออกมาและไอคอนเด้งขึ้น บอกว่าเป็นรายการที่มีชีวิต */}
              {/* มีเอฟเฟกต์ตอนชี้อยู่แล้ว จึงใช้เคอร์เซอร์นิ้วมือให้สอดคล้องกัน */}
              <li className="group flex cursor-pointer items-center justify-center gap-4 rounded-2xl px-2 py-1.5 transition duration-300 hover:bg-white/60 lg:justify-start lg:hover:translate-x-1.5">
                <span
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ring-1 transition duration-300 group-hover:scale-110 ${
                    tones[pillar.icon]
                  }`}
                >
                  <PillarIcon icon={pillar.icon} />
                </span>

                <span className="text-lg font-bold text-wecci-navy sm:text-xl">
                  {pillar.label}
                  {/* เส้นใต้ที่ค่อย ๆ ลากออกตอนชี้ */}
                  <span
                    className="mt-1 block h-0.5 w-0 rounded-full bg-gradient-to-r from-wecci-aqua to-wecci-mint transition-all duration-500 group-hover:w-full"
                    aria-hidden
                  />
                </span>
              </li>
            </Reveal>
          ))}
        </ul>

        {/* ประโยคหลัก */}
        <Reveal delay={400} distance={16} fade>
          {/* ประโยคปิดท้าย — ไม่มีกรอบ ใช้ขนาดตัวอักษรกับเครื่องหมายคำพูดตัวใหญ่เป็นตัวเน้นแทน */}
          <blockquote className="relative mt-8 max-w-3xl text-left">
            <span
              className="pointer-events-none absolute -top-8 -left-3 text-[7rem] leading-none font-bold text-wecci-aqua/15 select-none sm:-top-10 sm:text-[9rem]"
              aria-hidden
            >
              “
            </span>

            <p className="relative text-xl leading-relaxed font-bold text-wecci-navy sm:text-2xl sm:leading-relaxed 2xl:text-3xl 2xl:leading-relaxed">
              {before}
              <span className="bg-gradient-to-r from-wecci-blue to-wecci-aqua bg-clip-text text-transparent">
                {quote.highlight}
              </span>
              {after}
            </p>

            <span
              className="mt-5 block h-1 w-28 rounded-full bg-gradient-to-r from-wecci-aqua to-wecci-mint"
              aria-hidden
            />
          </blockquote>
        </Reveal>
      </div>

      {/* ประธานสถาบันฯ พร้อมป้ายชื่อพาดขอบล่าง */}
      {chairman.photo && (
        <Reveal delay={200} className="relative">
          <figure className="relative mx-auto flex w-64 flex-col items-center sm:w-80 lg:h-[calc(100svh-13rem)] lg:w-full lg:justify-end">
            <span
              className="pointer-events-none absolute inset-x-0 bottom-16 mx-auto aspect-square w-[80%] rounded-full bg-gradient-to-br from-wecci-aqua/25 to-wecci-mint/20 blur-2xl"
              aria-hidden
            />

            <Image
              src={chairman.photo}
              alt={chairman.name}
              width={991}
              height={1385}
              sizes="(min-width: 1024px) 60rem, 30rem"
              // ต้องเป็นค่าที่มีใน images.qualities ไม่งั้นโดนปัดให้เงียบ ๆ (เดิมส่ง 90 โดนปัดเป็น 100)
              quality={85}
              className="relative h-auto w-full min-h-0 object-contain drop-shadow-xl lg:h-full lg:w-auto"
            />

            {/*
              ป้ายชื่อแบบกระจกฝ้า ซ้อนคาบขอบล่างของภาพเล็กน้อย
              บางกว่ากล่องทึบ จึงไม่บังตัวคนและดูเป็นชั้นเดียวกับภาพ
            */}
            <figcaption className="relative -mt-10 w-[92%] overflow-hidden rounded-xl bg-wecci-navy/85 text-white shadow-xl shadow-wecci-navy/30 backdrop-blur-sm lg:-mt-12 lg:w-[85%] lg:self-end">
              <div className="flex items-center gap-4 px-5 py-3.5">
                <span
                  className="h-10 w-1 shrink-0 rounded-full bg-gradient-to-b from-wecci-aqua to-wecci-mint"
                  aria-hidden
                />
                <div className="min-w-0 text-left">
                  <p className="truncate text-lg font-bold sm:text-xl">{chairman.name}</p>
                  <p className="mt-0.5 truncate text-xs text-slate-200">
                    {chairman.position} · {chairman.term}
                  </p>
                </div>
              </div>
            </figcaption>
          </figure>
        </Reveal>
      )}
    </div>
  );
}

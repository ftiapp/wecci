import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";

type TargetIcon = "leaf" | "co2" | "zero";

type Target = { id: string; label: string; icon: TargetIcon; image?: string };

/** สีประจำเป้าหมายแต่ละข้อ — เขียว = เศรษฐกิจสีเขียว, ฟ้า = คาร์บอน, มิ้นต์ = Net Zero */
const tones: Record<TargetIcon, string> = {
  leaf: "text-wecci-mint ring-wecci-mint/30",
  co2: "text-wecci-blue ring-wecci-blue/30",
  zero: "text-wecci-teal ring-wecci-teal/30",
};

/** ไอคอนเส้นของแต่ละเป้าหมาย วาดเองทั้งหมด ไม่พึ่งไลบรารีภายนอก */
function TargetIcon({ icon }: { icon: TargetIcon }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-16 w-16 shrink-0 sm:h-20 sm:w-20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {icon === "leaf" && (
        <>
          {/* ใบไม้บนโลก — เศรษฐกิจสีเขียว */}
          <path d="M20 5c0 7-4 11-9 11-2.8 0-5-1.6-5-4 0-4.5 5.5-7 14-7Z" />
          <path d="M6 20c1.5-4.5 4.5-8 10-11" />
        </>
      )}

      {icon === "co2" && (
        <>
          {/* ก้อนเมฆที่มีลูกศรลด — ลดคาร์บอนสู่ความเป็นกลาง */}
          <path d="M7 16h9a3.5 3.5 0 0 0 .4-7A5 5 0 0 0 7 10.5 2.8 2.8 0 0 0 7 16Z" />
          <path d="M12 19v3" />
          <path d="m9.8 20 2.2 2.2L14.2 20" />
        </>
      )}

      {icon === "zero" && (
        <>
          {/* เลขศูนย์ในเป้า — การปล่อยสุทธิเป็นศูนย์ */}
          <circle cx="12" cy="12" r="9" />
          <ellipse cx="12" cy="12" rx="3.2" ry="4.6" />
        </>
      )}
    </svg>
  );
}

/** ป้ายเป้าหมายปลายทางสามข้อ */
export function TargetPills({ targets }: { targets: Target[] }) {
  return (
    <ul className="mt-10 flex flex-wrap items-stretch justify-center gap-4 sm:gap-6 lg:justify-end">
      {targets.map((target, i) => (
        <Reveal key={target.id} delay={240 + i * 80} distance={16} fade>
          <li
            className={`flex h-full w-40 flex-col items-center gap-3 rounded-2xl bg-white px-6 py-6 text-center shadow-sm ring-1 transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:w-48 ${
              tones[target.icon]
            }`}
          >
            {target.image ? (
              <Image
                src={target.image}
                alt=""
                width={192}
                height={192}
                className="h-16 w-16 shrink-0 object-contain sm:h-20 sm:w-20"
              />
            ) : (
              <TargetIcon icon={target.icon} />
            )}
            <span className="text-sm font-bold text-wecci-navy sm:text-base">{target.label}</span>
          </li>
        </Reveal>
      ))}
    </ul>
  );
}

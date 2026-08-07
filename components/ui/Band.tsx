import Image from "next/image";
import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { WaterBackdrop } from "@/components/ui/WaterBackdrop";
import { NetworkBackdrop } from "@/components/ui/NetworkBackdrop";
import { GraphicBackdrop, type GraphicVariant } from "@/components/ui/GraphicBackdrop";
import { WindmillBackdrop, type WindmillVariant } from "@/components/ui/WindmillBackdrop";

/** สีพื้นของแบนด์ */
export type BandTone = "light" | "sky" | "mint" | "cloud" | "dark";

/** ลายกราฟิกที่วางทับสีพื้น */
export type BandPattern = GraphicVariant | "water" | "network" | "soft" | "windmill" | "none";

const background: Record<BandTone, string> = {
  light: "bg-white",
  sky: "bg-gradient-to-b from-sky-50 via-white to-cyan-50/70",
  mint: "bg-gradient-to-br from-emerald-50 via-white to-teal-50",
  cloud: "bg-gradient-to-b from-slate-50 via-indigo-50/40 to-white",
  dark: "bg-gradient-to-br from-wecci-navy via-wecci-blue to-wecci-navy text-white",
};

/**
 * แบนด์เนื้อหาหนึ่งหัวข้อ สูงเกือบเต็มจอ
 * เลือกสีพื้น (tone) กับลายกราฟิก (pattern) แยกกันได้ จึงไม่มีแบนด์ไหนซ้ำกัน
 */
export function Band({
  id,
  tone = "light",
  pattern = "none",
  divider = true,
  variant = 1,
  full = false,
  image,
  imageDim = "soft",
  children,
}: {
  id?: string;
  tone?: BandTone;
  pattern?: BandPattern;
  /** สูงเต็มจอพอดีหนึ่งหน้า ใช้กับแบนด์ที่อยากให้เลื่อนทีละหน้า */
  full?: boolean;
  /** ภาพพื้นหลังของแบนด์ — จะถูกคลุมด้วยฝ้าขาวให้ตัวอักษรยังอ่านออก */
  image?: string;
  /** ความจางของภาพพื้นหลัง — soft = เห็นชัด, faint = จางมาก */
  imageDim?: "soft" | "faint";
  /** เส้นคั่นบางที่ขอบบน ช่วยให้เห็นรอยต่อเมื่อแบนด์ติดกันมีสีใกล้เคียงกัน */
  divider?: boolean;
  /** สลับองค์ประกอบของลาย windmill ไม่ให้แบนด์ที่ต่อกันดูซ้ำ */
  variant?: WindmillVariant;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`relative flex items-center overflow-hidden ${
        // แบนด์เต็มจอไม่เว้นระยะเลย ขอบบนของแบนด์จะชนขอบบนจอพอดี ไม่เหลือหน้าก่อนหน้าโผล่
        full ? "scroll-mt-0" : "scroll-mt-32"
      } ${
        // แบนด์เต็มจอใช้ระยะขอบบน-ล่างน้อยกว่า เพื่อให้เนื้อหาใช้ความสูงจอได้เต็มที่
        full ? "min-h-[100svh] py-16 lg:py-10" : "min-h-[72svh] py-24"
      } ${background[tone]}`}
    >
      {divider && tone !== "dark" && (
        <span
          className="absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"
          aria-hidden
        />
      )}

      {image && (
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {/* พื้นหลังตกแต่งของบล็อกกลางหน้า ไม่ต้อง preload ให้ไปแย่งคิวกับแบนเนอร์ */}
          <Image src={image} alt="" fill sizes="100vw" quality={75} className="object-cover" />
          {/* ฝ้าขาว — ภาพยังเห็นเป็นบรรยากาศ แต่ตัวอักษรสีเข้มยังอ่านสบาย */}
          <div
            className={`absolute inset-0 bg-gradient-to-b ${
              imageDim === "faint"
                ? "from-white/90 via-white/85 to-white/95"
                : "from-white/70 via-white/55 to-white/80"
            }`}
          />
        </div>
      )}

      {pattern === "water" && <WaterBackdrop tone={tone === "dark" ? "dark" : "light"} />}
      {pattern === "network" && <NetworkBackdrop />}
      {pattern === "windmill" && (
        <WindmillBackdrop tone={tone === "dark" ? "dark" : "light"} variant={variant} />
      )}

      {/* โทนนุ่ม — ก้อนแสงเบลอสองจุด ไม่มีเส้นตัดกันจึงดูสะอาดตา */}
      {pattern === "soft" && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-wecci-aqua/10 blur-3xl" />
          <div className="absolute -bottom-48 -right-32 h-[32rem] w-[32rem] rounded-full bg-wecci-blue/10 blur-3xl" />
        </div>
      )}

      {pattern !== "water" &&
        pattern !== "network" &&
        pattern !== "soft" &&
        pattern !== "windmill" &&
        pattern !== "none" && <GraphicBackdrop variant={pattern} />}

      <Container className="relative w-full">{children}</Container>
    </section>
  );
}

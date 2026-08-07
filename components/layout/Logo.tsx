import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function Logo({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const isLight = tone === "light";

  return (
    <Link href="/" className="flex items-center gap-3" aria-label={siteConfig.nameTh}>
      {/* พื้นโปร่งใส/เข้ม ใช้โลโก้ฉบับสีขาว ส่วนพื้นขาวใช้ฉบับสีเต็ม */}
      <Image
        src={
          isLight
            ? "/images/brand/FTI-WECCI-Logo_RGB-White.png"
            : "/images/brand/fti-wecci-light.png"
        }
        alt={`${siteConfig.parentEn} — ${siteConfig.shortName}`}
        width={6809}
        height={3510}
        /*
          ไฟล์ต้นทางกว้าง 6809 แต่แสดงจริงแค่ราว 110px
          ถ้าไม่บอก sizes เบราว์เซอร์จะเดาว่ากว้างเท่าจอแล้วไปหยิบตัว 1920 มาใช้
          กินแบนด์วิดท์และเวลาย่อภาพฝั่งเซิร์ฟเวอร์ทุกหน้าโดยไม่ได้ความคมเพิ่มเลย
        */
        sizes="224px"
        preload
        className={`h-12 w-auto sm:h-14 ${isLight ? "drop-shadow-lg" : ""}`}
      />

    </Link>
  );
}

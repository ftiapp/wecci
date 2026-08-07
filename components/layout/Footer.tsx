import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="bg-wecci-navy text-slate-300">
      <Container className="py-8 sm:py-10">
        {/* โลโก้ฉบับสำหรับพื้นหลังสีเข้ม วางบนฟุตเตอร์ได้เลยไม่ต้องมีแผ่นรอง */}
        <Image
          src="/images/brand/fti-wecci-dark.png"
          alt={`${siteConfig.parentEn} — ${siteConfig.shortName}`}
          width={19835}
          height={3510}
          className="h-14 w-auto sm:h-16"
        />

        {/* ที่อยู่ชิดซ้าย เวลาทำการชิดขวา เริ่มบรรทัดแรกเสมอกัน */}
        <div className="mt-5 flex flex-col gap-6 text-sm sm:flex-row sm:justify-between">
          <address className="not-italic leading-relaxed">
            <p className="font-semibold text-white">{siteConfig.parentTh}</p>
            {siteConfig.addressLines.map((line) => (
              <p key={line}>{line}</p>
            ))}

            <p className="mt-4">
              โทร.{" "}
              <a
                href={`tel:${siteConfig.hotlineTel}`}
                className="text-white hover:text-wecci-aqua"
              >
                {siteConfig.hotline}
              </a>
            </p>
            <p>
              อีเมล{" "}
              <a href={`mailto:${siteConfig.email}`} className="text-white hover:text-wecci-aqua">
                {siteConfig.email}
              </a>
            </p>
          </address>

          <div className="leading-relaxed sm:text-right">
            <p className="font-semibold text-white">เวลาทำการ</p>
            {siteConfig.officeHours.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>

        {/* ไอคอนโซเชียลอยู่ใต้ที่อยู่ — ซ่อนทั้งแถบเมื่อยังไม่มีลิงก์จริง */}
        <div className={siteConfig.social.length === 0 ? "hidden" : "mt-5"}>
          <ul className="flex gap-4">
            {siteConfig.social.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="block transition hover:opacity-80"
                >
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={512}
                    height={512}
                    className="h-9 w-9"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="py-4 text-xs">
          <p>
            © {new Date().getFullYear()} {siteConfig.nameTh} — {siteConfig.parentTh}
          </p>
        </Container>
      </div>
    </footer>
  );
}

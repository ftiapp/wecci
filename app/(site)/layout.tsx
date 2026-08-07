import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ReadingProgress } from "@/components/ui/ReadingProgress";
import { BackToTop } from "@/components/ui/BackToTop";

/** โครงของเว็บสาธารณะ — เฮดเดอร์ ฟุตเตอร์ และตัวช่วยอ่านหน้า */
export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-60 focus:rounded-lg focus:bg-wecci-navy focus:px-4 focus:py-2 focus:text-white"
      >
        ข้ามไปยังเนื้อหาหลัก
      </a>
      <ReadingProgress />
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <BackToTop />
    </>
  );
}

import type { Metadata } from "next";
import { Band } from "@/components/ui/Band";
import { Container } from "@/components/ui/Container";
import { WaterBackdrop } from "@/components/ui/WaterBackdrop";
import { PageHero } from "@/components/layout/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ContactForm } from "@/components/contact/ContactForm";
import { getPageBlocks } from "@/lib/content/store";
import { siteConfig } from "@/lib/site-config";
import { toMapEmbedSrc } from "@/lib/map-embed";

export const metadata: Metadata = {
  title: "ติดต่อเรา",
  description: `ช่องทางติดต่อ${siteConfig.nameTh}`,
};

export default async function ContactPage() {
  // เนื้อหาทั้งหมดของหน้านี้แก้ได้จากหลังบ้าน /admin/pages/contact
  const blocks = await getPageBlocks("contact");
  const hero = blocks.hero ?? {};
  const form = blocks.form ?? {};
  const map = blocks.map ?? {};
  const cta = blocks.cta ?? {};

  const text = (value: unknown) => (typeof value === "string" ? value : undefined);

  // แปลงค่าที่แอดมินกรอก (พิกัด / ลิงก์ / โค้ดฝัง) ให้เป็น src ของแผนที่
  const mapSrc = await toMapEmbedSrc(text(map.mapEmbed) ?? "");

  return (
    <>
      <PageHero
        title={text(hero.title) ?? "ติดต่อเรา"}
        description={text(hero.description)}
        breadcrumb={[{ label: "ติดต่อเรา", href: "/contact" }]}
        image={text(hero.image)}
        imageAlt={text(hero.imageAlt) ?? ""}
      />

      <Band tone="sky" pattern="windmill" variant={2}>
        <div>
          <Reveal>
            <SectionHeading
              eyebrow={text(form.eyebrow)}
              title={text(form.sectionTitle) ?? "ยินดีให้คำปรึกษา"}
              description={text(form.sectionDescription)}
              align="center"
            />
          </Reveal>

          <Reveal>
            <ContactForm
              panelTitle={text(form.panelTitle) ?? siteConfig.nameTh}
              panelText={text(form.panelText) ?? ""}
              panelImage={text(form.panelImage)}
              consentText={text(form.consentText) ?? ""}
            />
          </Reveal>

          {/* แผนที่ — ตำแหน่งหมุดตั้งได้จากหลังบ้าน */}
          {map.showMap !== false && (
            <Reveal delay={120} className="mt-10">
              {mapSrc ? (
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-wecci-navy to-wecci-blue text-white">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.6}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                        >
                          <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11ZM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                        </svg>
                      </span>
                      <div>
                        <p className="font-bold text-wecci-navy">ที่ตั้งสำนักงาน</p>
                        <p className="text-xs text-slate-500">{siteConfig.addressLines[0]}</p>
                      </div>
                    </div>

                    <a
                      href={mapSrc.replace("&output=embed", "")}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-slate-300 px-4 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-wecci-blue hover:text-wecci-blue"
                    >
                      เปิดใน Google Maps ↗
                    </a>
                  </div>

                  <iframe
                    src={mapSrc}
                    title="ตำแหน่งที่ตั้งสำนักงาน"
                    className="h-96 w-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="flex min-h-80 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-300 bg-white/60 text-slate-400">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <path d="m9 4 6 2 6-2v14l-6 2-6-2-6 2V6l6-2Zm0 0v14m6-12v14" />
                  </svg>
                  <span className="text-sm">ยังไม่ได้ปักหมุด — ตั้งค่าได้ที่หลังบ้าน</span>
                </div>
              )}
            </Reveal>
          )}
        </div>
      </Band>

      {/* คำโปรยชวนร่วมงาน — แบนด์สีเข้มปิดท้ายหน้า */}
      <section className="relative overflow-hidden bg-gradient-to-br from-wecci-navy via-wecci-blue to-wecci-navy py-20 text-white sm:py-24">
        <WaterBackdrop tone="dark" animated={false} />
        <div
          className="wecci-float pointer-events-none absolute -right-16 top-6 h-72 w-72 rounded-full bg-wecci-aqua/25 blur-3xl"
          aria-hidden
        />

        <Container className="relative text-center">
          <Reveal>
            <p className="text-sm font-bold tracking-wide text-wecci-aqua">
              {text(cta.eyebrow) ?? "ร่วมงานกับเรา"}
            </p>
            <span className="mx-auto mt-3 flex w-fit gap-1.5" aria-hidden>
              <span className="block h-1 w-10 rounded-full bg-white" />
              <span className="block h-1 w-5 rounded-full bg-wecci-aqua" />
            </span>
          </Reveal>

          <Reveal delay={100}>
            <h2 className="mx-auto mt-6 max-w-4xl text-2xl font-bold leading-relaxed sm:text-3xl sm:leading-relaxed">
              {text(cta.title)}
            </h2>
          </Reveal>

          <Reveal delay={200}>
            <p className="mx-auto mt-5 max-w-3xl leading-loose text-slate-200">
              {text(cta.description)}
            </p>
          </Reveal>
        </Container>
      </section>
    </>
  );
}

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ServiceCard } from "@/components/services/ServiceCard";
import { serviceGroups } from "@/lib/data/services";

/** เทียบเคียงส่วน "กลุ่มธุรกิจ" ของเว็บต้นแบบ */
export function ServiceGrid() {
  return (
    <section className="py-16 sm:py-24">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="บริการของสถาบัน"
            title="ครอบคลุมทุกมิติของการจัดการน้ำและสิ่งแวดล้อม"
            description="ตั้งแต่การประเมินสถานะปัจจุบัน การออกแบบระบบ การตรวจวิเคราะห์ ไปจนถึงการพัฒนาบุคลากรและการรายงานผลตามมาตรฐานสากล"
            align="center"
          />
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:gap-8">
          {serviceGroups.map((service, i) => (
            <Reveal key={service.id} delay={80 * i}>
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

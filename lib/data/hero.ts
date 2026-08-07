export type HeroSlide = {
  id: string;
  /** ป้ายเล็กเหนือหัวข้อ เว้นว่างไว้ถ้าไม่ต้องการให้แสดง */
  eyebrow?: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  /** Tailwind gradient ที่ใช้เมื่อยังไม่มีภาพ และใช้เป็นสีรองพื้นใต้ภาพ */
  gradient: string;
  /** ภาพพื้นหลัง วางไฟล์ไว้ที่ public/ แล้วใส่พาธเป็น "/xxx.png" */
  image?: string;
  imageAlt?: string;
  /** ชั้นสีทับภาพ ปรับแยกรายสไลด์เพราะแต่ละภาพสว่างไม่เท่ากัน */
  overlay?: string;
};

export const heroSlides: HeroSlide[] = [
  {
    id: "water-footprint",
    title: "ประเมินรอยเท้าน้ำและคาร์บอน ยกระดับองค์กรสู่มาตรฐานสากล",
    description:
      "รองรับการรายงาน ESG การค้าระหว่างประเทศ และเป้าหมายความเป็นกลางทางคาร์บอนขององค์กรคุณ",
    ctaLabel: "ปรึกษาผู้เชี่ยวชาญ",
    ctaHref: "/contact",
    gradient: "from-wecci-navy via-wecci-teal to-wecci-aqua",
    image: "/images/hero/sprout-v2.webp",
    imageAlt: "ต้นกล้าเขียวงอกจากหยดน้ำ สื่อถึงการใช้ทรัพยากรน้ำอย่างยั่งยืน",
  },
  {
    id: "service",
    title: "ที่ปรึกษา ตรวจวิเคราะห์ และพัฒนาระบบจัดการน้ำสำหรับโรงงาน",
    description:
      "ทีมผู้เชี่ยวชาญและห้องปฏิบัติการมาตรฐาน พร้อมสนับสนุนผู้ประกอบการตั้งแต่การประเมิน ออกแบบ ไปจนถึงการรับรองผล",
    ctaLabel: "ดูบริการทั้งหมด",
    ctaHref: "/services",
    gradient: "from-wecci-navy via-wecci-blue to-wecci-teal",
    image: "/images/hero/turbines-v2.webp",
    imageAlt: "กังหันลมเรียงรายบนเนินหญ้า สื่อถึงพลังงานสะอาดและการพัฒนาที่ยั่งยืน",
  },
  {
    id: "vision",
    title: "มุ่งสู่การเป็นสถาบันหลักด้านการบริหารจัดการน้ำของภาคอุตสาหกรรมไทย",
    description:
      "เชื่อมโยงภาครัฐ ภาคอุตสาหกรรม และชุมชน ด้วยองค์ความรู้ เทคโนโลยี และข้อมูล เพื่อการใช้น้ำอย่างรู้คุณค่าและยั่งยืน",
    ctaLabel: "รู้จักสถาบันฯ",
    ctaHref: "/about",
    gradient: "from-wecci-navy via-wecci-teal to-wecci-aqua",
    image: "/images/hero/pipeline-v2.webp",
    imageAlt: "ท่อส่งน้ำขนาดใหญ่ทอดผ่านพื้นที่สีเขียว สื่อถึงโครงสร้างพื้นฐานการจัดการน้ำของภาคอุตสาหกรรม",
  },
];

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
    image: "/images/hero/globe.webp",
    imageAlt: "ต้นไม้บนลูกโลกและกังหันลม สื่อถึงสิ่งแวดล้อมและสภาพภูมิอากาศ",
    overlay: "bg-gradient-to-r from-wecci-navy/85 via-wecci-teal/45 to-transparent",
  },
  {
    id: "service",
    title: "ที่ปรึกษา ตรวจวิเคราะห์ และพัฒนาระบบจัดการน้ำสำหรับโรงงาน",
    description:
      "ทีมผู้เชี่ยวชาญและห้องปฏิบัติการมาตรฐาน พร้อมสนับสนุนผู้ประกอบการตั้งแต่การประเมิน ออกแบบ ไปจนถึงการรับรองผล",
    ctaLabel: "ดูบริการทั้งหมด",
    ctaHref: "/services",
    gradient: "from-wecci-navy via-wecci-blue to-wecci-teal",
    image: "/images/hero/consult.webp",
    imageAlt: "เจ้าหน้าที่ให้คำปรึกษาแก่ผู้ประกอบการ",
    overlay: "bg-gradient-to-r from-black/75 via-black/40 to-transparent",
  },
  {
    id: "vision",
    title: "มุ่งสู่การเป็นสถาบันหลักด้านการบริหารจัดการน้ำของภาคอุตสาหกรรมไทย",
    description:
      "เชื่อมโยงภาครัฐ ภาคอุตสาหกรรม และชุมชน ด้วยองค์ความรู้ เทคโนโลยี และข้อมูล เพื่อการใช้น้ำอย่างรู้คุณค่าและยั่งยืน",
    ctaLabel: "รู้จักสถาบันฯ",
    ctaHref: "/about",
    gradient: "from-wecci-navy via-wecci-teal to-wecci-aqua",
    image: "/images/hero/water-globe.webp",
    imageAlt: "ลูกโลกแก้วบนพื้นมอสส์เปียกน้ำ สื่อถึงการดูแลทรัพยากรน้ำของโลก",
    // ภาพสว่างและตัวแบบอยู่ครึ่งซ้าย ต้องใช้เงาเข้มกว่าปกติ
    overlay: "bg-gradient-to-r from-wecci-navy/85 via-wecci-navy/50 to-transparent",
  },
];

export type NavChild = {
  label: string;
  href: string;
  description?: string;
};

export type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
  /** ภาพประกอบในเมกะเมนู วางไฟล์ที่ public/images/menu/ (อัตราส่วน 16:10) */
  featureImage?: string;
  /** ไล่เฉดสีที่ใช้เมื่อยังไม่มี featureImage */
  featureGradient?: string;
  featureCaption?: string;
};

export const siteConfig = {
  nameTh: "สถาบันน้ำ สิ่งแวดล้อม และ Climate Change",
  nameEn: "Water and Environment Institute for Sustainability",
  shortName: "WECCI",
  parentTh: "สภาอุตสาหกรรมแห่งประเทศไทย",
  parentEn: "The Federation of Thai Industries",
  tagline: "ขับเคลื่อนการบริหารจัดการน้ำและสิ่งแวดล้อมของภาคอุตสาหกรรมไทยสู่ความยั่งยืน",
  hotline: "02 345 1261-6",
  /** เลขสำหรับลิงก์ tel: — ตัดช่วงเลขต่อ (-6) ออก เพราะโทรออกตรงไม่ได้ */
  hotlineTel: "023451261",
  email: "wecci@fti.or.th",
  /** ที่อยู่แบบแยกบรรทัด ใช้ตามที่เว็บเดิมจัดรูปแบบไว้ */
  addressLines: [
    "ชั้น 8 อาคารปฏิบัติการเทคโนโลยีเชิงสร้างสรรค์",
    "เลขที่ 2 ถนนนางลิ้นจี่ แขวงทุ่งมหาเมฆ",
    "เขตสาทร กรุงเทพมหานคร 10120",
  ],
  /** ที่อยู่บรรทัดเดียว สำหรับ metadata หรือที่ที่ขึ้นบรรทัดไม่ได้ */
  address:
    "ชั้น 8 อาคารปฏิบัติการเทคโนโลยีเชิงสร้างสรรค์ เลขที่ 2 ถนนนางลิ้นจี่ แขวงทุ่งมหาเมฆ เขตสาทร กรุงเทพมหานคร 10120",
  officeHours: [
    "จันทร์-ศุกร์: 08:30 - 17:30 น.",
    "เสาร์-อาทิตย์ และวันหยุดนักขัตฤกษ์: ปิดทำการ",
  ],
  /**
   * ลิงก์โซเชียลของสถาบัน — ว่างไว้จนกว่าจะได้ URL จริง
   * (ของเดิมชี้ไปหน้าแรกของ facebook.com / youtube.com ซึ่งไม่ใช่เพจสถาบัน)
   * ใส่ในรูปแบบ { label, href, icon } แล้วฟุตเตอร์จะแสดงให้เอง
   */
  social: [] as { label: string; href: string; icon: string }[],
} as const;

/**
 * หน้าย่อยของ "เกี่ยวกับเรา" — แต่ละหัวข้อเป็นหน้าแยกของตัวเอง
 * ใช้ร่วมกันทั้งเมกะเมนู เมนูข้างในหน้า และฟุตเตอร์
 */
export const aboutSections = [
  { id: "institute", label: "เกี่ยวกับสถาบัน", description: "จุดเริ่มต้นและบทบาทของสถาบันฯ" },
  { id: "vision", label: "วิสัยทัศน์และพันธกิจ", description: "ทิศทางการดำเนินงานขององค์กร" },
  { id: "strategy", label: "กลยุทธ์", description: "กลยุทธ์และแผนการดำเนินงาน" },
  {
    id: "executives",
    label: "โครงสร้างผู้บริหาร",
    description: "คณะผู้บริหารของสถาบันฯ",
  },
  { id: "staff", label: "โครงสร้างบุคลากร", description: "ทีมงานประจำสถาบัน" },
] as const;

/** หน้าย่อยของ "บริการของเรา" — แต่ละบริการเป็นหน้าแยกของตัวเอง */
export const serviceSections = [
  {
    id: "training",
    label: "อบรม/สัมมนา",
    description: "หลักสูตรอบรมและสัมมนาสำหรับภาคอุตสาหกรรม",
  },
  {
    id: "cfo-cfp",
    label: "ที่ปรึกษา CFO/CFP",
    description: "ที่ปรึกษาคาร์บอนฟุตพริ้นท์องค์กรและผลิตภัณฑ์",
  },
  {
    id: "water-footprint",
    label: "Water Footprint",
    description: "ประเมินการใช้น้ำตลอดวงจรผลิตภัณฑ์",
  },
  {
    id: "eco-factory",
    label: "รับรองมาตรฐาน Eco Factory",
    description: "ตรวจประเมินและรับรองโรงงานอุตสาหกรรมเชิงนิเวศ",
  },
  {
    id: "cfp-verification",
    label: "ทวนสอบ CFP",
    description: "ทวนสอบคาร์บอนฟุตพริ้นท์ของผลิตภัณฑ์",
  },
  {
    id: "cmh-platform",
    label: "แพลตฟอร์ม CMH",
    description: "แพลตฟอร์มบริหารจัดการข้อมูลด้านสิ่งแวดล้อม",
  },
] as const;

/*
  หมายเหตุ: href ของหัวข้อที่มี children ไม่ใช่ปลายทางแล้ว หมวดพวกนี้ไม่มีหน้ารวมของตัวเอง
  กดที่หัวข้อ = กางเมนู เท่านั้น ค่านี้เหลือไว้เป็นตัวระบุว่าแผงไหนกำลังเปิดอยู่
*/
export const mainNav: NavItem[] = [
  { label: 'หน้าแรก', href: '/' },
  {
    label: 'เกี่ยวกับเรา',
    href: '/about',
    featureImage: '/images/hero/globe.webp',
    featureGradient: 'from-wecci-navy via-wecci-blue to-wecci-aqua',
    featureCaption: 'รู้จักสถาบันน้ำ สิ่งแวดล้อม และ Climate Change',
    children: aboutSections.map((section) => ({
      label: section.label,
      href: `/about/${section.id}`,
      description: section.description,
    })),
  },
  {
    label: 'บริการของเรา',
    href: '/services',
    featureGradient: 'from-wecci-blue via-wecci-aqua to-wecci-mint',
    featureCaption: 'บริการครบวงจรสำหรับภาคอุตสาหกรรม',
    children: serviceSections.map((section) => ({
      label: section.label,
      href: `/services/${section.id}`,
      description: section.description,
    })),
  },
  {
    label: 'ข่าวสาร',
    href: '/news',
    featureGradient: 'from-wecci-navy via-wecci-blue to-wecci-aqua',
    featureCaption: 'ข่าวสาร กิจกรรม และองค์ความรู้ของสถาบัน',
    children: [
      {
        label: 'ข่าวสาร/บทความ',
        href: '/news/articles',
        description: 'ข่าวประชาสัมพันธ์และบทความจากทีมวิชาการ',
      },
      {
        label: 'ปฏิทินกิจกรรม',
        href: '/news/events',
        description: 'ตารางอบรม สัมมนา ประชุม และศึกษาดูงาน',
      },
      {
        label: 'องค์ความรู้/วีดีโอ',
        href: '/news/knowledge',
        description: 'คลังความรู้ คู่มือ และวีดีโอเผยแพร่',
      },
    ],
  },
  { label: 'ติดต่อเรา', href: '/contact' },
];

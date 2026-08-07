export type ServiceGroup = {
  id: string;
  title: string;
  summary: string;
  href: string;
  /** Simple key used by ServiceIcon to pick an inline SVG. */
  icon: "drop" | "flask" | "leaf" | "chart" | "book" | "gear";
  gradient: string;
  /** บริการที่ต้องการเน้น — การ์ดจะยกเด่นขึ้นและมีป้ายกำกับ */
  featured?: boolean;
  badge?: string;
};

export const serviceGroups: ServiceGroup[] = [
  {
    id: "consulting",
    title: "ที่ปรึกษาด้านการจัดการน้ำ",
    summary: "วางแผน ออกแบบ และปรับปรุงประสิทธิภาพระบบน้ำและระบบบำบัดน้ำเสียในโรงงาน",
    href: "/services#consulting",
    icon: "gear",
    gradient: "from-wecci-blue to-wecci-aqua",
  },
  {
    id: "lab",
    title: "ตรวจวัดและวิเคราะห์คุณภาพน้ำ",
    summary: "บริการเก็บตัวอย่างและวิเคราะห์ตามมาตรฐาน พร้อมรายงานผลที่ใช้อ้างอิงทางกฎหมายได้",
    href: "/services#lab",
    icon: "flask",
    gradient: "from-wecci-aqua to-wecci-teal",
  },
  {
    id: "footprint",
    title: "Water Footprint & Carbon Footprint",
    summary: "ประเมินการใช้น้ำและการปล่อยก๊าซเรือนกระจกขององค์กรและผลิตภัณฑ์",
    href: "/services#footprint",
    icon: "leaf",
    gradient: "from-wecci-teal to-wecci-mint",
    featured: true,
    badge: "แนะนำ",
  },
  {
    id: "training",
    title: "ฝึกอบรมและพัฒนาบุคลากร",
    summary: "หลักสูตรผู้ควบคุมระบบบำบัดมลพิษน้ำ และการจัดการน้ำเชิงปฏิบัติการ",
    href: "/services#training",
    icon: "book",
    gradient: "from-wecci-navy to-wecci-blue",
  },
  {
    id: "data",
    title: "ข้อมูลและระบบเฝ้าระวังน้ำ",
    summary: "รายงานสถานการณ์น้ำ ระบบติดตามคุณภาพน้ำ และการวิเคราะห์ความเสี่ยงด้านน้ำ",
    href: "/services#data",
    icon: "chart",
    gradient: "from-wecci-navy to-wecci-aqua",
  },
  {
    id: "community",
    title: "โครงการเพื่อชุมชนและสิ่งแวดล้อม",
    summary: "ส่งเสริมการอยู่ร่วมกันระหว่างอุตสาหกรรม ชุมชน และแหล่งน้ำธรรมชาติ",
    href: "/services#community",
    icon: "drop",
    gradient: "from-wecci-mint to-wecci-aqua",
  },
];

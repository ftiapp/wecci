/**
 * นิยามว่าแต่ละหน้าประกอบด้วยบล็อกอะไร และแต่ละบล็อกมีฟิลด์อะไรให้แก้
 * หลังบ้านสร้างฟอร์มจากนิยามนี้ จึงเพิ่มหน้า/บล็อกใหม่ได้โดยไม่ต้องเขียน UI เพิ่ม
 */

export type FieldType = "text" | "textarea" | "image" | "switch" | "map";

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  help?: string;
  placeholder?: string;
};

export type BlockDef = {
  key: string;
  label: string;
  description?: string;
  fields: FieldDef[];
};

export type PageDef = {
  slug: string;
  label: string;
  href: string;
  blocks: BlockDef[];
};export const pageDefs: PageDef[] = [
  {
    slug: "about",
    label: "เกี่ยวกับเรา",
    href: "/about",
    blocks: [
      {
        key: "hero",
        label: "แบนเนอร์หัวหน้า",
        description: "ส่วนบนสุดของหน้า",
        fields: [
          { name: "title", label: "หัวข้อ", type: "text" },
          { name: "description", label: "คำอธิบายใต้หัวข้อ", type: "textarea" },
          {
            name: "image",
            label: "รูปพื้นหลัง",
            type: "image",
            help: "แนะนำแนวนอน กว้างอย่างน้อย 2000px",
          },
          { name: "imageAlt", label: "คำบรรยายรูป (สำหรับผู้พิการทางสายตา)", type: "text" },
        ],
      },
    ],
  },
  {
    slug: "about-institute",
    label: "— เกี่ยวกับสถาบัน",
    href: "/about/institute",
    blocks: [
      {
        key: "hero",
        label: "แบนเนอร์หัวหน้า",
        description: "ส่วนบนสุดของหน้า",
        fields: [
          { name: "title", label: "หัวข้อ", type: "text" },
          { name: "description", label: "คำอธิบายใต้หัวข้อ", type: "textarea" },
          {
            name: "image",
            label: "รูปพื้นหลัง",
            type: "image",
            help: "แนะนำแนวนอน กว้างอย่างน้อย 2000px",
          },
          { name: "imageAlt", label: "คำบรรยายรูป (สำหรับผู้พิการทางสายตา)", type: "text" },
        ],
      },
      {
        key: "section",
        label: "หัวข้อเนื้อหา",
        description: "หัวข้อและคำอธิบายของเซกชันเนื้อหา",
        fields: [
          { name: "eyebrow", label: "ป้ายเล็กเหนือหัวข้อ", type: "text" },
          { name: "title", label: "หัวข้อเซกชัน", type: "text" },
          { name: "description", label: "คำอธิบายเซกชัน", type: "textarea" },
        ],
      },
    ],
  },
  {
    slug: "about-vision",
    label: "— วิสัยทัศน์และพันธกิจ",
    href: "/about/vision",
    blocks: [
      {
        key: "hero",
        label: "แบนเนอร์หัวหน้า",
        description: "ส่วนบนสุดของหน้า",
        fields: [
          { name: "title", label: "หัวข้อ", type: "text" },
          { name: "description", label: "คำอธิบายใต้หัวข้อ", type: "textarea" },
          {
            name: "image",
            label: "รูปพื้นหลัง",
            type: "image",
            help: "แนะนำแนวนอน กว้างอย่างน้อย 2000px",
          },
          { name: "imageAlt", label: "คำบรรยายรูป (สำหรับผู้พิการทางสายตา)", type: "text" },
        ],
      },
      {
        key: "section",
        label: "หัวข้อเนื้อหา",
        description: "หัวข้อและคำอธิบายของเซกชันเนื้อหา",
        fields: [
          { name: "eyebrow", label: "ป้ายเล็กเหนือหัวข้อ", type: "text" },
          { name: "title", label: "หัวข้อเซกชัน", type: "text" },
          { name: "description", label: "คำอธิบายเซกชัน", type: "textarea" },
        ],
      },
    ],
  },
  {
    slug: "about-strategy",
    label: "— กลยุทธ์",
    href: "/about/strategy",
    blocks: [
      {
        key: "hero",
        label: "แบนเนอร์หัวหน้า",
        description: "ส่วนบนสุดของหน้า",
        fields: [
          { name: "title", label: "หัวข้อ", type: "text" },
          { name: "description", label: "คำอธิบายใต้หัวข้อ", type: "textarea" },
          {
            name: "image",
            label: "รูปพื้นหลัง",
            type: "image",
            help: "แนะนำแนวนอน กว้างอย่างน้อย 2000px",
          },
          { name: "imageAlt", label: "คำบรรยายรูป (สำหรับผู้พิการทางสายตา)", type: "text" },
        ],
      },
      {
        key: "section",
        label: "หัวข้อเนื้อหา",
        description: "หัวข้อและคำอธิบายของเซกชันเนื้อหา",
        fields: [
          { name: "eyebrow", label: "ป้ายเล็กเหนือหัวข้อ", type: "text" },
          { name: "title", label: "หัวข้อเซกชัน", type: "text" },
          { name: "description", label: "คำอธิบายเซกชัน", type: "textarea" },
        ],
      },
    ],
  },
  {
    slug: "about-executives",
    label: "— โครงสร้างผู้บริหาร",
    href: "/about/executives",
    blocks: [
      {
        key: "hero",
        label: "แบนเนอร์หัวหน้า",
        description: "ส่วนบนสุดของหน้า",
        fields: [
          { name: "title", label: "หัวข้อ", type: "text" },
          { name: "description", label: "คำอธิบายใต้หัวข้อ", type: "textarea" },
          {
            name: "image",
            label: "รูปพื้นหลัง",
            type: "image",
            help: "แนะนำแนวนอน กว้างอย่างน้อย 2000px",
          },
          { name: "imageAlt", label: "คำบรรยายรูป (สำหรับผู้พิการทางสายตา)", type: "text" },
        ],
      },
      {
        key: "section",
        label: "หัวข้อเนื้อหา",
        description: "หัวข้อและคำอธิบายของเซกชันเนื้อหา",
        fields: [
          { name: "eyebrow", label: "ป้ายเล็กเหนือหัวข้อ", type: "text" },
          { name: "title", label: "หัวข้อเซกชัน", type: "text" },
          { name: "description", label: "คำอธิบายเซกชัน", type: "textarea" },
        ],
      },
    ],
  },
  {
    slug: "services",
    label: "บริการของเรา",
    href: "/services",
    blocks: [
      {
        key: "hero",
        label: "แบนเนอร์หัวหน้า",
        description: "ส่วนบนสุดของหน้า",
        fields: [
          { name: "title", label: "หัวข้อ", type: "text" },
          { name: "description", label: "คำอธิบายใต้หัวข้อ", type: "textarea" },
          {
            name: "image",
            label: "รูปพื้นหลัง",
            type: "image",
            help: "แนะนำแนวนอน กว้างอย่างน้อย 2000px",
          },
          { name: "imageAlt", label: "คำบรรยายรูป (สำหรับผู้พิการทางสายตา)", type: "text" },
        ],
      },
      {
        key: "section",
        label: "หัวข้อเนื้อหา",
        description: "หัวข้อและคำอธิบายของเซกชันเนื้อหา",
        fields: [
          { name: "eyebrow", label: "ป้ายเล็กเหนือหัวข้อ", type: "text" },
          { name: "title", label: "หัวข้อเซกชัน", type: "text" },
          { name: "description", label: "คำอธิบายเซกชัน", type: "textarea" },
        ],
      },
    ],
  },
  {
    slug: "news",
    label: "ข่าวสาร",
    href: "/news",
    blocks: [
      {
        key: "hero",
        label: "แบนเนอร์หัวหน้า",
        description: "ส่วนบนสุดของหน้า",
        fields: [
          { name: "title", label: "หัวข้อ", type: "text" },
          { name: "description", label: "คำอธิบายใต้หัวข้อ", type: "textarea" },
          {
            name: "image",
            label: "รูปพื้นหลัง",
            type: "image",
            help: "แนะนำแนวนอน กว้างอย่างน้อย 2000px",
          },
          { name: "imageAlt", label: "คำบรรยายรูป (สำหรับผู้พิการทางสายตา)", type: "text" },
        ],
      },
      {
        key: "section",
        label: "หัวข้อเนื้อหา",
        description: "หัวข้อและคำอธิบายของเซกชันเนื้อหา",
        fields: [
          { name: "eyebrow", label: "ป้ายเล็กเหนือหัวข้อ", type: "text" },
          { name: "title", label: "หัวข้อเซกชัน", type: "text" },
          { name: "description", label: "คำอธิบายเซกชัน", type: "textarea" },
        ],
      },
    ],
  },
  {
    slug: "contact",
    label: "ติดต่อเรา",
    href: "/contact",
    blocks: [
      {
        key: "hero",
        label: "แบนเนอร์หัวหน้า",
        description: "ส่วนบนสุดของหน้า",
        fields: [
          { name: "title", label: "หัวข้อ", type: "text" },
          { name: "description", label: "คำอธิบายใต้หัวข้อ", type: "textarea" },
          {
            name: "image",
            label: "รูปพื้นหลัง",
            type: "image",
            help: "แนะนำแนวนอน กว้างอย่างน้อย 2000px",
          },
          { name: "imageAlt", label: "คำบรรยายรูป (สำหรับผู้พิการทางสายตา)", type: "text" },
        ],
      },
      {
        key: "form",
        label: "ส่วนฟอร์มติดต่อ",
        description: "หัวข้อของเซกชันและแผงซ้ายของฟอร์ม",
        fields: [
          { name: "eyebrow", label: "ป้ายเล็กเหนือหัวข้อ", type: "text" },
          { name: "sectionTitle", label: "หัวข้อเซกชัน", type: "text" },
          { name: "sectionDescription", label: "คำอธิบายเซกชัน", type: "textarea" },
          { name: "panelTitle", label: "หัวข้อในแผงสีน้ำเงิน", type: "text" },
          { name: "panelText", label: "ข้อความในแผงสีน้ำเงิน", type: "textarea" },
          { name: "panelImage", label: "รูปพื้นหลังของแผง", type: "image" },
          { name: "consentText", label: "ข้อความยินยอมใต้ฟอร์ม", type: "textarea" },
        ],
      },
      {
        key: "map",
        label: "แผนที่ที่ตั้ง",
        description: "คลิกบนแผนที่หรือลากหมุดเพื่อย้ายตำแหน่ง",
        fields: [
          { name: "showMap", label: "แสดงแผนที่บนหน้าเว็บ", type: "switch" },
          { name: "mapEmbed", label: "ตำแหน่งบนแผนที่", type: "map" },
        ],
      },
      {
        key: "cta",
        label: "แถบชวนร่วมงาน",
        description: "แบนด์สีน้ำเงินปิดท้ายหน้า",
        fields: [
          { name: "eyebrow", label: "ป้ายเล็ก", type: "text" },
          { name: "title", label: "พาดหัว", type: "textarea" },
          { name: "description", label: "ย่อหน้าอธิบาย", type: "textarea" },
        ],
      },
    ],
  },
];

export function getPageDef(slug: string) {
  return pageDefs.find((page) => page.slug === slug);
}

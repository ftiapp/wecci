/** บล็อกเนื้อหาของหน้ารายละเอียดกิจกรรม เก็บเป็น JSON array ในคอลัมน์ content */
export type ContentBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "link"; url: string; label: string }
  | { type: "images"; paths: string[]; caption: string }
  | { type: "table"; rows: string[][] }
  | { type: "divider" }
  | { type: "spacer"; size: "sm" | "md" | "lg" };

export type BlockType = ContentBlock["type"];

export const blockLabels: Record<BlockType, string> = {
  heading: "หัวข้อ",
  paragraph: "ข้อความ",
  link: "ลิงก์",
  images: "รูปภาพ / Carousel",
  table: "ตาราง",
  divider: "เส้นคั่น",
  spacer: "เว้นวรรค",
};

/** ไอคอนของแต่ละชนิดบล็อก (path ของ svg 24×24) */
export const blockIcons: Record<BlockType, string> = {
  heading: "M6 4v16M18 4v16M6 12h12",
  paragraph: "M4 6h16M4 12h16M4 18h10",
  link: "M9 15 15 9M8 12H6a3 3 0 0 1 0-6h2M16 12h2a3 3 0 0 1 0 6h-2",
  images: "M3 5h18v14H3zM3 15l5-5 4 4 3-3 6 6",
  table: "M3 5h18v14H3zM3 10h18M9 10v9",
  divider: "M4 12h16",
  spacer: "M12 4v16M8 8l4-4 4 4M8 16l4 4 4-4",
};

/** ลำดับที่แสดงในเมนู "เพิ่มบล็อก" — เรียงสองคอลัมน์ตามนี้ */
export const blockOrder: BlockType[] = [
  "heading",
  "paragraph",
  "link",
  "images",
  "table",
  "divider",
  "spacer",
];

/** บล็อกเปล่าของแต่ละชนิด ใช้ตอนกด "เพิ่มบล็อก" */
export function emptyBlock(type: BlockType): ContentBlock {
  switch (type) {
    case "heading":
      return { type: "heading", text: "" };
    case "paragraph":
      return { type: "paragraph", text: "" };
    case "link":
      return { type: "link", url: "", label: "" };
    case "images":
      return { type: "images", paths: [], caption: "" };
    case "table":
      return {
        type: "table",
        rows: [
          ["", ""],
          ["", ""],
        ],
      };
    case "divider":
      return { type: "divider" };
    case "spacer":
      return { type: "spacer", size: "md" };
  }
}

/**
 * แปลงค่าที่อ่านจากฐานข้อมูล (Json) ให้เป็นรายการบล็อกที่เชื่อถือได้
 * ข้อมูลที่หน้าตาไม่ตรงจะถูกทิ้ง เพื่อไม่ให้หน้าเว็บพังเพราะข้อมูลเก่า
 */
export function parseBlocks(value: unknown): ContentBlock[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((raw): ContentBlock[] => {
    if (!raw || typeof raw !== "object") return [];
    const block = raw as Record<string, unknown>;

    switch (block.type) {
      case "heading":
      case "paragraph":
        return typeof block.text === "string"
          ? [{ type: block.type, text: block.text }]
          : [];

      case "link":
        return typeof block.url === "string"
          ? [
              {
                type: "link",
                url: block.url,
                label: typeof block.label === "string" ? block.label : block.url,
              },
            ]
          : [];

      // "image" คือรูปแบบเดิมที่มีรูปเดียว แปลงขึ้นมาเป็น images อัตโนมัติ
      case "image":
      case "images": {
        const paths = Array.isArray(block.paths)
          ? block.paths.filter((path): path is string => typeof path === "string")
          : typeof block.path === "string"
            ? [block.path]
            : [];

        return paths.length > 0
          ? [
              {
                type: "images",
                paths,
                caption: typeof block.caption === "string" ? block.caption : "",
              },
            ]
          : [];
      }

      case "table": {
        if (!Array.isArray(block.rows)) return [];
        const rows = block.rows
          .filter(Array.isArray)
          .map((row) => (row as unknown[]).map((cell) => String(cell ?? "")));
        return rows.length > 0 ? [{ type: "table", rows }] : [];
      }

      case "divider":
        return [{ type: "divider" }];

      case "spacer":
        return [
          {
            type: "spacer",
            size:
              block.size === "sm" || block.size === "lg"
                ? block.size
                : "md",
          },
        ];

      default:
        return [];
    }
  });
}

/** ตัดบล็อกที่ยังว่างเปล่าทิ้งก่อนบันทึก */
export function stripEmptyBlocks(blocks: ContentBlock[]): ContentBlock[] {
  return blocks.filter((block) => {
    switch (block.type) {
      case "heading":
      case "paragraph":
        return block.text.trim() !== "";
      case "link":
        return block.url.trim() !== "";
      case "images":
        return block.paths.length > 0;
      case "table":
        return block.rows.some((row) => row.some((cell) => cell.trim() !== ""));
      case "divider":
      case "spacer":
        return true;
    }
  });
}

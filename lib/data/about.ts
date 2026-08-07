export const foundedYear = "พ.ศ. 2561";

export const vision =
  "องค์กรที่ยกระดับการบริหารจัดการน้ำและสิ่งแวดล้อมแก่ภาคอุตสาหกรรมสู่ความยั่งยืน";

/**
 * พันธกิจแบบมีหัวข้อสั้นสำหรับใช้กับแถบพับเปิด-ปิด
 * `detail` คือข้อความพันธกิจฉบับเต็ม ส่วน `title` เป็นเพียงคำสรุปสั้นเพื่อใช้เป็นหัวแถบ
 */
export const missionItems = [
  {
    title: "ESG และขีดความสามารถในการแข่งขัน",
    detail:
      "สนับสนุนการปฏิบัติตาม ESG เพิ่มขีดความสามารถในการแข่งขัน และขับเคลื่อนอุตสาหกรรมสู่ความยั่งยืน",
  },
  {
    title: "องค์ความรู้และบริการวิชาการ",
    detail: "แหล่งความรู้และบริการวิชาการ ด้านการบริหารจัดการน้ำและสิ่งแวดล้อมอุตสาหกรรม",
  },
  {
    title: "ความร่วมมือกับภาคีเครือข่าย",
    detail:
      "ส่งเสริมความร่วมมือ รัฐ เอกชน องค์กรพัฒนาเอกชนและผู้มีส่วนได้เสีย เพื่อการบริหารจัดการน้ำและสิ่งแวดล้อมอย่างยั่งยืน",
  },
];

export const missions = [
  "สนับสนุนการปฏิบัติตาม ESG เพิ่มขีดความสามารถในการแข่งขัน และขับเคลื่อนอุตสาหกรรมสู่ความยั่งยืน",
  "แหล่งความรู้และบริการวิชาการ ด้านการบริหารจัดการน้ำและสิ่งแวดล้อมอุตสาหกรรม",
  "ส่งเสริมความร่วมมือ รัฐ เอกชน องค์กรพัฒนาเอกชนและผู้มีส่วนได้เสีย เพื่อการบริหารจัดการน้ำและสิ่งแวดล้อมอย่างยั่งยืน",
];

/**
 * บทบาทหน้าที่ของสถาบันฯ ตามเอกสารนำเสนอวาระปี พ.ศ. 2569-2571
 * `emphasis` คือวลีที่ต้องการเน้นในย่อหน้า (ระบบจะไฮไลต์ให้เองเมื่อพบข้อความตรงกัน)
 */
export const roles = [
  {
    id: "strategy",
    icon: "target" as const,
    watermark: "STRATEGY",
    image: "/images/about/roles/strategy.webp",
    imageAlt: "ทีมงานหารือแนวทางขับเคลื่อนอุตสาหกรรมอย่างยั่งยืน",
    title: "บทบาทเชิงยุทธศาสตร์",
    detail:
      "สถาบันน้ำและสิ่งแวดล้อมเพื่อความยั่งยืน และสถาบันการเปลี่ยนแปลงสภาพภูมิอากาศ ภายใต้สภาอุตสาหกรรมแห่งประเทศไทย มีบทบาทเชิงยุทธศาสตร์ในการขับเคลื่อนภาคอุตสาหกรรมไทยสู่การพัฒนาอย่างยั่งยืน (Sustainable Industrial Development) โดยมุ่งเน้นการบริหารจัดการทรัพยากรน้ำ สิ่งแวดล้อม และการเปลี่ยนแปลงสภาพภูมิอากาศอย่างบูรณาการ (Integrated Approach)",
    emphasis: [
      "การขับเคลื่อนภาคอุตสาหกรรมไทยสู่การพัฒนาอย่างยั่งยืน (Sustainable Industrial Development)",
      "การบริหารจัดการทรัพยากรน้ำ สิ่งแวดล้อม และการเปลี่ยนแปลงสภาพภูมิอากาศอย่าง",
      "(Integrated Approach)",
    ],
  },
  {
    id: "target",
    icon: "check" as const,
    watermark: "TARGET",
    image: "/images/about/roles/target-v3.webp",
    imageAlt: "การดำเนินงานที่ยกระดับการแข่งขันควบคู่การอนุรักษ์สิ่งแวดล้อม",
    title: "เป้าหมายการดำเนินงาน",
    detail:
      "การดำเนินงานมีเป้าหมายเพื่อยกระดับขีดความสามารถในการแข่งขันของภาคอุตสาหกรรม ควบคู่กับการอนุรักษ์สิ่งแวดล้อม สอดคล้องกับนโยบายระดับประเทศ กฎหมายที่เกี่ยวข้อง และกรอบความร่วมมือระหว่างประเทศ เช่น Paris Agreement รวมถึงเป้าหมาย Carbon Neutrality และ Net Zero Emissions",
    emphasis: [
      "ยกระดับขีดความสามารถในการแข่งขันของภาคอุตสาหกรรม ควบคู่กับการอนุรักษ์สิ่งแวดล้อม",
      "Carbon Neutrality และ Net Zero Emissions",
    ],
  },
  {
    id: "facilitator",
    icon: "handshake" as const,
    watermark: "FACILITATOR",
    image: "/images/about/roles/facilitator-v2.webp",
    imageAlt: "ความร่วมมือระหว่างภาครัฐ ภาคอุตสาหกรรม และเครือข่าย",
    title: "กลไกกลางเชื่อมโยง",
    detail:
      "ทั้งนี้ สถาบันฯ ทำหน้าที่เป็น “กลไกกลาง (Facilitator)” ในการเชื่อมโยงองค์ความรู้ เทคโนโลยี นโยบาย และเครือข่ายความร่วมมือ เพื่อผลักดันให้เกิดการเปลี่ยนผ่านของภาคอุตสาหกรรมไทยสู่เศรษฐกิจสีเขียว (Green Economy) และเศรษฐกิจคาร์บอนต่ำ (Low Carbon Economy) อย่างเป็นรูปธรรม",
    emphasis: [
      "“กลไกกลาง (Facilitator)”",
      "เทคโนโลยี นโยบาย และเครือข่ายความร่วมมือ",
      "(Green Economy)",
      "(Low Carbon Economy)",
    ],
  },
];

/** เป้าหมายเชิงสัญลักษณ์ที่แสดงคู่กับบทบาทหน้าที่ */
export const roleTargets = [
  {
    id: "green",
    label: "Green Economy",
    icon: "leaf" as const,
    // มีรูปจริงแล้วจะใช้รูปแทนไอคอนเส้นที่วาดไว้
    image: "/images/about/targets/green.webp",
  },
  {
    id: "carbon",
    label: "Carbon Neutrality",
    icon: "co2" as const,
    image: "/images/about/targets/carbon-v3.webp",
  },
  {
    id: "netzero",
    label: "Net Zero Emissions",
    icon: "zero" as const,
    image: "/images/about/targets/netzero-v2.webp",
  },
];

/** ทิศทางการขับเคลื่อนตามวาระ 2026-2028 (ตามเอกสารนำเสนอของสถาบันฯ) */
export const visionPeriod = { title: "WECCI", years: "2026-2028" };

export const visionLead = "Driving Thai Industry toward";

export const visionPillars = [
  { id: "water", label: "Water Security", icon: "drop" as const },
  { id: "environment", label: "Environmental Sustainability", icon: "leaf" as const },
  { id: "climate", label: "Climate Resilience", icon: "globe" as const },
  { id: "netzero", label: "Net Zero Future", icon: "co2" as const },
];

/** ประโยคหลักที่ต้องการให้จำ — คำที่อยู่ใน highlight จะถูกเน้นสี */
export const visionQuote = {
  text: "WECCI จะเป็นกลไกกลางของภาคอุตสาหกรรมไทย ในการขับเคลื่อน Water • Environment • Climate Change สู่ความสามารถในการแข่งขันอย่างยั่งยืน",
  highlight: "Water • Environment • Climate Change",
};

/** ประธานสถาบันฯ ตามวาระปัจจุบัน */
export const chairman = {
  photo: "/images/about/chairman-v5.webp",
  name: "นายปรีดา วัชรเรียรสกุล",
  position: "ประธานสถาบันน้ำ สิ่งแวดล้อม และ Climate Change",
  term: "วาระปี พ.ศ. 2569 - 2571",
};

export const goals = [
  "เสริมสร้างความร่วมมือเพื่อให้เกิดความไว้วางใจ",
  "บริหารจัดการน้ำและสิ่งแวดล้อมเพื่อพัฒนาอุตสาหกรรมอย่างยั่งยืน",
  "พัฒนาการดำเนินงานสถาบันฯ ให้ก้าวหน้าอย่างยั่งยืน",
];

/**
 * แยกข้อความตามวลีที่ต้องการเน้น แล้วห่อวลีนั้นด้วยตัวหนาสีแบรนด์
 * ทำที่ฝั่งเรนเดอร์เพื่อให้ข้อมูลใน lib/data ยังเป็นข้อความล้วน แก้ง่าย
 */
export function withEmphasis(text: string, emphasis: string[]) {
  let parts: (string | { mark: string })[] = [text];

  for (const phrase of emphasis) {
    parts = parts.flatMap((part) => {
      if (typeof part !== "string" || !part.includes(phrase)) return [part];

      const [before, ...after] = part.split(phrase);
      return [before, { mark: phrase }, after.join(phrase)];
    });
  }

  return parts
    .filter((part) => part !== "")
    .map((part, i) =>
      typeof part === "string" ? (
        part
      ) : (
        <strong key={i} className="font-bold text-wecci-blue">
          {part.mark}
        </strong>
      ),
    );
}

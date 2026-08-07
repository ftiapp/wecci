import { HeroSlider } from "@/components/home/HeroSlider";

/**
 * หน้าแรก — ตอนนี้เหลือเฉพาะแบนเนอร์ ส่วนฟุตเตอร์อยู่ใน app/layout.tsx
 * เซกชันอื่น (บริการ ตัวเลขผลงาน ข่าว สถานการณ์น้ำ บทความ CTA) ถอดออกชั่วคราว
 * โค้ดยังอยู่ครบใน components/home/ นำกลับมาใส่ได้ทันที
 */
export default function HomePage() {
  return <HeroSlider />;
}

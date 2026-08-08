"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * ค่อย ๆ ปรากฏขึ้นเมื่อเลื่อนมาถึง
 * ปกติเคลื่อนไหวครั้งเดียวแล้วหยุด ไม่วิ่งซ้ำไปมาจนลายตา
 * และปิดอัตโนมัติเมื่อผู้ใช้ตั้งค่าลดการเคลื่อนไหวในระบบ
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  distance = 24,
  fade = false,
  repeat = false,
}: {
  children: ReactNode;
  /** หน่วงเป็นมิลลิวินาที ใช้ไล่ลำดับการปรากฏของรายการ */
  delay?: number;
  className?: string;
  /** ระยะที่เลื่อนขึ้นมา (px) — เพิ่มค่าถ้าอยากให้เห็นการเคลื่อนไหวชัดขึ้น */
  distance?: number;
  /** จาง ๆ เข้ามาด้วย ใช้เฉพาะจุดที่เนื้อหาไม่ใช่ข้อมูลหลักของหน้า */
  fade?: boolean;
  /**
   * เล่นใหม่ทุกครั้งที่เลื่อนออกแล้วกลับเข้ามา ทั้งขาลงและขาขึ้น
   *
   * ค่าตั้งต้นปิดไว้เพราะหน้าที่มีเนื้อหายาว ๆ จะขยับตลอดเวลาจนอ่านยาก
   * เปิดเฉพาะหน้าที่เป็นแกลเลอรีรูปซึ่งการขยับช่วยให้ดูมีชีวิต
   */
  repeat?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          /* โหมดเล่นครั้งเดียว: เลิกเฝ้าทันทีที่โผล่ครบ จะได้ไม่กินแรงต่อ */
          if (!repeat) observer.disconnect();
        } else if (repeat) {
          /* หลุดออกนอกจอแล้วรีเซ็ตกลับไปตั้งต้น รอบหน้าที่เลื่อนกลับมาจะได้เล่นใหม่ */
          setShown(false);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [repeat]);

  return (
    <div
      ref={ref}
      // ขยับด้วย transform อย่างเดียว ไม่แตะ opacity เพราะถ้า JavaScript ยังไม่ทำงาน
      // (หรือพัง) เนื้อหาจะยังอ่านได้ตามปกติ ไม่กลายเป็นหน้าว่าง
      style={{
        transform: shown ? "translateY(0) scale(1)" : `translateY(${distance}px) scale(0.97)`,
        // ไม่ตั้ง opacity เริ่มต้นถ้าไม่ได้เปิด fade เพื่อกันหน้าว่างเมื่อ JavaScript ไม่ทำงาน
        opacity: fade && !shown ? 0 : 1,
        transition: `transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, opacity 0.7s ease ${delay}ms`,
        willChange: shown ? "auto" : "transform",
      }}
      className={className}
    >
      {children}
    </div>
  );
}

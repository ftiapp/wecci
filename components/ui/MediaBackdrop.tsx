import Image from "next/image";

/**
 * พื้นหลังของบล็อกที่ต้องมีภาพ
 * ถ้ายังไม่ได้ใส่ `src` จะ fallback เป็นไล่เฉดสีให้อัตโนมัติ
 * ตัวหุ้มต้องมี class `relative` เสมอ
 */
export function MediaBackdrop({
  src,
  alt = "",
  gradient,
  overlay = "bg-wecci-navy/55",
  preload = false,
  sizes = "100vw",
  zoom = false,
  quality,
  loading,
  focus,
}: {
  src?: string;
  alt?: string;
  gradient: string;
  /** ชั้นสีทับภาพเพื่อให้ตัวอักษรอ่านออก — ส่ง "" เพื่อปิด */
  overlay?: string;
  /** ใส่ <link rel=preload> ให้ภาพนี้ ใช้กับภาพที่เป็น LCP เท่านั้น (แทน priority ที่ Next 16 เลิกใช้) */
  preload?: boolean;
  sizes?: string;
  /** ซูมเข้าอย่างช้า ๆ ตอนเปิดหน้า เหมาะกับแบนเนอร์ใหญ่ */
  zoom?: boolean;
  /** ต้องเป็นค่าที่ประกาศไว้ใน images.qualities ของ next.config */
  quality?: number;
  /** "eager" สำหรับภาพที่ยังไม่ได้แสดงแต่ต้องพร้อมใช้ทันทีเมื่อสลับ */
  loading?: "eager" | "lazy";
  /**
   * จุดของภาพที่ต้องไม่โดนครอบทิ้ง เขียนแบบ CSS object-position เช่น "68% 45%"
   *
   * ภาพแบนเนอร์เป็นแนวนอน 16:9 แต่กรอบบนมือถือสูงราว 9:19 ภาพจึงถูกครอบ
   * ด้านข้างทิ้งไปเกือบ 70% เหลือแค่แถบกลาง ถ้าประธานของภาพไม่ได้อยู่กลางพอดี
   * มันจะหลุดออกนอกจอ ค่านี้บอกว่าให้ยึดจุดไหนไว้แทนจุดกึ่งกลาง
   */
  focus?: string;
}) {
  /*
    ken burns ซูมเข้าสูงสุด 10% ถ้าขอไฟล์มาเท่าความกว้างจอพอดี
    ตอนซูมเบราว์เซอร์จะต้องขยายภาพเกินความละเอียดจริงจนเห็นเป็นความเบลอ
    จึงขอเผื่อไว้ 15% ให้มีพิกเซลเหลือพอตลอดช่วงอนิเมชัน
  */
  const effectiveSizes = zoom && sizes === "100vw" ? "115vw" : sizes;

  return (
    <div className="absolute inset-0 -z-0 overflow-hidden" aria-hidden={!alt}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />

      {src && (
        <Image
          src={src}
          alt={alt}
          fill
          preload={preload}
          sizes={effectiveSizes}
          quality={quality}
          loading={loading}
          style={focus ? { objectPosition: focus } : undefined}
          className={`object-cover ${zoom ? "wecci-ken-burns" : ""}`}
        />
      )}

      {src && overlay && <div className={`absolute inset-0 ${overlay}`} />}

      {!src && (
        /* ลายจุดจาง ๆ ใช้ระหว่างรอภาพจริง */
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,.5) 0, transparent 45%), radial-gradient(circle at 80% 60%, rgba(255,255,255,.35) 0, transparent 40%)",
          }}
        />
      )}
    </div>
  );
}

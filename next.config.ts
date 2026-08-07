import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /*
      AVIF มาก่อนเพราะเล็กกว่า WebP ราว 20-30% ที่คุณภาพเท่ากัน
      เบราว์เซอร์ที่ไม่รองรับจะถอยไปใช้ WebP ให้เอง
    */
    formats: ["image/avif", "image/webp"],
    /*
      Next 16 บังคับให้ประกาศค่า quality ที่อนุญาตไว้ล่วงหน้า
      88 ไว้ใช้กับแบนเนอร์เต็มจอที่โดน ken burns ซูมเข้า จะได้ไม่แตก
    */
    qualities: [75, 88, 100],
    // แคชไฟล์ที่ optimize แล้ว 30 วัน ลดงานฝั่งเซิร์ฟเวอร์ตอนคนเข้าซ้ำ
    minimumCacheTTL: 2592000,
  },
};

export default nextConfig;

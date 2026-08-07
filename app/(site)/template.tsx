/**
 * template.tsx ถูกสร้างใหม่ทุกครั้งที่เปลี่ยนหน้า (ต่างจาก layout ที่ใช้ซ้ำ)
 * จึงเอามาใส่อนิเมชันเข้าให้ทุกหน้าของเว็บสาธารณะได้ในที่เดียว
 */
export default function SiteTemplate({ children }: { children: React.ReactNode }) {
  return <div className="wecci-page-in">{children}</div>;
}

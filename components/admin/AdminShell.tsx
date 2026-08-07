import Image from "next/image";
import Link from "next/link";
import { logout } from "@/app/admin/actions";
import { AdminNav, type NavChild, type NavItem } from "@/components/admin/AdminNav";
import { pageDefs } from "@/lib/content/schema";
import { countUnreadMessages } from "@/lib/messages";
import { siteConfig } from "@/lib/site-config";

/** ลิงก์ไปหน้าแก้ไขเนื้อหาของ slug ที่กำหนด — ชื่อเมนูเอามาจาก schema */
function pageLink(slug: string, label?: string): NavChild[] {
  const page = pageDefs.find((item) => item.slug === slug);
  if (!page) return [];

  // ชื่อใน schema มีขีดนำหน้าไว้ให้รู้ว่าเป็นหน้าย่อย ตรงนี้จัดกลุ่มแล้วจึงตัดออก
  return [
    {
      href: `/admin/pages/${page.slug}`,
      label: label ?? page.label.replace(/^—\s*/, ""),
    },
  ];
}

/** โครงหลังบ้าน — แถบข้างซ้าย + พื้นที่เนื้อหา */
export async function AdminShell({
  username,
  title,
  description,
  bare = false,
  children,
}: {
  username: string;
  title: string;
  description?: string;
  /** ซ่อนหัวเรื่องด้านบน สำหรับหน้าที่มีแถบเครื่องมือของตัวเองอยู่แล้ว */
  bare?: boolean;
  children: React.ReactNode;
}) {
  const unread = await countUnreadMessages();

  // เรียงตามเมนูของเว็บจริง — ปฏิทินกิจกรรมอยู่ในกลุ่มข่าวสารเหมือนหน้าเว็บ
  const navItems: NavItem[] = [
    {
      label: "เกี่ยวกับเรา",
      icon: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 8h.01M11 12h1v5h1",
      children: [
        ...pageLink("about", "ภาพรวมหน้าเกี่ยวกับเรา"),
        ...pageLink("about-institute"),
        ...pageLink("about-vision"),
        ...pageLink("about-strategy"),
        ...pageLink("about-executives"),
        { href: "/admin/staff", label: "โครงสร้างบุคลากร" },
      ],
    },
    {
      label: "บริการของเรา",
      icon: "M4 7h16M4 12h16M4 17h10",
      children: pageLink("services", "หน้ารวมบริการ"),
    },
    {
      label: "ข่าวสาร",
      icon: "M4 5h16v15H4zM4 9h16M8 3v4M16 3v4",
      children: [
        ...pageLink("news", "ภาพรวมหน้าข่าวสาร"),
        { href: "/admin/articles", label: "ข่าวสาร/บทความ" },
        // หน้ารายการกิจกรรมของหลังบ้าน ไม่ใช่หน้าแก้เนื้อหาแบบบล็อก
        { href: "/admin/events", label: "ปฏิทินกิจกรรม" },
        { href: "/admin/knowledge", label: "องค์ความรู้/วีดีโอ" },
      ],
    },
    {
      label: "ติดต่อเรา",
      icon: "M4 5c0 8 7 15 15 15l2-4-5-2-2 2a15 15 0 0 1-6-6l2-2-2-5z",
      children: pageLink("contact", "แผนที่ที่ตั้ง"),
    },
    {
      href: "/admin/messages",
      label: "ข้อความจากฟอร์ม",
      icon: "M3 6h18v12H3zM3 7l9 6 9-6",
      badge: unread,
    },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col bg-wecci-navy p-5 text-slate-300 lg:flex">
        <Link href="/admin" className="mb-8 flex justify-center">
          <Image
            src="/images/brand/FTI-WECCI-Logo_RGB-White.png"
            alt={siteConfig.shortName}
            width={6809}
            height={3510}
            className="h-20 w-auto"
          />
        </Link>

        <AdminNav items={navItems} />

        <div className="border-t border-white/10 pt-4">
          <p className="px-3 text-xs text-slate-400">เข้าสู่ระบบเป็น</p>
          <p className="px-3 text-sm font-semibold text-white">{username}</p>

          <form action={logout} className="mt-3">
            <button
              type="submit"
              className="w-full rounded-xl border border-white/20 px-3 py-2 text-sm transition hover:bg-white/10 hover:text-white"
            >
              ออกจากระบบ
            </button>
          </form>

          <Link
            href="/"
            target="_blank"
            className="mt-2 block px-3 py-2 text-xs text-slate-400 transition hover:text-white"
          >
            เปิดเว็บไซต์ ↗
          </Link>
        </div>
      </aside>

      <div className="flex-1">
        <main className="p-6 sm:p-8">
          {/* หัวเรื่องอยู่ในเนื้อหาเหมือนกันทุกหน้า ไม่มีแถบสีขาวคาดด้านบนแล้ว */}
          {!bare && (
            <div className="mb-5">
              <h1 className="text-2xl font-bold text-wecci-navy">{title}</h1>
              {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  );
}

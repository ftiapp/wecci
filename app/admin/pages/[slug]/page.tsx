import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { BlockForm } from "@/components/admin/BlockForm";
import { requireAdmin } from "@/lib/auth/current-user";
import { getPageDef } from "@/lib/content/schema";
import { getPageBlocks } from "@/lib/content/store";

export default async function AdminPageEditor({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const username = await requireAdmin();
  const { slug } = await params;

  const pageDef = getPageDef(slug);
  if (!pageDef) notFound();

  const blocks = await getPageBlocks(slug);

  return (
    <AdminShell
      username={username}
      title={`แก้ไขหน้า: ${pageDef.label}`}
      description="แก้ไขทีละบล็อก กดบันทึกแล้วหน้าเว็บจริงจะอัปเดตทันที"
    >
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Link
          href="/admin"
          className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-600 transition hover:border-wecci-blue hover:text-wecci-blue"
        >
          ← กลับหน้าภาพรวม
        </Link>
        <Link
          href={pageDef.href}
          target="_blank"
          className="rounded-full border border-slate-300 px-4 py-2 text-sm text-slate-600 transition hover:border-wecci-blue hover:text-wecci-blue"
        >
          ดูหน้าจริง ↗
        </Link>
      </div>

      <div className="grid gap-6">
        {pageDef.blocks.map((block) => (
          <BlockForm
            key={block.key}
            page={slug}
            block={block}
            values={blocks[block.key] ?? {}}
          />
        ))}
      </div>
    </AdminShell>
  );
}

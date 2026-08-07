import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { KnowledgeForm } from "@/components/admin/KnowledgeForm";
import { requireAdmin } from "@/lib/auth/current-user";
import { parseBlocks } from "@/lib/events/content";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EditKnowledgePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const username = await requireAdmin();
  const { id } = await params;

  const itemId = Number(id);
  if (!Number.isInteger(itemId)) notFound();

  const item = await prisma.cms_knowledge_items.findUnique({ where: { id: itemId } });
  if (!item) notFound();

  return (
    <AdminShell username={username} title="องค์ความรู้/วีดีโอ" bare>
      <KnowledgeForm
        values={{
          id: item.id,
          title: item.title,
          description: item.description ?? "",
          kind: item.kind,
          url: item.url ?? "",
          image: item.image ?? "",
          content: parseBlocks(item.content),
          published: item.published,
          featured: item.featured,
        }}
      />
    </AdminShell>
  );
}

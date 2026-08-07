import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { requireAdmin } from "@/lib/auth/current-user";
import { parseBlocks } from "@/lib/events/content";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const username = await requireAdmin();
  const { id } = await params;

  const articleId = Number(id);
  if (!Number.isInteger(articleId)) notFound();

  const [article, rows] = await Promise.all([
    prisma.cms_articles.findUnique({ where: { id: articleId } }),
    prisma.cms_articles.findMany({ distinct: ["category"], select: { category: true } }),
  ]);

  if (!article) notFound();

  return (
    <AdminShell username={username} title="ข่าวสาร/บทความ" bare>
      <ArticleForm
        categories={rows.map((row) => row.category)}
        values={{
          id: article.id,
          title: article.title,
          excerpt: article.excerpt ?? "",
          content: parseBlocks(article.content),
          category: article.category,
          image: article.image ?? "",
          publishedAt: article.publishedAt.toISOString().slice(0, 10),
          published: article.published,
          featured: article.featured,
        }}
      />
    </AdminShell>
  );
}

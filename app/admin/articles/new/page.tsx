import { AdminShell } from "@/components/admin/AdminShell";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { requireAdmin } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** วันนี้ในรูปแบบ YYYY-MM-DD สำหรับ <input type="date"> */
function today() {
  return new Date().toISOString().slice(0, 10);
}

export default async function NewArticlePage() {
  const username = await requireAdmin();

  const rows = await prisma.cms_articles.findMany({
    distinct: ["category"],
    select: { category: true },
  });

  return (
    <AdminShell username={username} title="ข่าวสาร/บทความ" bare>
      <ArticleForm
        categories={rows.map((row) => row.category)}
        values={{
          title: "",
          excerpt: "",
          content: [],
          category: "",
          image: "",
          publishedAt: today(),
          published: true,
          featured: false,
        }}
      />
    </AdminShell>
  );
}

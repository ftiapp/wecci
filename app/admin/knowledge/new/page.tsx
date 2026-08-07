import { AdminShell } from "@/components/admin/AdminShell";
import { KnowledgeForm } from "@/components/admin/KnowledgeForm";
import { requireAdmin } from "@/lib/auth/current-user";

export default async function NewKnowledgePage() {
  const username = await requireAdmin();

  return (
    <AdminShell username={username} title="องค์ความรู้/วีดีโอ" bare>
      <KnowledgeForm
        values={{
          title: "",
          description: "",
          kind: "video",
          url: "",
          image: "",
          content: [],
          published: true,
          featured: false,
        }}
      />
    </AdminShell>
  );
}

import { AdminShell } from "@/components/admin/AdminShell";
import { ExecutiveForm } from "@/components/admin/ExecutiveForm";
import { requireAdmin } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NewExecutivePage() {
  const username = await requireAdmin();

  // ต่อท้ายลำดับสุดท้ายให้อัตโนมัติ จะได้ไม่ต้องคิดเลขเอง
  const last = await prisma.cms_executive.findFirst({ orderBy: { sortOrder: "desc" } });

  return (
    <AdminShell username={username} title="โครงสร้างผู้บริหาร" bare>
      <ExecutiveForm
        values={{
          level: "รองประธานสถาบัน",
          nameTh: "",
          position: "",
          duty: "",
          org: "",
          phone: "",
          email: "",
          photo: "",
          sortOrder: (last?.sortOrder ?? 0) + 1,
          published: true,
        }}
      />
    </AdminShell>
  );
}

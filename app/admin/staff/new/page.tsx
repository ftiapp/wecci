import { AdminShell } from "@/components/admin/AdminShell";
import { StaffForm } from "@/components/admin/StaffForm";
import { requireAdmin } from "@/lib/auth/current-user";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NewStaffPage() {
  const username = await requireAdmin();

  // ต่อท้ายลำดับสุดท้ายให้อัตโนมัติ จะได้ไม่ต้องคิดเลขเอง
  const last = await prisma.cms_staff.findFirst({ orderBy: { sortOrder: "desc" } });

  return (
    <AdminShell username={username} title="โครงสร้างบุคลากร" bare>
      <StaffForm
        values={{
          level: "เจ้าหน้าที่",
          nameTh: "",
          phone: "",
          email: "",
          photo: "",
          sortOrder: (last?.sortOrder ?? 0) + 1,
          newRow: false,
          published: true,
        }}
      />
    </AdminShell>
  );
}

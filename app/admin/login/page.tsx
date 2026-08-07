import type { Metadata } from "next";
import Image from "next/image";
import { LoginForm } from "@/app/admin/login/LoginForm";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "เข้าสู่ระบบผู้ดูแล",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-wecci-navy via-wecci-blue to-wecci-navy px-5 py-16">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <span className="rounded-2xl bg-white p-3 shadow-lg">
            <Image
              src="/images/brand/fti-wecci-light.png"
              alt={siteConfig.shortName}
              width={6809}
              height={3510}
              priority
              className="h-12 w-auto"
            />
          </span>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-2xl">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold text-wecci-navy">ระบบจัดการเว็บไซต์</h1>
            <p className="mt-1 text-sm text-slate-500">
              สำหรับผู้ดูแลระบบเท่านั้น
            </p>
          </div>

          <LoginForm from={from ?? "/admin"} />
        </div>

        <p className="mt-6 text-center text-xs text-slate-300">
          © {new Date().getFullYear()} {siteConfig.nameTh}
        </p>
      </div>
    </main>
  );
}

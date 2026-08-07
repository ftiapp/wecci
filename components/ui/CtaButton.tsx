import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost";

const styles: Record<Variant, string> = {
  primary:
    "bg-wecci-blue text-white hover:bg-wecci-navy focus-visible:outline-wecci-blue",
  outline:
    "border border-white/70 text-white hover:bg-white hover:text-wecci-navy focus-visible:outline-white",
  ghost:
    "border border-slate-300 text-wecci-navy hover:border-wecci-blue hover:text-wecci-blue focus-visible:outline-wecci-blue",
};

export function CtaButton({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${styles[variant]} ${className}`}
    >
      {children}
      <span aria-hidden>→</span>
    </Link>
  );
}

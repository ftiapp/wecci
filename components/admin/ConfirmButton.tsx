"use client";

/** ปุ่มส่งฟอร์มที่ถามยืนยันก่อน ใช้กับ action ที่ย้อนกลับไม่ได้ */
export function ConfirmButton({
  message,
  label,
  className,
  children,
}: {
  message: string;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      title={label}
      aria-label={label}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
      className={className}
    >
      {children}
    </button>
  );
}

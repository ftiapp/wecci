/** เส้นคลื่นคั่นระหว่างเซกชัน — เป็นภาษาภาพหลักของแบรนด์ "น้ำ" */
export function WaveDivider({
  className = "",
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className={`block h-10 w-full sm:h-16 ${flip ? "rotate-180" : ""} ${className}`}
      aria-hidden
    >
      <path
        d="M0 40c120-30 240-30 360 0s240 30 360 0 240-30 360 0 240 30 360 0v40H0V40Z"
        fill="currentColor"
      />
    </svg>
  );
}

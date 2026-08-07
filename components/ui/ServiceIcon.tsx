import type { ServiceGroup } from "@/lib/data/services";

const paths: Record<ServiceGroup["icon"], string> = {
  drop: "M12 3s6 6.3 6 10.2A6 6 0 0 1 6 13.2C6 9.3 12 3 12 3Z",
  flask: "M9 3h6M10 3v6L4.5 18a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 9V3",
  leaf: "M4 20c0-8 6-14 16-15 0 10-5 16-13 16H4Zm3-2c3-4 6-6 9-8",
  chart: "M4 20V9m5 11V4m5 16v-7m5 7V7",
  book: "M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5Zm2 14h13",
  gear:
    "M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm8-3.5-2.1-.6-.6-1.5 1-1.9-1.8-1.8-1.9 1-1.5-.6L12 4l-1.1 2.6-1.5.6-1.9-1L5.7 8l1 1.9-.6 1.5L4 12l2.1.6.6 1.5-1 1.9 1.8 1.8 1.9-1 1.5.6L12 20l1.1-2.6 1.5-.6 1.9 1 1.8-1.8-1-1.9.6-1.5L20 12Z",
};

export function ServiceIcon({
  icon,
  className = "h-7 w-7",
}: {
  icon: ServiceGroup["icon"];
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d={paths[icon]} />
    </svg>
  );
}

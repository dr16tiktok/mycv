import type { ReactNode } from "react";

// A4 at ~96dpi: 794 x 1123 px (approx)
export const A4_WIDTH = 794;
export const A4_HEIGHT = 1123;

export function CvPaper({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        "bg-white text-zinc-900 shadow-sm ring-1 ring-zinc-200 overflow-hidden " +
        className
      }
      style={{ width: A4_WIDTH, minHeight: A4_HEIGHT }}
    >
      {children}
    </div>
  );
}

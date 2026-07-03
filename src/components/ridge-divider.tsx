import { cn } from "@/lib/utils";

/**
 * The site's signature structural device: a thin piste-map contour line.
 * Used as a section divider in place of a plain hairline rule — it's a literal
 * nod to a ski-resort trail map, reused consistently so it reads as a system,
 * not decoration.
 */
export default function RidgeDivider({
  className,
  tone = "line",
}: {
  className?: string;
  tone?: "line" | "snow" | "night";
}) {
  const strokeColor =
    tone === "snow"
      ? "rgba(247,248,251,0.5)"
      : tone === "night"
      ? "var(--night-piste)"
      : "var(--line)";

  return (
    <svg
      viewBox="0 0 1200 60"
      preserveAspectRatio="none"
      className={cn("ridge-divider", className)}
      aria-hidden="true"
    >
      <path
        d="M0 40 L120 40 L170 14 L230 44 L300 22 L360 46 L430 10 L520 42 L580 26 L660 48 L740 16 L830 44 L900 30 L980 46 L1060 18 L1140 40 L1200 40"
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

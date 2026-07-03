import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost" | "glacier";
  size?: "md" | "lg";
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 ease-out focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<string, string> = {
  primary:
    "bg-alpenglow text-white hover:bg-alpenglow-dark shadow-[0_8px_24px_-8px_rgba(255,107,71,0.55)] hover:shadow-[0_10px_28px_-8px_rgba(255,107,71,0.65)] hover:-translate-y-0.5",
  secondary:
    "bg-night text-white hover:bg-night-light hover:-translate-y-0.5",
  glacier:
    "bg-glacier text-white hover:bg-glacier-dark shadow-[0_8px_24px_-8px_rgba(63,169,224,0.55)] hover:-translate-y-0.5",
  ghost:
    "bg-transparent text-night border border-line hover:border-night",
};

const sizes: Record<string, string> = {
  md: "px-5 py-2.5 text-[15px]",
  lg: "px-7 py-3.5 text-base",
};

export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  onClick,
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

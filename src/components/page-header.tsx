import Container from "@/components/container";
import { cn } from "@/lib/utils";

export default function PageHeader({
  eyebrow,
  title,
  description,
  tone = "night",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  tone?: "night" | "glacier";
}) {
  return (
    <section
      className={cn(
        "pt-20 pb-16 sm:pt-28 sm:pb-20",
        tone === "night" ? "bg-night text-white" : "bg-[#0c2236] text-white"
      )}
    >
      <Container>
        <span
          className={cn(
            "font-mono text-xs uppercase tracking-wider",
            tone === "night" ? "text-alpenglow" : "text-glacier"
          )}
        >
          {eyebrow}
        </span>
        <h1 className="balance mt-3 max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/75">
            {description}
          </p>
        )}
      </Container>
    </section>
  );
}

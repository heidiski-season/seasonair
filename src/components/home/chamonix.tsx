import Container from "@/components/container";
import Button from "@/components/button";
import FadeIn from "@/components/fade-in";
import { CheckCircle } from "lucide-react";

const bullets = [
  "International YourSkiSeason community from day one",
  "In the heart of Mont Blanc, considered capital of the Alps",
  "Paid roles in chalets as host, drivers, cleaners or chefs",
  "The support you need to organise Accommodation, visas and contracts",
];

export default function Chamonix() {
  return (
    <section className="py-10 sm:py-14">
      <Container className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">

        {/* Left: text content */}
        <FadeIn>
          <span className="font-mono text-xs uppercase tracking-wider text-glacier-dark">
            Where you'll work
          </span>
          <h2 className="balance mt-3 font-display text-3xl font-semibold text-night sm:text-4xl">
            Work abroad in Chamonix<br />and across the Alps.
          </h2>

          <ul className="mt-8 space-y-4">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-stone">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-glacier" aria-hidden="true" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/services" variant="secondary" size="lg">
              Types of roles
            </Button>
            <Button href="/about" variant="ghost" size="lg">
              Our story
            </Button>
          </div>
        </FadeIn>

        {/* Right: chalet kitchen photo */}
        <FadeIn delay={0.12}>
          <div className="relative overflow-hidden rounded-3xl">
            <img
              src="/chalet-kitchen.png"
              alt="YourSkiSeasons cooking together in an Alpine chalet kitchen"
              className="w-full h-[380px] object-cover object-center"
            />
            {/* Small caption badge */}
          </div>
        </FadeIn>

      </Container>
    </section>
  );
}

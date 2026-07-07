import Container from "@/components/container";
import FadeIn from "@/components/fade-in";
import Button from "@/components/button";

export default function FounderQuote() {
  return (
    <section className="bg-[#0a1628] py-20 sm:py-28">
      <Container>

        {/* Two founder photos side by side */}
        <FadeIn className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:gap-20">

          <div className="flex flex-col sm:flex-row gap-8 justify-center">
            {/* Heidi */}
            <div className="flex flex-col items-center gap-3">
              <div className="h-56 w-56 rounded-full overflow-hidden ring-4 ring-glacier/30">
                <img
                  src="/heidi.png"
                  alt="Heidi, co-founder of YourSkiSeason"
                  className="h-full w-full object-cover object-[center_45%] scale-140"
                />
              </div>
              <div className="text-center">
                <p className="font-semibold text-white">Heidi</p>
                <p className="font-mono text-xs uppercase tracking-wide text-glacier">
                  Co-founder
                </p>
              </div>
            </div>

            {/* Annabel */}
            <div className="flex flex-col items-center gap-3">
              <div className="h-56 w-56 rounded-full overflow-hidden ring-4 ring-glacier/30">
                <img
                  src="/annabel.png"
                  alt="Annabel, co-founder of YourSkiSeason"
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="text-center">
                <p className="font-semibold text-white">Annabel</p>
                <p className="font-mono text-xs uppercase tracking-wide text-glacier">
                  Co-founder
                </p>
                </div>
            </div>
          </div>

          {/* Quote */}
          <FadeIn delay={0.1} className="flex-1">
            <span className="font-mono text-xs uppercase tracking-wider text-glacier">
              Why YourSkiSeason exists
            </span>
            <blockquote className="mt-5">
              <p className="font-display text-2xl font-medium leading-snug text-white sm:text-3xl">
                "I did a ski season in Chamonix and all that was missing was a community and an easy application, so I created it."
              </p>
              <footer className="mt-6">
                <p className="font-semibold text-white">Heidi</p>
                <p className="text-sm text-white/50">Co-founder, YourSkiSeason</p>
              </footer>
            </blockquote>
          </FadeIn>

        </FadeIn>
      </Container>
    </section>
  );
}
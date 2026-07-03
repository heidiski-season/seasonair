import Button from "@/components/button";
import Container from "@/components/container";

export default function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {/* Full-width background photo */}
      <div className="absolute inset-0 z-0">
        <img
          src="/ski-group.png"
          alt="Group of friends celebrating on a ski slope"
          className="w-full h-full object-cover object-center"
        />
        {/* Dark blue gradient overlay so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/85 via-[#0a1628]/60 to-[#0a1628]/30" />
      </div>

      <Container className="relative z-10 py-24">
        <div className="max-w-2xl">
          {/* Eyebrow */}

          {/* Main headline */}
          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            Ready for your<br />
            <span className="italic text-glacier">ski season?</span>
          </h1>

          {/* Sub-headline matching the sketch */}
          <p className="mt-6 text-xl font-medium text-white/90">
            Unforgettable winter season: Dec 2026 - April 2027
          </p>
          <p className="mt-3 max-w-md text-lg leading-relaxed text-white/70">
            We place young people into real paid jobs across the alps. A Community to get the best out of your season & matched to the perfect role.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Button href="/apply" size="lg" variant="glacier">
              Apply now
            </Button>
          </div>

        </div>
      </Container>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#f7f8fb] to-transparent z-10" />
    </section>
  );
}

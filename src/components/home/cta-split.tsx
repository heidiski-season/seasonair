import Container from "@/components/container";
import Button from "@/components/button";
import FadeIn from "@/components/fade-in";

export default function CtaSplit() {
  return (
    <section className="py-20 sm:py-28">
      <Container className="grid gap-6 lg:grid-cols-2">
        <FadeIn className="rounded-3xl bg-alpenglow p-10 text-white sm:p-12">
          <h3 className="font-display text-2xl font-semibold sm:text-3xl">
            Ready for your season?
          </h3>
          <p className="mt-3 max-w-sm text-white/85">
            Tell us your dates and what you want out of it. We'll match you to
            resorts that are actually hiring, this week.
          </p>
          <Button href="/services" variant="secondary" size="lg" className="mt-7 bg-night hover:bg-night-light">
            Find your season
          </Button>
        </FadeIn>

        <FadeIn delay={0.1} className="rounded-3xl bg-night p-10 text-white sm:p-12">
          <h3 className="font-display text-2xl font-semibold sm:text-3xl">
            Hiring for next season?
          </h3>
          <p className="mt-3 max-w-sm text-white/70">
            We supply vetted, trained seasonal staff to chalet companies and
            resorts across the Alps — with replacements covered if someone
            drops out.
          </p>
          <Button href="/partners" variant="glacier" size="lg" className="mt-7">
            Hire through YourSkiSeason
          </Button>
        </FadeIn>
      </Container>
    </section>
  );
}

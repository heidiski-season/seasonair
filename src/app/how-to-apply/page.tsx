import PageHeader from "@/components/page-header";
import Container from "@/components/container";
import FadeIn from "@/components/fade-in";
import Button from "@/components/button";
import { CheckCircle } from "lucide-react";

const steps = [
  {
    n: "01",
    title: "Fill in your application",
    body: "Complete your profile; It takes about 10 minutes and you can save and come back to it at any time before submitting.",
  },
  {
    n: "02",
    title: "Chit chat with YourSkiSeason expert",
    body: "Once we've reviewed your application, we'll invite you for a short informal chat with our team. This helps us understand what you're looking for and match you to the right role.",
  },
  {
    n: "03",
    title: "Get matched to a chalet company",
    body: "We hand-pick a chalet company or resort that fits your skills, dates and preferences. You'll then have a second interview directly with them and take part in their interview process",
  },
  {
    n: "04",
    title: "Sign your contract",
    body: "We check the contract terms before you sign anything; No nasty surprises and help you with all the legal requirments at no extra costs to you",
  },
  {
    n: "05",
    title: "Jet off into the season community",
    body: "Before you even land, you'll be added to your resort's YourSkiSeason WhatsApp group so a ready made chat is all in one place.",
  },
];

const requirements = [
  "Aged 18 or over",
  "Right to work in the EU useful but not required",
  "Enthusiastic and hardworking attitude",
  "No prior ski experience required",
];

export default function HowToApplyPage() {
  return (
    <>
      <PageHeader
        eyebrow="How to Apply"
        title="Everything you need to know before you apply."
        description="From filling in your form to landing at the resort — here's exactly what happens and when."
      />

      {/* Steps */}
      <section className="py-20 sm:py-24">
        <Container className="max-w-3xl">
          <FadeIn>
            <span className="font-mono text-xs uppercase tracking-wider text-glacier-dark">
              The process
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold text-night sm:text-4xl">
              Five steps to your season.
            </h2>
          </FadeIn>

          <div className="mt-12 space-y-8">
            {steps.map((step, i) => (
              <FadeIn key={step.n} delay={i * 0.06}>
                <div className="flex gap-6">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-glacier/10 font-display text-lg font-semibold text-glacier">
                    {step.n}
                  </div>
                  <div className="pt-2">
                    <h3 className="font-display text-xl font-semibold text-night">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-stone leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* Requirements */}
      <section className="bg-snow-dim py-20 sm:py-24">
        <Container className="max-w-3xl">
          <FadeIn>
            <span className="font-mono text-xs uppercase tracking-wider text-glacier-dark">
              Eligibility
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold text-night sm:text-4xl">
              Who can apply?
            </h2>
            <p className="mt-4 text-stone leading-relaxed">
              You don't need a CV full of ski experience — just the right attitude and availability.
            </p>
          </FadeIn>

          <ul className="mt-8 space-y-3">
            {requirements.map((req, i) => (
              <FadeIn key={req} delay={i * 0.05}>
                <li className="flex items-center gap-3 text-stone">
                  <CheckCircle className="h-5 w-5 shrink-0 text-glacier" />
                  {req}
                </li>
              </FadeIn>
            ))}
          </ul>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-20 text-center sm:py-24">
        <Container>
          <FadeIn>
            <h2 className="font-display text-3xl font-semibold text-night sm:text-4xl">
              Ready to get started?
            </h2>
            <p className="mt-4 text-stone">
              Applications for Winter Season 2026/27 are open now.
            </p>
            <Button href="/apply" size="lg" variant="glacier" className="mt-8">
              Start your application
            </Button>
          </FadeIn>
        </Container>
      </section>
    </>
  );
}
import Container from "@/components/container";
import FadeIn from "@/components/fade-in";
import RidgeDivider from "@/components/ridge-divider";

const steps = [
  {
    n: "01",
    title: "Apply",
    body: "All it takes is one click to get started; the first step to the best winter of your life.",
  },
  {
    n: "02",
    title: "Get matched",
    body: "Have an interview with our team to support you through the interview the process of getting matched to the right company.",
  },
  {
    n: "03",
    title: "Get hired",
    body: "Sign the contract and sort all the legal requirements with expert help; then get ready to jet set to the Alps.",
  },
  {
    n: "04",
    title: "Jet off into the community",
    body: "Get connected to your resort's SeasonAir WhatsApp chat before you land; pub meets, ski meets, all in one place.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-snow py-20 text-night sm:py-28">
      <Container>
        <FadeIn>
          <span className="font-mono text-xs uppercase tracking-wider text-alpenglow">
            The process
          </span>
          <h2 className="balance mt-3 max-w-xl font-display text-3xl font-semibold sm:text-4xl">
            Four steps between your sofa and a chairlift.
          </h2>
        </FadeIn>

        <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <FadeIn key={step.n} delay={i * 0.08}>
              <span className="font-display text-3xl font-semibold text-alpenglow">
                {step.n}
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-night">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-snowdrift/70">
                {step.body}
              </p>
            </FadeIn>
          ))}
        </div>
      </Container>
      <RidgeDivider tone="snow" className="mt-16 opacity-30" />
    </section>
  );
}

import Container from "@/components/container";
import Button from "@/components/button";
import { Star, Wallet, DollarSign, MapPin, Plane, FileCheck } from "lucide-react";

const included = [
  "No program fees!",
  "Food when working",
  "Accommodation",
  "Support acquiring a work permit if applicable",
  "Transport from the aiport to resort at the start and end of the season",
  "Emergency support throughout the season",
];

const benefits = [
  "Health insurance",
  "Virtual orientation before arriving",
  "Equipment hire",
  "Seasonal lift pass",
  "PUB DISCOUNTS",
  ];

const earnings = [
  { role: "Chalet Host", amount: "€400+ per month" },
];

const costs = [
  { icon: Plane, label: "Flights" },
  { icon: FileCheck, label: "Police check, DBS (if applicable)" },
];

export default function CostsAndInclusionsPage() {
  return (
    <>
      {/* Banner */}
      <section className="bg-[#0a1628] py-16 sm:py-20">
        <Container>
          <span className="inline-block rounded-lg bg-white px-4 py-2 font-mono text-xs font-semibold uppercase tracking-wide text-[#0a1628]">
            Costs and Inclusions
          </span>
          <h1 className="mt-6 max-w-2xl font-display text-4xl font-bold text-[#3fa9e0] sm:text-5xl">
            Secure your spot with no program fees.
          </h1>
        </Container>
      </section>

      {/* Three columns */}
      <section className="bg-[#f7f8fb] py-16 sm:py-20">
        <Container className="grid gap-6 lg:grid-cols-3">

          {/* What's included */}
          <div className="rounded-2xl bg-[#3fa9e0] p-8 text-white">
            <Star className="h-7 w-7" strokeWidth={1.5} />
            <h2 className="mt-3 font-display text-2xl font-bold">What's included?</h2>
            <ul className="mt-5 space-y-3 border-b border-white/25 pb-5">
              {included.map((item) => (
                <li key={item} className="text-sm">{item}</li>
              ))}
            </ul>
            <p className="mt-5 text-sm font-semibold uppercase tracking-wide">
              Benefits provided by your employer:
            </p>
            <ul className="mt-4 space-y-3">
              {benefits.map((item) => (
                <li key={item} className="text-sm">{item}</li>
              ))}
            </ul>
          </div>

          {/* Earn */}
          <div className="rounded-2xl border border-[#dde1ea] bg-white p-8">
            <Wallet className="h-7 w-7 text-[#11203a]" strokeWidth={1.5} />
            <h2 className="mt-3 font-display text-2xl font-bold text-[#11203a]">
              Earn pocket money
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#5b6472]">
              Most of your cost are covered, so this is just spending money per month for as much apres as desired ;):
            </p>
            <ul className="mt-6 divide-y divide-[#dde1ea]">
              {earnings.map((e) => (
                <li key={e.role} className="flex items-center justify-between py-3">
                  <span className="text-sm text-[#11203a]">{e.role}</span>
                  <span className="font-mono text-sm font-semibold text-[#3fa9e0]">{e.amount}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-[#8d95a3]">*Figures are indicative and vary by resort and employer.</p>
          </div>

          {/* Your costs */}
          <div className="rounded-2xl border border-[#dde1ea] bg-white p-8">
            <DollarSign className="h-7 w-7 text-[#11203a]" strokeWidth={1.5} />
            <h2 className="mt-3 font-display text-2xl font-bold text-[#11203a]">Your costs</h2>
            <ul className="mt-5 space-y-4 border-b border-[#dde1ea] pb-5">
              {costs.map((c) => (
                <li key={c.label} className="flex items-center gap-3 text-sm text-[#11203a]">
                  <c.icon className="h-5 w-5 text-[#3fa9e0]" strokeWidth={1.5} />
                  {c.label}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-[#5b6472]">
              Additional costs may apply depending on your circumstances and destination.
            </p>

            <div className="mt-8 border-t border-[#dde1ea] pt-6">
              <MapPin className="h-6 w-6 text-[#11203a]" strokeWidth={1.5} />
              <h3 className="mt-2 font-display text-lg font-bold text-[#11203a]">No program fees</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5b6472]">
                The advantage of our program is that there are no program
                fees — we operate on a free-to-join basis for seasonaires.
              </p>
            </div>
          </div>

        </Container>

        <Container className="mt-10 text-center">
          <Button href="/signup" size="lg" variant="glacier">
            Apply now
          </Button>
        </Container>
      </section>
    </>
  );
}
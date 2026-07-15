"use client";

import React from "react";
import Container from "@/components/container";
import Button from "@/components/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Mountain } from "lucide-react";

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-6 py-5 text-left"
      >
        <span className="font-display text-lg font-medium text-[#11203a]">{q}</span>
        <span className={`ml-4 shrink-0 text-[#3fa9e0] transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          ▾
        </span>
      </button>
      {open && (
        <div className="border-t border-[#e3ddd0] px-6 py-4">
          <p className="text-sm leading-relaxed text-[#5b6472]">{a}</p>
        </div>
      )}
    </div>
  );
}
const steps = [
  {
    n: "01",
    title: "Intro call",
    body: "To get started, feel free to get in touch with our team! Email yourskiseason@gmail.com or give us a call +447748484443 and we'll set up a quick call. We'll cover who we recruit, how the matching process works, what we check before placing anyone, and what it costs. No commitment needed, just a conversation.",
    img: "/contact-phone.png",
  },
  {
    n: "02",
    title: "Tell us what you need",
    body: "We'll ask you about your chalet or resort, number of staff, roles, dates, included benifits (accommodation or equipment hire) and what kind of person works well in your team. The more detail you give us, the better the match. You'll be added to our portal and we'll give you a demo.",
    img: "/chalet-kitchen.png",
  },
  {
    n: "03",
    title: "We find your candidates",
    body: "We handpick candidates from our applicant pool based on your brief; skills, availability, experience and attitude. Every candidate has been interviewed by us first. No CVs dumped in your inbox.",
    img: "/ski-group.png",
  },
  {
    n: "04",
    title: "You interview and choose",
    body: "We send you a shortlist and set up interviews. You pick who you want. If nobody feels right, we go again. We don't move on until you're confident.",
    img: "/chalet-kitchen.png",
  },
  {
    n: "05",
    title: "We sort the contract and paperwork",
    body: "****We check the contract terms before anyone signs; pay, hours, accommodation deductions and notice periods. We also handle visa and work permit guidance for your resort's country.",
    img: "/ski-group.png",
  },
  {
    n: "06",
    title: "Your staff arrive ready",
    body: "Your new team member lands already connected to the YourSkiSeason resort community; the faster to settle in, the less likely to drop out. If something does go wrong, we help cover replacements.",
    img: "/chalet-kitchen.png",
  },
];

const faqs = [
  {
    q: "How much does it cost?",
    a: "There are no upfront fees. Our placement fee is charged once your YourSkiSeason staff member starts their contract. Get in touch for current pricing.",
  },
  {
    q: "What if a staff member drops out mid-season?",
    a: "We help cover replacements. If a placed staff member leaves within the first 8 weeks for reasons within our control, we'll find you a replacement at no extra cost.",
  },
  {
    q: "How quickly can you find someone?",
    a: "For most roles we can have a shortlist to you within 5 working days. For last-minute placements, get in touch directly.",
  },
  {
    q: "Do you cover visa and work permits?",
    a: "Yes — we guide every candidate through the visa and work permit process. We won't place someone who isn't legally able to work.",
  },
  {
    q: "What roles can you fill?",
    a: "Chalet hosts, chalet chefs, lift operators, resort reps, ski techs, night nannies, bar staff and chalet cleaners.",
  },
  {
    q: "How do I get started?",
    a: "Just email us at yourskiseason@gmail.com or fill in the contact form. We'll set up an intro call within 48 hours.",
  },
];

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-[#f8f5ef]">

      {/* Hero */}
      <div className="bg-[#0c2236] py-20 sm:py-28">
        <Container>
          <span className="font-mono text-xs uppercase tracking-wider text-[#3fa9e0]">
            For chalet companies
          </span>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold text-white sm:text-5xl">
            Take the hassle out of seasonal recruitment.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/70">
            We provide vetted, trained seasonal staff to chalet companies and resorts across the Alps. You tell us what you need, we find the right person, check the contract, and make sure they actually show up.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/contact" variant="glacier" size="lg">
              Get in touch
            </Button>
            <Button href="mailto:yourskiseason@gmail.com" variant="ghost" size="lg" className="border-white/30 text-white hover:border-white">
              yourskiseason@gmail.com
            </Button>
          </div>
        </Container>
      </div>

      {/* Steps */}
      <section className="py-20 sm:py-28">
        <Container>
          <span className="font-mono text-xs uppercase tracking-wider text-[#2c8bbd]">
            The process
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold text-[#11203a] sm:text-4xl">
            How it works.
          </h2>

          <div className="mt-16 space-y-20">
            {steps.map((step, i) => (
              <div key={step.n} className={`grid items-center gap-12 lg:grid-cols-2 lg:gap-20`}>
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <span className="font-display text-4xl font-semibold text-[#3fa9e0]/30">
                    {step.n}
                  </span>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-[#11203a]">
                    {step.title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-[#5b6472]">
                    {step.body}
                  </p>
                </div>
                <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                  <div className="overflow-hidden rounded-3xl">
                    <img
                      src={step.img}
                      alt={step.title}
                      className="h-72 w-full object-cover object-center sm:h-80"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQs */}
      <section className="bg-[#eef0f6] py-20 sm:py-28">
        <Container className="max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-wider text-[#2c8bbd]">
            FAQs
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold text-[#11203a] sm:text-4xl">
            Common questions.
          </h2>
          <div className="mt-10 divide-y divide-[#e3ddd0] rounded-2xl border border-[#e3ddd0] bg-white overflow-hidden">
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-[#0a1628] py-20 text-center sm:py-24">
        <Container>
          <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            Ready to hire your next YourSkiSeason?
          </h2>
          <p className="mt-4 text-white/70">
            Get in touch and we'll have an intro call set up within 48 hours.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href="/chalet-signup" variant="glacier" size="lg">
              Contact us
            </Button>
            <Button href="mailto:yourskiseason@gmail.com" variant="ghost" size="lg" className="border-white/30 text-white hover:border-white">
              yourskiseason@gmail.com
            </Button>
          </div>
        </Container>
      </section>

    </div>
  );
}
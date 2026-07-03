import Container from "@/components/container";
import FadeIn from "@/components/fade-in";
import Button from "@/components/button";
import ListingCard from "@/components/listing-card";

const roles = [
  { role: "Chalet Host", resort: "Méribel", country: "France", pay: "£1,250/mo + tips", dates: "Dec – Apr", tag: "Filling fast" },
  { role: "Lift Operator", resort: "Verbier", country: "Switzerland", pay: "CHF 2,400/mo", dates: "Nov – Apr", tag: "New" },
  { role: "Chalet Chef", resort: "Val Thorens", country: "France", pay: "£1,500/mo + tips", dates: "Dec – Apr", tag: "Popular" },
  { role: "Resort Rep", resort: "Zermatt", country: "Switzerland", pay: "CHF 2,200/mo", dates: "Nov – Apr", tag: "New" },
  { role: "Ski Tech", resort: "Tignes", country: "France", pay: "€1,800/mo", dates: "Nov – May", tag: "Popular" },
  { role: "Night Nanny", resort: "Courchevel", country: "France", pay: "£1,400/mo + tips", dates: "Dec – Apr", tag: "Filling fast" },
];

export default function FeaturedRoles() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <FadeIn className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-alpenglow-dark">
              Open right now
            </span>
            <h2 className="balance mt-3 max-w-lg font-display text-3xl font-semibold text-night sm:text-4xl">
              Real roles, real resorts, paid from day one.
            </h2>
          </div>
          <Button href="/services" variant="ghost">
            View all roles
          </Button>
        </FadeIn>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((r, i) => (
            <FadeIn key={r.role + r.resort} delay={i * 0.05}>
              <ListingCard listing={r} />
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}

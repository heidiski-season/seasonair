import Link from "next/link";
import Container from "./container";
import { InstagramIcon, YoutubeIcon, FacebookIcon } from "./social-icons";

const columns = [
  {
    title: "Find a Season",
    links: [
      { href: "/how-to-apply", label: "How to Apply" },
      { href: "/costs-and-inclusions", label: "Costs & Inclusions" },
      { href: "/faq", label: "Eligibility" },
      { href: "/faq", label: "Visa Info" },
    ],
  },
  {
    title: "About",
    links: [
      { href: "/about", label: "Our Story" },
      { href: "/contact", label: "Contact Us" },
    ],
  },
  {
    title: "Get in Touch",
    links: [
      { href: "tel:+447700000000", label: "+44 7700 000000" },
      { href: "mailto:heidirwarren@gmail.com", label: "heidirwarren@gmail.com" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-[#f8f5ef] text-night">
      <Container className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">

        <div>
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="YourSkiSeason" className="h-10 w-auto" />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone">
            We place students and gap-year travellers into real, paid ski-season
            jobs across the Alps — and build the community around it.
          </p>
          <div className="mt-6 flex gap-4">
            <a href="#" aria-label="Instagram" className="text-stone transition-colors hover:text-night">
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a href="#" aria-label="YouTube" className="text-stone transition-colors hover:text-night">
              <YoutubeIcon className="h-5 w-5" />
            </a>
            <a href="#" aria-label="Facebook" className="text-stone transition-colors hover:text-night">
              <FacebookIcon className="h-5 w-5" />
            </a>
          </div>
        </div>

        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="font-display text-sm font-semibold text-glacier-dark uppercase tracking-wide">
              {col.title}
            </h3>
            <ul className="mt-4 space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-stone transition-colors hover:text-night"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

      </Container>

      <Container className="flex flex-col gap-3 border-t border-line py-6 text-xs text-stone sm:flex-row sm:items-center sm:justify-between">
        <p>Copyright YourSkiSeason. All Rights Reserved 2026.</p>
        <div className="flex gap-5">
          <Link href="/privacy" className="hover:text-night">Privacy Policy</Link>
          <Link href="https://www.smallerearth.com/terms-of-service" className="hover:text-night">Terms of Use</Link>
          <Link href="https://www.smallerearth.com/cookie-policy" className="hover:text-night">Cookie Policy</Link>
        </div>
      </Container>
    </footer>
  );
}
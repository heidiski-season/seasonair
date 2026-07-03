"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Mountain } from "lucide-react";
import Container from "./container";
import Button from "./button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/services", label: "Find a season" },
  { href: "/about", label: "About" },
  { href: "/how-to-apply", label: "How to Apply" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <div className="w-full bg-glacier py-2.5 text-center text-sm font-semibold text-white">
        Applications for Winter Season 2026/27 are now live! &nbsp;
        <a href="/signup" className="underline underline-offset-2 hover:opacity-80">
          Apply now
        </a>
      </div>
      <header className="sticky top-0 z-50 border-b border-line/70 bg-snow/85 backdrop-blur-md">
        <Container className="flex h-[68px] items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-xl font-semibold text-night"
          >
            <Mountain className="h-5 w-5 text-alpenglow" strokeWidth={2.5} aria-hidden="true" />
            SeasonAir
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-[15px] font-medium text-stone transition-colors hover:text-night",
                  pathname === link.href && "text-night"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/partners"
              className="text-[15px] font-medium text-glacier-dark transition-colors hover:text-glacier"
            >
              For chalet companies
            </Link>
            <Link
              href="/login"
              className="text-[15px] font-medium text-stone transition-colors hover:text-night"
            >
              Log in
            </Link>
            <Button href="/signup" size="md">
              Apply now
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="-mr-2 flex h-10 w-10 items-center justify-center rounded-full text-night lg:hidden"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </Container>

        <div
          id="mobile-menu"
          className={cn(
            "fixed inset-x-0 top-[68px] z-40 origin-top border-b border-line bg-snow transition-all duration-200 lg:hidden",
            open
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-2 opacity-0"
          )}
        >
          <Container className="flex flex-col gap-1 py-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-3 text-lg font-medium text-night hover:bg-snow-dim"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/partners"
              className="rounded-lg px-3 py-3 text-lg font-medium text-glacier-dark hover:bg-snow-dim"
            >
              For chalet companies
            </Link>
            <Link
              href="/login"
              className="rounded-lg px-3 py-3 text-lg font-medium text-stone hover:bg-snow-dim"
            >
              Log in
            </Link>
            <Button href="/signup" size="lg" className="mt-3 w-full">
              Apply now
            </Button>
          </Container>
        </div>
      </header>
    </>
  );
}
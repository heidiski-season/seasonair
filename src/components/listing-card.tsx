import { MapPin, Wallet, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

export type Listing = {
  role: string;
  resort: string;
  country: string;
  pay: string;
  dates: string;
  tag: string;
};

export default function ListingCard({
  listing,
  className,
}: {
  listing: Listing;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-line bg-white p-5 shadow-[0_20px_45px_-20px_rgba(17,32,58,0.25)]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="rounded-full bg-alpenglow/10 px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wide text-alpenglow-dark">
            {listing.tag}
          </span>
          <h3 className="mt-2 font-display text-lg font-semibold text-night">
            {listing.role}
          </h3>
        </div>
        <div className="text-right font-mono text-xs text-stone-light">#{listing.resort.slice(0,3).toUpperCase()}-26</div>
      </div>

      <dl className="mt-4 space-y-2 text-sm text-stone">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-glacier" aria-hidden="true" />
          <dt className="sr-only">Location</dt>
          <dd>{listing.resort}, {listing.country}</dd>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-glacier" aria-hidden="true" />
          <dt className="sr-only">Season dates</dt>
          <dd>{listing.dates}</dd>
        </div>
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-glacier" aria-hidden="true" />
          <dt className="sr-only">Pay</dt>
          <dd className="font-medium text-night">{listing.pay}</dd>
        </div>
      </dl>
    </div>
  );
}

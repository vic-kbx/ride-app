import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-4 py-16 sm:py-24">
      <section className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-sm font-medium text-primary">GreenRide for Kigali</p>
          <h1 className="max-w-xl text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
            Book a bike ride in seconds, with a calm and clear flow.
          </h1>
          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            Simple pickup, smart destination search, and real-time rider operations.
            Designed for everyday movement across Kigali.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/login">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border bg-card p-6 sm:p-8">
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
          <svg
            viewBox="0 0 520 380"
            className="relative z-10 w-full"
            role="img"
            aria-label="GreenRide illustration"
          >
            <rect x="10" y="20" width="500" height="340" rx="24" fill="var(--muted)" />
            <rect x="44" y="54" width="180" height="22" rx="11" fill="var(--accent)" />
            <rect x="44" y="92" width="270" height="16" rx="8" fill="var(--secondary)" />
            <rect x="44" y="118" width="210" height="16" rx="8" fill="var(--secondary)" />
            <rect x="44" y="164" width="432" height="152" rx="16" fill="var(--background)" />
            <circle cx="152" cy="275" r="42" fill="none" stroke="var(--primary)" strokeWidth="10" />
            <circle cx="308" cy="275" r="42" fill="none" stroke="var(--primary)" strokeWidth="10" />
            <path
              d="M152 275 L214 212 H274 L308 275 M214 212 L192 176"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="280" cy="166" r="12" fill="var(--primary)" />
          </svg>
        </div>
      </section>
    </main>
  );
}

// FILE PATH: wickwell/app/our-story/page.tsx  (replace/create this file in your project)
import type { Metadata } from "next";
import Link from "next/link";
import { Flame, Heart, Leaf } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Our story",
  description: "How WickWell started, how our candles are made, and what we care about.",
};

const values = [
  { Icon: Heart, t: "Mood first", d: "We do not just pick a pretty smell. Every candle is made around a feeling, calm, cosy, romantic or bold, so you can choose by how you want your day to feel." },
  { Icon: Flame, t: "Small batches", d: "Poured by hand in small batches, so we can pay attention to every single candle that leaves us." },
  { Icon: Leaf, t: "Honest and clean", d: "We tell you what goes into our candles, and we keep it simple. The ingredients are listed on every product page." },
];

const steps = [
  { t: "Choose the feeling", d: "Each candle begins with a mood and a scent that fits it." },
  { t: "Pour by hand", d: "We blend and pour in small batches, with no factory line." },
  { t: "Set and settle", d: "The candle is left to set properly, so it burns evenly for you." },
  { t: "Check and pack", d: "Every candle is checked, then packed to travel safely to your door." },
];

export default function OurStoryPage() {
  const wa = whatsappLink("Hi WickWell! I would like a custom or gifting order.");
  return (
    <main>
      <section className="container-lume py-12 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm text-wine-600">Our story</p>
            <h1 className="mt-2 text-5xl sm:text-6xl">Candles made for everyday rituals.</h1>
            <p className="mt-5 max-w-xl text-lg/relaxed text-cocoa-600">
              WickWell began with a simple idea: scent should feel like a companion, not just a fragrance. We create small-batch candles that turn quiet moments into rituals.
            </p>
            <p className="mt-4 max-w-xl text-lg/relaxed text-cocoa-600">
              Every blend is hand-poured with clean ingredients and designed to fit your mood, your home, and your pace.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="btn-primary min-h-12">Shop candles</Link>
              <Link href="/scent-finder" className="btn-ghost min-h-12 text-cocoa-900">Find my scent</Link>
            </div>
          </div>
          <div className="rounded-card bg-gradient-to-br from-blush-200 via-cream-50 to-cream-100 p-6 shadow-soft">
            <div className="aspect-[4/5] rounded-card bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.7),_transparent_30%),linear-gradient(135deg,#3a0f14,#8c1d2e_40%,#f5dcd6)]" />
          </div>
        </div>
      </section>

      <section className="bg-blush-200 py-12 md:py-16">
        <div className="container-lume">
          <h2 className="text-4xl">What we care about</h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {values.map(({ Icon, t, d }) => (
              <li key={t} className="rounded-card bg-cream-50 p-6 shadow-soft">
                <Icon size={24} className="text-wine-600" aria-hidden />
                <h3 className="mt-3 text-2xl">{t}</h3>
                <p className="mt-2 text-sm/relaxed text-cocoa-600">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-lume py-12 md:py-16">
        <h2 className="text-4xl">How a WickWell candle is made</h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.t} className="rounded-card border border-cocoa-900/10 p-5">
              <span className="font-display text-4xl text-wine-600">{i + 1}</span>
              <h3 className="mt-1 text-2xl">{s.t}</h3>
              <p className="mt-2 text-sm/relaxed text-cocoa-600">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {SITE.founder.name && (
        <section className="container-lume pb-12 md:pb-16">
          <div className="max-w-3xl rounded-card bg-cream-50 p-6 shadow-soft sm:p-8">
            <p className="text-sm text-wine-600">Meet the maker</p>
            <h2 className="mt-1 text-4xl">{SITE.founder.name}</h2>
            <p className="text-sm text-cocoa-600">{SITE.founder.role}</p>
            <div className="mt-4 space-y-3 leading-relaxed text-cocoa-600">
              {SITE.founder.story.map((p) => <p key={p}>{p}</p>)}
            </div>
          </div>
        </section>
      )}

      <section className="bg-wine-900 py-12 text-center text-cream-50">
        <div className="container-lume">
          <h2 className="text-4xl">Looking for a gift, or something special?</h2>
          <p className="mx-auto mt-3 max-w-md text-cream-50/80">Tell us the occasion and we will help you choose, or put together a custom order.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/gifts" className="inline-flex min-h-12 items-center justify-center rounded-full bg-cream-50 px-7 text-sm font-medium text-cocoa-900 transition hover:bg-white">Explore gifts</Link>
            {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center rounded-full border border-cream-50/50 px-7 text-sm font-medium text-cream-50 transition hover:bg-white/10">Chat with us</a>}
            <Link href="/contact" className="inline-flex min-h-12 items-center justify-center rounded-full border border-cream-50/50 px-7 text-sm font-medium text-cream-50 transition hover:bg-white/10">Contact us</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
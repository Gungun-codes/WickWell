// FILE PATH: wickwell/app/our-story/page.tsx  (replace/create this file in your project)
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Flame, Heart, Leaf } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/site";
import { STORY } from "@/lib/story";
import { supabase } from "@/lib/supabase";

export const revalidate = 300;

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

async function liveCounts() {
  if (!STORY.showLiveCounts) return [];
  try {
    const [p, c] = await Promise.all([
      supabase.from("products").select("id", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("categories").select("id", { count: "exact", head: true }),
    ]);
    return [
      { value: String(p.count ?? 0), label: "Candles" },
      { value: String(c.count ?? 0), label: "Categories" },
    ].filter((s) => s.value !== "0");
  } catch {
    return [];
  }
}

/** Arch-shaped photo with an offset outline, an optional second photo and a small caption chip. */
function PhotoFrame() {
  const alt = STORY.photoAlt || (SITE.founder.name ? `${SITE.founder.name}, founder of ${SITE.name}` : `The maker behind ${SITE.name}`);
  return (
    <div className="relative mx-auto w-full max-w-sm pb-6 pr-5 lg:max-w-md">
      <div aria-hidden className="absolute inset-y-4 left-5 right-0 rounded-t-full rounded-b-[2rem] border-2 border-wine-600/35" />
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[2rem] bg-blush-200 shadow-soft">
        <Image src={STORY.photo} alt={alt} fill priority sizes="(max-width: 1024px) 80vw, 40vw" className="object-cover" />
      </div>
      {STORY.photo2 && (
        <div className="absolute -bottom-2 -left-3 size-28 overflow-hidden rounded-2xl border-4 border-cream-100 shadow-soft sm:size-32">
          <Image src={STORY.photo2} alt="" fill sizes="128px" className="object-cover" />
        </div>
      )}
      {STORY.caption && (
        <p className="absolute bottom-10 right-0 inline-flex items-center gap-2 rounded-full bg-cream-50/95 px-4 py-2 text-sm text-cocoa-900 shadow-soft backdrop-blur">
          <Flame size={16} className="text-wine-600" aria-hidden /> {STORY.caption}
        </p>
      )}
    </div>
  );
}

export default async function OurStoryPage() {
  const wa = whatsappLink("Hi WickWell! I would like a custom or gifting order.");
  const stats = [...STORY.stats, ...(await liveCounts())];

  return (
    <main>
      <section className="container-lume py-12 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="order-2 lg:order-1">
            <p className="text-sm text-wine-600">Our story</p>
            <h1 className="mt-2 text-5xl sm:text-6xl">Candles made for everyday rituals.</h1>
            {STORY.nameMeaning && <p className="mt-4 font-display text-2xl italic text-wine-600">{STORY.nameMeaning}</p>}
            <p className="mt-5 max-w-xl text-lg/relaxed text-cocoa-600">
              WickWell began with a simple idea: scent should feel like a companion, not just a fragrance. We create small-batch candles that turn quiet moments into rituals.
            </p>
            <p className="mt-4 max-w-xl text-lg/relaxed text-cocoa-600">
              Every blend is hand-poured with clean ingredients and designed to fit your mood, your home, and your pace.
            </p>

            {stats.length > 0 && (
              <dl className="mt-8 grid max-w-xl grid-cols-3 gap-4 border-t border-cocoa-900/10 pt-6">
                {stats.slice(0, 3).map((s) => (
                  <div key={s.label}>
                    <dt className="font-display text-4xl text-wine-600 sm:text-5xl">{s.value}</dt>
                    <dd className="mt-1 text-xs text-cocoa-600 sm:text-sm">{s.label}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="btn-primary min-h-12">Shop candles</Link>
              <Link href="/scent-finder" className="btn-ghost min-h-12 text-cocoa-900">Find my scent</Link>
            </div>
          </div>

          <div className="order-1 lg:order-2"><PhotoFrame /></div>
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
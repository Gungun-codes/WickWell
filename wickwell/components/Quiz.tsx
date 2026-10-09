"use client";
import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { recommend } from "@/app/scent-finder/actions";
import { ProductCard } from "./ProductCard";
import type { ProductCardData } from "@/lib/queries";

type Mood = { slug: string; name: string };

const families = [
  { slug: "floral", label: "Floral", hint: "Rose, peony, jasmine" },
  { slug: "sweet", label: "Sweet", hint: "Vanilla, coffee, caramel" },
  { slug: "woody", label: "Woody", hint: "Amber, cedar, tonka" },
  { slug: "fresh", label: "Fresh", hint: "Eucalyptus, mint, citrus" },
];

export function Quiz({ moods, initialMood }: { moods: Mood[]; initialMood?: string }) {
  const valid = initialMood && moods.some((m) => m.slug === initialMood) ? initialMood : "";
  const [step, setStep] = useState<1 | 2 | 3>(valid ? 2 : 1);
  const [mood, setMood] = useState(valid);
  const [picked, setPicked] = useState<string[]>([]);
  const [results, setResults] = useState<ProductCardData[]>([]);
  const [pending, start] = useTransition();

  const toggle = (s: string) => setPicked((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  function finish() {
    start(async () => {
      setResults(await recommend(mood, picked));
      setStep(3);
    });
  }

  const steps = ["Your mood", "Your preferences", "Your match"];

  return (
    <div className="mx-auto max-w-3xl">
      <ol className="mb-8 flex items-center gap-2 text-xs" aria-label="Progress">
        {steps.map((s, i) => (
          <li key={s} aria-current={step === i + 1 ? "step" : undefined} className={`flex flex-1 items-center gap-2 ${step >= i + 1 ? "text-wine-600" : "text-cocoa-600/60"}`}>
            <span className={`h-1 flex-1 rounded-full ${step >= i + 1 ? "bg-wine-600" : "bg-cocoa-900/10"}`} />
            <span className="hidden sm:inline">{s}</span>
          </li>
        ))}
      </ol>

      {step === 1 && (
        <section>
          <h1 className="text-4xl sm:text-5xl">What kind of energy are you in today?</h1>
          <ul className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {moods.map((m) => (
              <li key={m.slug}>
                <button
                  type="button" onClick={() => setMood(m.slug)} aria-pressed={mood === m.slug}
                  className={`block w-full overflow-hidden rounded-card border-2 text-center transition ${mood === m.slug ? "border-wine-600" : "border-transparent"}`}
                >
                  <span className="relative block aspect-square">
                    <Image src={`/${m.slug}.png`} alt="" fill sizes="25vw" className="object-cover" />
                  </span>
                  <span className="block bg-cream-50 py-2 text-sm">{m.name}</span>
                </button>
              </li>
            ))}
          </ul>
          <button type="button" disabled={!mood} onClick={() => setStep(2)} className="btn-primary mt-8 disabled:opacity-40">Next</button>
        </section>
      )}

      {step === 2 && (
        <section>
          <h1 className="text-4xl sm:text-5xl">What do you like the smell of?</h1>
          <p className="mt-2 text-sm text-cocoa-600">Pick as many as you like, or skip.</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {families.map((f) => (
              <li key={f.slug}>
                <button
                  type="button" onClick={() => toggle(f.slug)} aria-pressed={picked.includes(f.slug)}
                  className={`w-full rounded-card border-2 bg-cream-50 p-4 text-left transition ${picked.includes(f.slug) ? "border-wine-600" : "border-transparent"}`}
                >
                  <span className="block font-medium">{f.label}</span>
                  <span className="text-xs text-cocoa-600">{f.hint}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex gap-3">
            <button type="button" onClick={() => setStep(1)} className="btn-ghost">Back</button>
            <button type="button" onClick={finish} disabled={pending} className="btn-primary disabled:opacity-60">
              {pending ? "Finding your match…" : "Show my match"}
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section>
          <h1 className="text-4xl sm:text-5xl">Your scent match.</h1>
          <p className="mt-2 text-sm text-cocoa-600">Picked for a {moods.find((m) => m.slug === mood)?.name.toLowerCase()} mood.</p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {results.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
          <div className="mt-8 flex gap-3">
            <button type="button" onClick={() => { setStep(1); setMood(""); setPicked([]); }} className="btn-ghost">Retake quiz</button>
            <Link href="/shop" className="btn-primary">Browse all candles</Link>
          </div>
        </section>
      )}
    </div>
  );
}
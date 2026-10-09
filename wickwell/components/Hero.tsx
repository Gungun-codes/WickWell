import Link from "next/link";
import { Leaf, Clock, Flame, Heart, Sparkles, ArrowRight } from "lucide-react";
import { HeroScene } from "./HeroScene";
import { RotatingWords } from "./RotatingWords";

const trust = [
  { Icon: Leaf, label: "Non-toxic & safe" },
  { Icon: Clock, label: "Long-lasting fragrance" },
  { Icon: Flame, label: "Hand-poured" },
  { Icon: Heart, label: "Made with love" },
];

/** Splits a phrase into words that rise in one after another. */
function Words({ text, start }: { text: string; start: number }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={`${w}-${i}`}>
          <span className="hero-word" style={{ ["--d" as string]: `${(start + i * 0.1).toFixed(2)}s` }}>{w}</span>{" "}
        </span>
      ))}
    </>
  );
}

export function Hero() {
  return (
    <section className="relative isolate min-h-[720px] overflow-hidden bg-cocoa-900 text-cream-50 md:min-h-[600px]">
      <HeroScene />

      {/* keeps text readable over the photo */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-cocoa-900/85 via-cocoa-900/40 to-transparent" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-cocoa-900/90 via-transparent to-transparent md:hidden" />

      <div className="container-lume flex min-h-[720px] flex-col justify-end pb-28 pt-24 md:min-h-[600px] md:justify-center">
        <h1 className="hero-title max-w-xl text-5xl leading-[1.02] sm:text-6xl md:text-7xl">
          <span className="block"><Words text="Scents that" start={0.9} /></span>
          <span className="block">
            <Words text="feel like" start={1.1} />
            <em style={{ ["--d" as string]: "1.3s" }}>you.</em>
          </span>
        </h1>

        <p className="hero-rise mt-6 max-w-sm text-base/relaxed text-cream-50/90" style={{ ["--d" as string]: "1.5s" }}>
          Candles for every version of you, made for your
        </p>
        <p className="hero-rise mt-1 min-h-[2.6rem]" style={{ ["--d" as string]: "1.6s" }}>
          <RotatingWords />
        </p>

        <div className="hero-rise mt-8 flex flex-wrap items-center gap-3" style={{ ["--d" as string]: "1.8s" }}>
          <Link href="/scent-finder" className="hero-cta">
            <Sparkles size={18} className="spark" aria-hidden />
            Find my scent
            <ArrowRight size={18} className="arrow" aria-hidden />
          </Link>
          <Link href="/shop" className="hero-cta-ghost">Shop candles</Link>
        </div>
        <p className="hero-fade mt-4 text-sm text-cream-50/70" style={{ ["--d" as string]: "2.1s" }}>
          Takes 1 minute · Free shipping over ₹999
        </p>

        <p
          className="hero-fade pointer-events-none absolute right-8 top-40 hidden -rotate-6 font-script text-2xl leading-tight opacity-90 lg:block"
          style={{ ["--d" as string]: "2s" }}
        >
          Same mood,<br />different scent
        </p>
      </div>

      <ul className="hero-fade absolute inset-x-0 bottom-0 border-t border-white/10 bg-cocoa-900/70 backdrop-blur" style={{ ["--d" as string]: "1.6s" }}>
        <div className="container-lume grid grid-cols-2 gap-y-3 py-4 text-xs md:grid-cols-4 md:text-sm">
          {trust.map(({ Icon, label }) => (
            <li key={label} className="flex items-center justify-center gap-2 md:justify-start">
              <Icon size={18} aria-hidden /> {label}
            </li>
          ))}
        </div>
      </ul>
    </section>
  );
}
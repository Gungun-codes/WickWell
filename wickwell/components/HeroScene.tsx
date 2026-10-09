"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Flame } from "lucide-react";
import "./hero.css";

/* Source photo size + where the flame sits inside it (measured from /public/hero.png).
   If you swap the hero image, update these four numbers. */
const IMG_W = 1774;
const IMG_H = 887;
const POS_X = 0.7; // must match object-position below
const POS_Y = 0.5;
const FLAME_X = 0.746;
const WICK_Y = 0.437; // base of flame
const FLAME_MID_Y = 0.404;

type Rect = { left: number; top: number; w: number; h: number };
type State = "dark" | "lit" | "out";

// Deterministic particle data (no Math.random, so server and client markup match).
const embers = Array.from({ length: 14 }, (_, i) => ({
  sx: ((i * 37) % 70) - 35,
  rise: 120 + ((i * 53) % 170),
  s: 2 + ((i * 7) % 3),
  dur: (4.2 + ((i * 29) % 38) / 10).toFixed(1),
  delay: ((i * 0.67) % 6.5).toFixed(2),
}));
const motes = Array.from({ length: 18 }, (_, i) => ({
  left: 50 + ((i * 41) % 48),
  top: 22 + ((i * 29) % 55),
  s: 1.5 + ((i * 5) % 3) * 0.7,
  dur: (9 + ((i * 17) % 8)).toFixed(0),
  delay: ((i * 1.3) % 9).toFixed(1),
}));
const smoke = [
  { sx: -14, rise: 190, delay: "0s" },
  { sx: 10, rise: 230, delay: ".25s" },
  { sx: -4, rise: 270, delay: ".55s" },
];

export function HeroScene() {
  const box = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<Rect | null>(null);
  const [state, setState] = useState<State>("dark");

  // Work out where the photo really lands under object-fit: cover, so effects stay glued to the wick.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const measure = () => {
      const W = el.clientWidth, H = el.clientHeight;
      const s = Math.max(W / IMG_W, H / IMG_H);
      const w = IMG_W * s, h = IMG_H * s;
      setRect({ left: (W - w) * POS_X, top: (H - h) * POS_Y, w, h });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const lit = state === "lit";
  const wickX = rect ? rect.left + rect.w * FLAME_X : 0;
  const wickY = rect ? rect.top + rect.h * WICK_Y : 0;

  return (
    <>
      <div ref={box} className="absolute inset-0 -z-10 overflow-hidden">
        {/* Photo + effects share one layer that breathes around the flame, so they never drift apart. */}
        <div
          className="hero-breathe absolute inset-0"
          style={rect ? { transformOrigin: `${wickX}px ${wickY}px` } : undefined}
        >
          <Image
            src="/hero.png"
            alt="A lit amber candle on a stone coaster beside dried flowers"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-90"
            style={{ objectPosition: `${POS_X * 100}% ${POS_Y * 100}%` }}
          />
          {/* Same photo with the flame removed. Visible before ignition and after blow-out. */}
          <Image
            src="/hero-out.png"
            alt=""
            fill
            sizes="100vw"
            loading="eager"
            aria-hidden
            className="object-cover transition-opacity duration-700"
            style={{ objectPosition: `${POS_X * 100}% ${POS_Y * 100}%`, opacity: lit ? 0 : 0.9 }}
          />

          {rect && (
            <div
              className="hero-fx"
              style={{
                left: rect.left, top: rect.top, width: rect.w, height: rect.h,
                ["--u" as string]: `${rect.w / 1000}px`,
              }}
              aria-hidden
            >
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{ opacity: lit ? 1 : 0 }}
              >
                <div className="hero-glow-wide" style={{ left: `${FLAME_X * 100}%`, top: `${FLAME_MID_Y * 100}%` }} />
                <div className="hero-glow-core" style={{ left: `${FLAME_X * 100}%`, top: `${FLAME_MID_Y * 100}%` }} />
                <svg
                  className="hero-flame"
                  style={{ left: `${FLAME_X * 100}%`, top: `${WICK_Y * 100}%` }}
                  viewBox="0 0 20 46"
                >
                  <defs>
                    <linearGradient id="hf" x1="0" y1="1" x2="0" y2="0">
                      <stop offset="0" stopColor="#ff8a2a" stopOpacity=".95" />
                      <stop offset=".45" stopColor="#ffc15a" />
                      <stop offset="1" stopColor="#fff6d6" />
                    </linearGradient>
                  </defs>
                  <path d="M10 1 C13 12 19 20 19 30 C19 39 15 45 10 45 C5 45 1 39 1 30 C1 20 7 12 10 1 Z" fill="url(#hf)" opacity=".55" />
                </svg>
              </div>

              {lit && embers.map((e, i) => (
                <span
                  key={`e${i}`}
                  className="hero-ember"
                  style={{
                    left: `${FLAME_X * 100}%`, top: `${(FLAME_MID_Y - 0.02) * 100}%`,
                    ["--s" as string]: e.s, ["--sx" as string]: e.sx, ["--rise" as string]: e.rise,
                    ["--dur" as string]: `${e.dur}s`, ["--delay" as string]: `${e.delay}s`,
                  }}
                />
              ))}

              {lit && motes.map((m, i) => (
                <span
                  key={`m${i}`}
                  className="hero-mote"
                  style={{
                    left: `${m.left}%`, top: `${m.top}%`,
                    ["--s" as string]: m.s,
                    ["--dur" as string]: `${m.dur}s`, ["--delay" as string]: `${m.delay}s`,
                  }}
                />
              ))}

              {state === "out" && smoke.map((s, i) => (
                <span
                  key={`s${i}`}
                  className="hero-smoke"
                  style={{
                    left: `${FLAME_X * 100}%`, top: `${WICK_Y * 100}%`,
                    ["--sx" as string]: s.sx, ["--rise" as string]: s.rise, ["--delay" as string]: s.delay,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* The room: dark before ignition, dim when blown out, fully warm when lit. */}
        <div
          className="absolute inset-0 bg-[#120604] transition-opacity duration-[1800ms] ease-out"
          style={{ opacity: state === "dark" ? 0.88 : state === "out" ? 0.62 : 0 }}
        />
      </div>

      <button
        type="button"
        onClick={() => setState((current) => current === "lit" ? "out" : "lit")}
        className="absolute bottom-20 right-4 z-10 inline-flex items-center gap-2 rounded-full border border-white/25 bg-cocoa-900/55 px-4 py-2 text-sm text-cream-50 backdrop-blur transition hover:bg-cocoa-900/75 md:bottom-24 md:right-8"
      >
        <Flame size={16} className={lit ? "text-gold-400" : "opacity-60"} aria-hidden />
        {lit ? "Blow out the candle" : "Light the candle"}
      </button>
    </>
  );
}
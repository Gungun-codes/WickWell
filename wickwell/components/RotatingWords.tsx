"use client";
import { useEffect, useState } from "react";

const phrases = [
  "calm mornings.",
  "chaotic days.",
  "cozy nights.",
  "date nights.",
  "slow Sundays.",
  "main-character moments.",
];

/** Cycles mood phrases. All phrases are stacked in one grid cell, so the line never changes height. */
export function RotatingWords() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % phrases.length), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <>
      <span className="sr-only">Made for calm mornings, chaotic days, cozy nights and everything in between.</span>
      <span className="hero-rotor font-display text-3xl italic text-gold-400 sm:text-4xl" aria-hidden>
        {phrases.map((p, idx) => (
          <span key={p} data-on={idx === i}>{p}</span>
        ))}
      </span>
    </>
  );
}
// FILE PATH: wickwell/components/HomeFaq.tsx  (replace/create this file in your project)
import Link from "next/link";
import { FaqShort } from "./Faq";

const SHOWN = [
  "How do I place an order?",
  "How long does delivery take?",
  "What does shipping cost?",
  "What if my candle arrives damaged or broken?",
  "Do you take custom or bulk orders?",
];

export function HomeFaq() {
  return (
    <section className="container-lume max-w-3xl py-12">
      <h2 className="text-3xl">Frequently asked questions</h2>
      <p className="mt-1 text-sm text-cocoa-600">Everything you need to know before you order.</p>
      <div className="mt-6"><FaqShort qs={SHOWN} /></div>
      <Link href="/faqs" className="mt-5 inline-flex min-h-11 items-center text-sm text-wine-600 hover:underline">See all FAQs →</Link>
    </section>
  );
}
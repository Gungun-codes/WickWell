// FILE PATH: wickwell/app/[page]/page.tsx  (replace/create this file in your project)
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Footer pages. Replace this copy with your real policies before launch.
const pages: Record<string, { title: string; body: string[] }> = {
  contact: { title: "Contact us", body: ["Questions about an order or a scent? Email wickwell1210@gmail.com and we will reply within one working day."] },
  faqs: { title: "FAQs", body: ["How long do the candles burn? Up to 50 hours for the 180g size.", "Are they safe? Yes. We use non-toxic wax and clean fragrance oils.", "Can I gift a candle? Yes. Add a note at checkout."] },
  shipping: { title: "Shipping", body: ["We ship across India. Orders above ₹999 ship free; otherwise shipping is ₹99.", "Orders are poured and packed in 2 to 3 working days, then delivered in 3 to 7 days."] },
  returns: { title: "Returns", body: ["If your candle arrives damaged, message us within 48 hours with a photo and we will replace it."] },
  ingredients: { title: "Ingredients", body: ["Soy-blend wax, cotton wicks and skin-safe fragrance oils. No parabens, no phthalates."] },
  sustainability: { title: "Sustainability", body: ["Recyclable glass vessels and plastic-free packaging, made in small batches to avoid waste."] },
};

export function generateStaticParams() {
  return Object.keys(pages).map((page) => ({ page }));
}
export const dynamicParams = false;

export function generateMetadata({ params }: { params: { page: string } }): Metadata {
  return { title: pages[params.page]?.title ?? "Not found" };
}

export default function InfoPage({ params }: { params: { page: string } }) {
  const p = pages[params.page];
  if (!p) notFound();
  return (
    <main className="container-lume max-w-2xl py-14">
      <h1 className="text-4xl sm:text-5xl">{p.title}</h1>
      <div className="mt-6 space-y-4 text-cocoa-600">{p.body.map((t) => <p key={t}>{t}</p>)}</div>
    </main>
  );
}
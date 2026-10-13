// FILE PATH: wickwell/app/faqs/page.tsx  (replace/create this file in your project)
import type { Metadata } from "next";
import { FaqList } from "@/components/Faq";
import { SupportCard } from "@/components/SupportCard";
import { FAQS } from "@/lib/faqs";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Answers about ordering, shipping, payments, returns and candle care at WickWell.",
};

export default function FaqPage() {
  // Lets Google show your answers directly in search results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <main className="container-lume max-w-3xl py-10 md:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-5xl sm:text-6xl">Frequently asked questions</h1>
      <p className="mt-4 max-w-2xl text-lg/relaxed text-cocoa-600">Everything you need to know before you order. If your answer is not here, just ask us.</p>
      <div className="mt-10"><FaqList /></div>
      <SupportCard />
    </main>
  );
}
// FILE PATH: wickwell/components/Faq.tsx  (replace/create this file in your project)
import { ChevronDown } from "lucide-react";
import { FAQS, FAQ_GROUPS, type Faq } from "@/lib/faqs";

function Item({ f }: { f: Faq }) {
  return (
    <details className="group rounded-card bg-cream-50 shadow-soft [&_summary::-webkit-details-marker]:hidden">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-medium">
        {f.q}
        <ChevronDown size={18} aria-hidden className="shrink-0 text-wine-600 transition-transform group-open:rotate-180" />
      </summary>
      <p className="px-5 pb-5 leading-relaxed text-cocoa-600">{f.a}</p>
    </details>
  );
}

/** All FAQs, grouped. No JavaScript needed: uses the browser's built-in open/close. */
export function FaqList() {
  return (
    <div className="space-y-10">
      {FAQ_GROUPS.map((g) => (
        <section key={g} id={g.toLowerCase().replace(/[^a-z0-9]+/g, "-")} className="scroll-mt-24">
          <h2 className="text-3xl">{g}</h2>
          <div className="mt-4 space-y-3">
            {FAQS.filter((f) => f.group === g).map((f) => <Item key={f.q} f={f} />)}
          </div>
        </section>
      ))}
    </div>
  );
}

/** A short list for the home page. */
export function FaqShort({ qs }: { qs: string[] }) {
  return (
    <div className="space-y-3">
      {FAQS.filter((f) => qs.includes(f.q)).map((f) => <Item key={f.q} f={f} />)}
    </div>
  );
}
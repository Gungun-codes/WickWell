// FILE PATH: wickwell/components/InfoPage.tsx  (replace/create this file in your project)
import { SupportCard } from "./SupportCard";
import { SITE } from "@/lib/site";

export type Block = { h: string; p?: string[]; ul?: string[]; note?: string };

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Shared layout for policy / info pages: heading, optional summary, numbered sections, help box. */
export function InfoPage({
  title, intro, blocks, highlights, updated = true, support = true, numbered = false,
}: {
  title: string; intro?: string; blocks: Block[]; highlights?: { t: string; d: string }[];
  updated?: boolean; support?: boolean; numbered?: boolean;
}) {
  return (
    <main className="container-lume max-w-3xl py-10 md:py-16">
      <h1 className="text-5xl sm:text-6xl">{title}</h1>
      {intro && <p className="mt-4 max-w-2xl text-lg/relaxed text-cocoa-600">{intro}</p>}
      {updated && <p className="mt-3 text-xs text-cocoa-600">Last updated {SITE.lastUpdated}</p>}

      {highlights && (
        <ul className="mt-8 grid gap-3 sm:grid-cols-3">
          {highlights.map((h) => (
            <li key={h.t} className="rounded-card bg-cream-50 p-4 shadow-soft">
              <p className="font-display text-2xl">{h.t}</p>
              <p className="mt-1 text-sm text-cocoa-600">{h.d}</p>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10 space-y-9">
        {blocks.map((b, i) => (
          <section key={b.h} id={slug(b.h)} className="scroll-mt-24">
            <h2 className="text-3xl">{numbered ? `${i + 1}. ` : ""}{b.h}</h2>
            <div className="mt-3 space-y-3 leading-relaxed text-cocoa-600">
              {b.p?.map((t) => <p key={t}>{t}</p>)}
              {b.ul && (
                <ul className="list-disc space-y-1.5 pl-5 marker:text-wine-600">
                  {b.ul.map((t) => <li key={t}>{t}</li>)}
                </ul>
              )}
              {b.note && <p className="rounded-lg bg-blush-200/60 px-4 py-3 text-sm">{b.note}</p>}
            </div>
          </section>
        ))}
      </div>

      {support && <SupportCard />}
    </main>
  );
}
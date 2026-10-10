// FILE PATH: wickwell/components/Footer.tsx  (replace/create this file in your project)
import Link from "next/link";

const cols = [
  { title: "Shop", links: [["All candles", "/shop"], ["New arrivals", "/shop?sort=new"], ["Best sellers", "/shop?sort=best"], ["Gift sets", "/gifts"]] },
  { title: "Help", links: [["Contact us", "/contact"], ["FAQs", "/faqs"], ["Shipping", "/shipping"], ["Returns", "/returns"]] },
  { title: "About", links: [["Our story", "/our-story"], ["Ingredients", "/ingredients"], ["Sustainability", "/sustainability"]] },
];

export function Footer() {
  return (
    <footer className="bg-blush-200 pb-24 pt-10 md:pb-10">
      <div className="container-lume grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-[1.2fr_repeat(3,1fr)]">
        <div className="col-span-2 md:col-span-1">
          <p className="font-display text-3xl">WickWell</p>
          <p className="mt-1 text-sm text-cocoa-600">Candles for every version of you.</p>
        </div>
        {cols.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <p className="text-sm font-medium">{c.title}</p>
            <ul className="mt-2 text-sm text-cocoa-600">
              {c.links.map(([label, href]) => (
                <li key={href}><Link href={href} className="block py-2.5 hover:text-wine-600 md:py-1.5">{label}</Link></li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <p className="container-lume mt-10 text-xs text-cocoa-600">© {new Date().getFullYear()} WickWell. All rights reserved.</p>
    </footer>
  );
}
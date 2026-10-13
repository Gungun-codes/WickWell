// FILE PATH: wickwell/components/Footer.tsx  (replace/create this file in your project)
import Link from "next/link";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { InstagramIcon } from "./InstagramIcon";
import { SITE, instagramLink, whatsappLink } from "@/lib/site";

const cols = [
  { title: "Shop", links: [["All candles", "/shop"], ["New arrivals", "/shop?sort=new"], ["Best sellers", "/shop?sort=best"], ["Gift sets", "/gifts"]] },
  { title: "Help", links: [["FAQs", "/faqs"], ["Shipping & delivery", "/shipping"], ["Returns & refunds", "/returns"], ["Contact us", "/contact"]] },
  { title: "About", links: [["Our story", "/our-story"], ["Ingredients", "/ingredients"], ["Sustainability", "/sustainability"]] },
];

const legal = [["Terms & conditions", "/terms"], ["Privacy policy", "/privacy"], ["Returns & refunds", "/returns"]];

export function Footer() {
  const wa = whatsappLink();
  const link = "inline-flex min-h-10 items-center gap-2 hover:text-wine-600";
  return (
    <footer className="bg-blush-200 pb-24 pt-10 md:pb-10">
      <div className="container-lume grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="col-span-2 md:col-span-1">
          <p className="font-display text-3xl">{SITE.name}</p>
          <p className="mt-1 text-sm text-cocoa-600">{SITE.tagline}.</p>
          <ul className="mt-4 text-sm text-cocoa-600">
            {wa && <li><a href={wa} target="_blank" rel="noopener noreferrer" className={link}><MessageCircle size={16} aria-hidden /> WhatsApp us</a></li>}
            {SITE.phone && <li><a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className={link}><Phone size={16} aria-hidden /> {SITE.phone}</a></li>}
            <li><a href={`mailto:${SITE.email}`} className={`${link} break-all`}><Mail size={16} aria-hidden /> {SITE.email}</a></li>
            {instagramLink && <li><a href={instagramLink} target="_blank" rel="noopener noreferrer" className={link}><InstagramIcon size={16} /> @{SITE.instagram.replace(/^@/, "")}</a></li>}
            {SITE.city && <li className="inline-flex min-h-10 items-center gap-2"><MapPin size={16} aria-hidden /> {SITE.city}</li>}
          </ul>
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

      <div className="container-lume mt-10 flex flex-col gap-3 border-t border-cocoa-900/10 pt-6 text-xs text-cocoa-600 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
        <ul className="flex flex-wrap gap-x-5">
          {legal.map(([label, href]) => (
            <li key={href}><Link href={href} className="inline-flex min-h-10 items-center hover:text-wine-600">{label}</Link></li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
// FILE PATH: wickwell/app/contact/page.tsx  (replace/create this file in your project)
import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { InstagramIcon } from "@/components/InstagramIcon";
import { SITE, instagramLink, whatsappLink } from "@/lib/site";

export const metadata: Metadata = { title: "Contact us", description: "Talk to WickWell about an order, a gift or a custom request." };

export default function ContactPage() {
  const wa = whatsappLink();
  const cards = [
    wa && { Icon: MessageCircle, t: "WhatsApp", d: "The fastest way to reach us", href: wa, label: "Chat with us", ext: true },
    { Icon: Mail, t: "Email", d: SITE.email, href: `mailto:${SITE.email}`, label: "Send an email" },
    SITE.phone && { Icon: Phone, t: "Phone", d: SITE.phone, href: `tel:${SITE.phone.replace(/\s/g, "")}`, label: "Call us" },
    instagramLink && { Icon: InstagramIcon, t: "Instagram", d: `@${SITE.instagram.replace(/^@/, "")}`, href: instagramLink, label: "Follow and message us", ext: true },
  ].filter(Boolean) as { Icon: React.ComponentType<{ size?: number; className?: string }>; t: string; d: string; href: string; label: string; ext?: boolean }[];

  return (
    <main className="container-lume max-w-4xl py-10 md:py-16">
      <h1 className="text-5xl sm:text-6xl">Say hello.</h1>
      <p className="mt-4 max-w-2xl text-lg/relaxed text-cocoa-600">
        Questions about an order, help choosing a scent, a gift, or a custom or bulk request? We would love to hear from you.
      </p>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2">
        {cards.map(({ Icon, t, d, href, label, ext }) => (
          <li key={t} className="rounded-card bg-cream-50 p-5 shadow-soft">
            <Icon size={22} className="text-wine-600" aria-hidden />
            <h2 className="mt-3 text-2xl">{t}</h2>
            <p className="mt-1 break-words text-sm text-cocoa-600">{d}</p>
            <a href={href} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="btn-primary mt-4 min-h-11 text-sm">{label}</a>
          </li>
        ))}
      </ul>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="flex gap-3 rounded-card border border-cocoa-900/10 p-5">
          <Clock size={20} className="mt-0.5 shrink-0 text-wine-600" aria-hidden />
          <div><h2 className="text-xl">Support hours</h2><p className="mt-1 text-sm text-cocoa-600">{SITE.supportHours}. We usually reply within one working day.</p></div>
        </div>
        {(SITE.address || SITE.city) && (
          <div className="flex gap-3 rounded-card border border-cocoa-900/10 p-5">
            <MapPin size={20} className="mt-0.5 shrink-0 text-wine-600" aria-hidden />
            <div><h2 className="text-xl">Based in</h2><p className="mt-1 text-sm text-cocoa-600">{SITE.address || SITE.city}</p></div>
          </div>
        )}
      </div>

      <section className="mt-10 rounded-card bg-blush-200 p-6">
        <h2 className="text-2xl">Writing about an order?</h2>
        <p className="mt-2 text-sm text-cocoa-600">Please include your order number, and the email or phone number you used, so we can help faster. For damaged items, add photos too.</p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl">Grievance officer</h2>
        <p className="mt-2 text-sm text-cocoa-600">
          For complaints under the Consumer Protection (E-Commerce) Rules, 2020: {SITE.grievance.name ? `${SITE.grievance.name}, ` : ""}{SITE.grievance.email || SITE.email}
          {SITE.grievance.phone ? `, ${SITE.grievance.phone}` : ""}. We acknowledge complaints within 48 hours and aim to resolve them within one month.
        </p>
      </section>
    </main>
  );
}
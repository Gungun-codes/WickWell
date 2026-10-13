// FILE PATH: wickwell/components/SupportCard.tsx  (replace/create this file in your project)
import Link from "next/link";
import { MessageCircle, Mail } from "lucide-react";
import { SITE, whatsappLink } from "@/lib/site";

/** "Still stuck?" box. Shows only the contact channels you have filled in. */
export function SupportCard({ title = "Still have a question?" }: { title?: string }) {
  const wa = whatsappLink();
  return (
    <aside className="mt-12 rounded-card bg-blush-200 p-6 text-center sm:p-8">
      <h2 className="text-3xl">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-cocoa-600">
        Write to us and a real person will reply. Please include your order number if it is about an order.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-3">
        {wa && (
          <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-primary min-h-12">
            <MessageCircle size={18} aria-hidden /> WhatsApp us
          </a>
        )}
        <a href={`mailto:${SITE.email}`} className="btn-ghost min-h-12 text-cocoa-900">
          <Mail size={18} aria-hidden /> {SITE.email}
        </a>
        <Link href="/contact" className="btn-ghost min-h-12 text-cocoa-900">All contact details</Link>
      </div>
      <p className="mt-4 text-xs text-cocoa-600">{SITE.supportHours}</p>
    </aside>
  );
}
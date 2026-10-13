// FILE PATH: wickwell/components/WhatsAppButton.tsx  (replace/create this file in your project)
"use client";
import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";

/** Floating chat button. Pass the link from the server layout so the number lives in lib/site.ts only. */
export function WhatsAppButton({ href }: { href: string | null }) {
  const path = usePathname();
  if (!href) return null;
  if (["/checkout", "/order", "/admin", "/cart"].some((p) => path.startsWith(p))) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-[4.75rem] right-4 z-30 grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 md:bottom-6 md:right-6"
    >
      <MessageCircle size={26} aria-hidden />
    </a>
  );
}
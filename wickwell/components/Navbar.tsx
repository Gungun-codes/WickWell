// FILE PATH: wickwell/components/Navbar.tsx  (replace/create this file in your project)
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, User, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/scent-finder", label: "Scent Finder" },
  { href: "/gifts", label: "Gift" },
  { href: "/our-story", label: "Our Story" },
];

/** Overlays the dark hero on the home page; solid cream bar everywhere else. */
export function Navbar() {
  const path = usePathname();
  const { count, ready } = useCart();
  const overlay = path === "/";

  return (
    <header
      className={
        overlay
          ? "absolute inset-x-0 top-0 z-20 text-cream-50"
          : "sticky top-0 z-20 border-b border-blush-200 bg-cream-100/90 text-cocoa-900 backdrop-blur"
      }
    >
      <div className="container-lume flex h-16 items-center justify-between">
        <Link href="/" className="font-display text-3xl leading-none py-2">WickWell</Link>

        <nav className="hidden gap-8 text-sm md:flex" aria-label="Main">
          {links.map((l) => {
            const active = l.href === "/" ? path === "/" : path.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={active ? "font-medium" : "opacity-80 hover:opacity-100"}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="-mr-2 flex items-center gap-1">
          <Link href="/search" aria-label="Search" className="grid size-11 place-items-center"><Search size={20} /></Link>
          <Link href="/account" aria-label="Account" className="hidden size-11 place-items-center md:grid"><User size={20} /></Link>
          <Link href="/cart" aria-label={`Cart${ready && count ? `, ${count} items` : ""}`} className="relative grid size-11 place-items-center">
            <ShoppingBag size={20} />
            {ready && count > 0 && (
              <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-wine-600 text-[10px] font-medium text-cream-50">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
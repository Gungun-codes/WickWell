"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Store, Sparkles, ShoppingBag, User } from "lucide-react";

const tabs = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/shop", label: "Shop", Icon: Store },
  { href: "/scent-finder", label: "Quiz", Icon: Sparkles },
  { href: "/cart", label: "Cart", Icon: ShoppingBag },
  { href: "/account", label: "Profile", Icon: User },
];

/** Mobile-only tab bar, as in the reference phone screens. */
export function BottomNav() {
  const path = usePathname();
  return (
    <nav
      aria-label="Tabs"
      className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-blush-200 bg-cream-50/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      {tabs.map(({ href, label, Icon }) => {
        const active = href === "/" ? path === "/" : path.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex flex-col items-center gap-0.5 py-2 text-[11px] ${
              active ? "text-wine-600" : "text-cocoa-600"
            }`}
          >
            <Icon size={20} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

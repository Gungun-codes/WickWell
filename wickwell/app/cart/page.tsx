// FILE PATH: wickwell/app/cart/page.tsx  (replace/create this file in your project)
"use client";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { rupees } from "@/lib/format";
import { FREE_SHIPPING_ABOVE_PAISE, shippingFor } from "@/lib/pricing";

export default function CartPage() {
  const { lines, ready, subtotalPaise, setQty, remove } = useCart();
  const shipping = shippingFor(subtotalPaise);

  if (!ready) return <main className="container-lume py-16"><p className="text-cocoa-600">Loading your bag…</p></main>;

  if (!lines.length) {
    return (
      <main className="container-lume py-16 text-center">
        <h1 className="text-4xl">Your bag is empty.</h1>
        <p className="mt-3 text-cocoa-600">Find a scent that fits your mood.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/shop" className="btn-primary">Shop candles</Link>
          <Link href="/scent-finder" className="btn-ghost">Find my scent</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container-lume py-10 pb-28 md:py-14 md:pb-14">
      <h1 className="text-4xl sm:text-5xl">Your bag</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <ul className="space-y-3">
          {lines.map((l) => (
            <li key={l.variantId} className="flex gap-4 rounded-card bg-cream-50 p-3 shadow-soft">
              <Link href={`/shop/${l.slug}`} className="relative size-24 shrink-0 overflow-hidden rounded-lg">
                <Image src={l.image ?? `/${l.slug}.png`} alt="" fill sizes="96px" className="object-cover" />
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between gap-3">
                  <div>
                    <Link href={`/shop/${l.slug}`} className="font-medium">{l.name}</Link>
                    <p className="text-xs text-cocoa-600">{l.size}</p>
                  </div>
                  <p className="text-sm font-medium">{rupees(l.pricePaise * l.qty)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-md border border-cocoa-900/15">
                    <button aria-label={`Decrease ${l.name} quantity`} className="grid size-10 place-items-center" onClick={() => setQty(l.variantId, l.qty - 1)}><Minus size={14} /></button>
                    <span className="w-6 text-center text-sm">{l.qty}</span>
                    <button aria-label={`Increase ${l.name} quantity`} className="grid size-10 place-items-center" onClick={() => setQty(l.variantId, l.qty + 1)}><Plus size={14} /></button>
                  </div>
                  <button aria-label={`Remove ${l.name}`} className="grid size-10 place-items-center text-cocoa-600 hover:text-wine-600" onClick={() => remove(l.variantId)}><Trash2 size={16} /></button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-card bg-cream-50 p-6 shadow-soft">
          <h2 className="text-2xl">Summary</h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-cocoa-600">Subtotal</dt><dd>{rupees(subtotalPaise)}</dd></div>
            <div className="flex justify-between"><dt className="text-cocoa-600">Shipping</dt><dd>{shipping ? rupees(shipping) : "Free"}</dd></div>
          </dl>
          {shipping > 0 && (
            <p className="mt-3 text-xs text-cocoa-600">
              Add {rupees(FREE_SHIPPING_ABOVE_PAISE - subtotalPaise)} more for free shipping.
            </p>
          )}
          <div className="mt-5 flex justify-between border-t border-cocoa-900/10 pt-4 font-medium">
            <span>Total</span><span>{rupees(subtotalPaise + shipping)}</span>
          </div>
          <Link href="/checkout" className="btn-primary mt-6 hidden w-full md:inline-flex">Checkout</Link>
        </aside>
      </div>

      {/* phones: always-visible checkout bar, sits above the tab bar */}
      <div className="fixed inset-x-0 bottom-14 z-20 border-t border-blush-200 bg-cream-50/95 p-3 pb-3 backdrop-blur md:hidden">
        <Link href="/checkout" className="btn-primary w-full min-h-12">Checkout · {rupees(subtotalPaise + shipping)}</Link>
      </div>
    </main>
  );
}
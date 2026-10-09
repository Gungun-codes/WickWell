"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/cart";
import { rupees } from "@/lib/format";
import type { Variant } from "@/lib/queries";

type Props = { slug: string; name: string; image: string | null; variants: Variant[] };

export function AddToCart({ slug, name, image, variants }: Props) {
  const router = useRouter();
  const { add } = useCart();
  const firstInStock = variants.find((v) => v.stock > 0) ?? variants[0];
  const [variantId, setVariantId] = useState(firstInStock?.id);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const v = variants.find((x) => x.id === variantId);
  if (!v) return null;
  const soldOut = v.stock <= 0;
  const line = { variantId: v.id, slug, name, size: v.size_label, pricePaise: v.price_paise, image };

  return (
    <div>
      <p className="font-display text-3xl">{rupees(v.price_paise)}</p>

      <fieldset className="mt-6">
        <legend className="text-sm font-medium">Size</legend>
        <div className="mt-2 flex gap-2">
          {variants.map((x) => (
            <label key={x.id} className="cursor-pointer">
              <input
                type="radio" name="size" className="peer sr-only"
                checked={x.id === variantId}
                onChange={() => { setVariantId(x.id); setQty(1); }}
                disabled={x.stock <= 0}
              />
              <span className="block rounded-md border border-cocoa-900/15 px-4 py-2 text-sm peer-checked:border-wine-600 peer-checked:bg-wine-600/5 peer-checked:text-wine-600 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-wine-600 peer-disabled:opacity-40">
                {x.size_label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-6 flex items-center gap-3">
        <span className="text-sm font-medium">Quantity</span>
        <div className="flex items-center rounded-md border border-cocoa-900/15">
          <button type="button" aria-label="Decrease quantity" className="p-2.5" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus size={14} /></button>
          <span className="w-8 text-center text-sm" aria-live="polite">{qty}</span>
          <button type="button" aria-label="Increase quantity" className="p-2.5" onClick={() => setQty((q) => Math.min(Math.min(10, v.stock || 1), q + 1))}><Plus size={14} /></button>
        </div>
        {!soldOut && v.stock <= 5 && <span className="text-xs text-wine-600">Only {v.stock} left</span>}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button" disabled={soldOut} className="btn-primary min-w-40 disabled:opacity-40"
          onClick={() => { add(line, qty); setAdded(true); setTimeout(() => setAdded(false), 1600); }}
        >
          {soldOut ? "Sold out" : added ? "Added to cart" : "Add to cart"}
        </button>
        <button
          type="button" disabled={soldOut} className="btn-ghost disabled:opacity-40"
          onClick={() => { add(line, qty); router.push("/checkout"); }}
        >
          Buy now
        </button>
      </div>
    </div>
  );
}
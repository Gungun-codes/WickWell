"use client";
import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/lib/cart";
import { productImage } from "@/lib/images";
import type { ProductCardData } from "@/lib/queries";

/** Adds the smallest in-stock size straight from a product card. */
export function QuickAdd({ p }: { p: ProductCardData }) {
  const { add } = useCart();
  const [done, setDone] = useState(false);
  const v = p.variants.find((x) => x.stock > 0);

  return (
    <button
      type="button"
      disabled={!v}
      aria-label={v ? `Add ${p.name} ${v.size_label} to cart` : `${p.name} is sold out`}
      onClick={() => {
        if (!v) return;
        add({
          variantId: v.id, slug: p.slug, name: p.name, size: v.size_label,
          pricePaise: v.price_paise, image: productImage(p.slug, p.image_ids, 0, 200),
        });
        setDone(true);
        setTimeout(() => setDone(false), 1400);
      }}
      className="grid size-9 place-items-center rounded-md bg-wine-600 text-cream-50 hover:bg-wine-700 disabled:cursor-not-allowed disabled:opacity-40"
    >
      {done ? <Check size={16} /> : <ShoppingBag size={16} />}
    </button>
  );
}
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { productImage } from "@/lib/images";
import { rupees } from "@/lib/format";
import type { ProductCardData } from "@/lib/queries";
import { QuickAdd } from "./QuickAdd";

export function ProductCard({ p }: { p: ProductCardData }) {
  const from = p.variants[0]?.price_paise;
  const soldOut = p.variants.every((v) => v.stock <= 0);

  return (
    <article className="overflow-hidden rounded-card bg-cream-50 shadow-soft">
      <Link href={`/shop/${p.slug}`} className="block">
        <div className="relative aspect-square">
          <Image
            src={productImage(p.slug, p.image_ids, 0, 600)!}
            alt={`${p.name} candle`}
            fill
            sizes="(min-width:1024px) 25vw, 50vw"
            className="object-cover"
          />
          {soldOut && (
            <span className="absolute left-2 top-2 rounded bg-cocoa-900/80 px-2 py-0.5 text-xs text-cream-50">
              Sold out
            </span>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-sans text-sm font-medium tracking-normal">{p.name}</h3>
          <p className="mt-0.5 text-xs text-cocoa-600">{p.notes.join(" · ")}</p>
        </div>
      </Link>

      <div className="flex items-end justify-between px-3 pb-3">
        <div>
          {from != null && <p className="text-sm font-medium">{rupees(from)}</p>}
          {p.avg_rating && (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-cocoa-600">
              <Star size={12} className="fill-gold-400 text-gold-400" aria-hidden />
              {p.avg_rating} ({p.review_count})
            </p>
          )}
        </div>
        <QuickAdd p={p} />
      </div>
    </article>
  );
}
import Link from "next/link";
import { ProductCard } from "./ProductCard";
import type { ProductCardData } from "@/lib/queries";

export function BestSellers({ products }: { products: ProductCardData[] }) {
  if (!products.length) return null;
  return (
    <section className="container-lume py-12">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-3xl">Best sellers</h2>
          <p className="mt-1 text-sm text-cocoa-600">Fan favourites, for a reason.</p>
        </div>
        <Link href="/shop" className="text-sm text-wine-600 underline-offset-4 hover:underline">
          View all
        </Link>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {products.map((p) => <ProductCard key={p.id} p={p} />)}
      </div>
    </section>
  );
}

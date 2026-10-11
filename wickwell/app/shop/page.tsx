// FILE PATH: wickwell/app/shop/page.tsx  (replace/create this file in your project)
import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { ShopFilterDrawer } from "@/components/ShopFilterDrawer";
import { getMoods, getOccasions, getProducts } from "@/lib/queries";

export const metadata: Metadata = { title: "Shop candles" };

type SP = { mood?: string; occasion?: string; sort?: string };

export default async function ShopPage({ searchParams }: { searchParams: SP }) {
  const [products, moods, occasions] = await Promise.all([
    getProducts(searchParams),
    getMoods(),
    getOccasions(),
  ]);

  return (
    <main className="container-lume py-10 md:py-14">
      <h1 className="text-4xl sm:text-5xl">Find your next favourite scent.</h1>

      <ShopFilterDrawer filters={searchParams} moods={moods} occasions={occasions} />

      <p className="mt-6 text-sm text-cocoa-600" aria-live="polite">
        {products.length} {products.length === 1 ? "candle" : "candles"}
      </p>

      {products.length ? (
        <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {products.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      ) : (
        <div className="mt-6 rounded-card bg-cream-50 p-8 text-center shadow-soft">
          <p className="font-display text-2xl">Nothing matches those filters.</p>
          <Link href="/shop" className="btn-primary mt-4">Clear filters</Link>
        </div>
      )}
    </main>
  );
}
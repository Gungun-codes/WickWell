import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getMoods, getOccasions, getProducts } from "@/lib/queries";

export const metadata: Metadata = { title: "Shop candles" };

type SP = { mood?: string; occasion?: string; sort?: string };

const sorts = [
  { value: "new", label: "Newest" },
  { value: "best", label: "Best sellers" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

function href(sp: SP, patch: Partial<SP>) {
  const next = { ...sp, ...patch };
  const qs = new URLSearchParams(Object.entries(next).filter(([, v]) => v) as [string, string][]);
  return qs.size ? `/shop?${qs}` : "/shop";
}

const chip = (active: boolean) =>
  `rounded-full border px-3.5 py-1.5 text-sm transition ${
    active ? "border-wine-600 bg-wine-600 text-cream-50" : "border-cocoa-900/15 hover:border-wine-600 hover:text-wine-600"
  }`;

export default async function ShopPage({ searchParams }: { searchParams: SP }) {
  const [products, moods, occasions] = await Promise.all([
    getProducts(searchParams),
    getMoods(),
    getOccasions(),
  ]);

  return (
    <main className="container-lume py-10 md:py-14">
      <h1 className="text-4xl sm:text-5xl">Find your next favourite scent.</h1>

      <div className="mt-8 space-y-4">
        <div>
          <p className="mb-2 text-sm font-medium">Mood</p>
          <div className="flex flex-wrap gap-2">
            <Link href={href(searchParams, { mood: undefined })} className={chip(!searchParams.mood)}>All</Link>
            {moods.map((m) => (
              <Link key={m.slug} href={href(searchParams, { mood: m.slug })} className={chip(searchParams.mood === m.slug)}>
                {m.name}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium">Occasion</p>
          <div className="flex flex-wrap gap-2">
            <Link href={href(searchParams, { occasion: undefined })} className={chip(!searchParams.occasion)}>Any</Link>
            {occasions.map((o) => (
              <Link key={o.slug} href={href(searchParams, { occasion: o.slug })} className={chip(searchParams.occasion === o.slug)}>
                {o.name}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium">Sort by</p>
          <div className="flex flex-wrap gap-2">
            {sorts.map((s) => (
              <Link key={s.value} href={href(searchParams, { sort: s.value })} className={chip((searchParams.sort ?? "new") === s.value)}>
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <p className="mt-8 text-sm text-cocoa-600" aria-live="polite">
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
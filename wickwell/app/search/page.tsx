import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/lib/queries";

export const metadata: Metadata = { title: "Search" };

const tags = ["Rose", "Vanilla", "Eucalyptus", "Coffee", "Floral", "Woody"];

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q?.trim() ?? "";
  const results = q ? await getProducts({ q }) : [];

  return (
    <main className="container-lume py-10 md:py-14">
      <h1 className="text-4xl sm:text-5xl">Find a candle</h1>

      <form action="/search" className="mt-6 flex max-w-xl gap-2" role="search">
        <label htmlFor="q" className="sr-only">Search candles</label>
        <input id="q" name="q" defaultValue={q} placeholder="Search by name, scent note or family"
          className="min-w-0 flex-1 rounded-md border border-cocoa-900/15 bg-white px-4 py-3 text-sm outline-none focus:border-wine-600" />
        <button className="btn-primary" aria-label="Search"><Search size={18} /></button>
      </form>

      {!q && (
        <div className="mt-6 flex flex-wrap gap-2">
          {tags.map((t) => (
            <Link key={t} href={`/search?q=${t}`} className="rounded-full border border-cocoa-900/15 px-3.5 py-1.5 text-sm hover:border-wine-600 hover:text-wine-600">{t}</Link>
          ))}
        </div>
      )}

      {q && (
        <>
          <p className="mt-8 text-sm text-cocoa-600" aria-live="polite">
            {results.length} {results.length === 1 ? "result" : "results"} for “{q}”
          </p>
          {results.length ? (
            <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {results.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          ) : (
            <p className="mt-4 text-cocoa-600">Nothing found. Try a scent like rose or vanilla, or <Link href="/scent-finder" className="text-wine-600 underline">take the scent quiz</Link>.</p>
          )}
        </>
      )}
    </main>
  );
}
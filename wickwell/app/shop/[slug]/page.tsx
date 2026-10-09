import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, Leaf, Flame, Star } from "lucide-react";
import { AddToCart } from "@/components/AddToCart";
import { ProductCard } from "@/components/ProductCard";
import { productImage } from "@/lib/images";
import { getProductBySlug, getRelated, getReviews } from "@/lib/queries";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await getProductBySlug(params.slug);
  if (!p) return { title: "Candle not found" };
  return { title: p.name, description: p.tagline ?? undefined };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const p = await getProductBySlug(params.slug);
  if (!p) notFound();

  const [reviews, related] = await Promise.all([getReviews(p.id), getRelated(p.id)]);
  const ids: (string | null)[] = p.image_ids?.length ? p.image_ids : [null];
  const images = ids
    .map((_id, i) => productImage(p.slug, p.image_ids, i, 900))
    .filter((x): x is string => !!x);
  const avg = reviews.length ? reviews.reduce((n: number, r: { rating: number }) => n + r.rating, 0) / reviews.length : null;

  return (
    <main className="container-lume py-8 md:py-12">
      <Link href="/shop" className="text-sm text-wine-600 hover:underline">← All candles</Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-card shadow-soft">
            <Image src={images[0]} alt={`${p.name} candle`} fill priority sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
          </div>
          {images.length > 1 && (
            <ul className="grid grid-cols-4 gap-3">
              {images.slice(1, 5).map((src) => (
                <li key={src} className="relative aspect-square overflow-hidden rounded-lg">
                  <Image src={src} alt="" fill sizes="12vw" className="object-cover" />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h1 className="text-4xl sm:text-5xl">{p.name}</h1>
          <p className="mt-2 text-sm text-cocoa-600">{p.notes.join(" · ")}</p>
          {avg && (
            <p className="mt-2 flex items-center gap-1.5 text-sm">
              <Star size={14} className="fill-gold-400 text-gold-400" aria-hidden />
              {avg.toFixed(1)} <span className="text-cocoa-600">({reviews.length} reviews)</span>
            </p>
          )}
          {p.tagline && <p className="mt-5 max-w-md text-cocoa-600">{p.tagline}</p>}
          {p.description && <p className="mt-3 max-w-md text-sm/relaxed text-cocoa-600">{p.description}</p>}

          <div className="mt-8">
            <AddToCart slug={p.slug} name={p.name} image={productImage(p.slug, p.image_ids, 0, 200)} variants={p.variants} />
          </div>

          <ul className="mt-10 grid grid-cols-3 gap-3 border-t border-cocoa-900/10 pt-6 text-xs text-cocoa-600">
            <li className="flex flex-col items-center gap-1.5 text-center"><Clock size={18} />Up to {p.burn_hours ?? 50} hours</li>
            <li className="flex flex-col items-center gap-1.5 text-center"><Leaf size={18} />Non-toxic and safe</li>
            <li className="flex flex-col items-center gap-1.5 text-center"><Flame size={18} />Hand-poured</li>
          </ul>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="text-3xl">Reviews</h2>
        {reviews.length ? (
          <ul className="mt-5 grid gap-3 md:grid-cols-2">
            {reviews.map((r) => (
              <li key={r.id} className="rounded-card bg-cream-50 p-4 shadow-soft">
                <p className="flex gap-0.5" role="img" aria-label={`${r.rating} out of 5 stars`}>
                  {Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={13} className="fill-gold-400 text-gold-400" />)}
                </p>
                {r.title && <p className="mt-2 text-sm font-medium">{r.title}</p>}
                {r.body && <p className="mt-1 text-sm text-cocoa-600">{r.body}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-cocoa-600">No reviews yet. Order this candle and be the first to review it.</p>
        )}
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-3xl">Pairs well with</h2>
          <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {related.map((r) => <ProductCard key={r.id} p={r} />)}
          </div>
        </section>
      )}
    </main>
  );
}
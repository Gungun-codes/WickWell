// FILE PATH: wickwell/components/Reviews.tsx  (replace/create this file in your project)
import { Star } from "lucide-react";

export type HomeReview = {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  reviewer_name: string | null;
  products: { name: string } | { name: string }[] | null;
};

const productName = (p: HomeReview["products"]) => (Array.isArray(p) ? p[0]?.name : p?.name);

/** Real customer reviews only. Hidden until at least one exists. */
export function Reviews({ reviews }: { reviews: HomeReview[] }) {
  if (!reviews.length) return null;
  return (
    <section className="container-lume py-10">
      <h2 className="text-3xl">Real people, real moods</h2>
      <p className="mt-1 text-sm text-cocoa-600">Reviews from verified buyers.</p>
      <ul className="-mx-4 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
        {reviews.map((r) => (
          <li key={r.id} className="w-[78%] shrink-0 snap-start rounded-card bg-cream-50 p-4 shadow-soft sm:w-auto">
            <div className="flex gap-0.5" role="img" aria-label={`${r.rating} out of 5 stars`}>
              {Array.from({ length: r.rating }).map((_, i) => (
                <Star key={i} size={13} className="fill-gold-400 text-gold-400" />
              ))}
            </div>
            {r.title && <p className="mt-2 text-sm font-medium">{r.title}</p>}
            <p className="mt-1 text-sm">{r.body}</p>
            <p className="mt-3 text-xs text-cocoa-600">
              {r.reviewer_name || "Verified buyer"}
              {productName(r.products) ? ` · ${productName(r.products)}` : ""}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
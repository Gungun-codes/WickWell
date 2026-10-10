// FILE PATH: wickwell/components/Occasions.tsx  (replace/create this file in your project)
import { CollectionTile } from "./CollectionTile";

type Item = { slug: string; name: string; image_id: string | null };

export function Occasions({ items }: { items: Item[] }) {
  if (!items.length) return null;
  return (
    <section className="container-lume py-10">
      <h2 className="text-3xl">Shop by occasion</h2>
      <p className="mt-1 text-sm text-cocoa-600">A scent for every story.</p>
      <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
        {items.map((o) => (
          <li key={o.slug}>
            <CollectionTile slug={o.slug} name={o.name} imageId={o.image_id} href={`/shop?occasion=${o.slug}`} />
          </li>
        ))}
      </ul>
    </section>
  );
}
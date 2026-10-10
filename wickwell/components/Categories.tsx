// FILE PATH: wickwell/components/Categories.tsx  (replace/create this file in your project)
import { CollectionTile } from "./CollectionTile";

type Item = { slug: string; name: string; image_id: string | null };

export function Categories({ items }: { items: Item[] }) {
  if (!items.length) return null;
  return (
    <section className="container-lume py-10">
      <h2 className="text-3xl">Shop by category</h2>
      <p className="mt-1 text-sm text-cocoa-600">Gifts, special moments and everything in between.</p>
      <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {items.map((c) => (
          <li key={c.slug}>
            <CollectionTile slug={`cat-${c.slug}`} name={c.name} imageId={c.image_id} href={`/shop?category=${c.slug}`} />
          </li>
        ))}
      </ul>
    </section>
  );
}
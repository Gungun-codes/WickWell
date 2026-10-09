import Image from "next/image";
import Link from "next/link";
import { cld } from "@/lib/cloudinary";

type Occasion = { slug: string; name: string; image_id: string | null };

function getOccasionImage(o: Occasion) {
  const localImage = `/${o.slug}.png`;
  return o.slug ? localImage : cld(o.image_id, 400);
}

export function Occasions({ items }: { items: Occasion[] }) {
  return (
    <section className="container-lume py-10">
      <h2 className="text-3xl">Shop by occasion</h2>
      <p className="mt-1 text-sm text-cocoa-600">A scent for every story.</p>
      <ul className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-6">
        {items.map((o) => (
          <li key={o.slug}>
            <Link href={`/shop?occasion=${o.slug}`} className="group block">
              <span className="relative block aspect-[4/3] overflow-hidden rounded-card">
                <Image
                  src={getOccasionImage(o)}
                  alt={o.name}
                  fill
                  sizes="(min-width:768px) 16vw, 50vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </span>
              <span className="mt-2 block text-center text-sm">{o.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

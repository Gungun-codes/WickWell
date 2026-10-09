import Image from "next/image";
import Link from "next/link";
import { cld } from "@/lib/cloudinary";

type Mood = { slug: string; name: string; image_id: string | null };

function getMoodImage(m: Mood) {
  const localPath = `/${m.slug}.png`;
  return m.slug ? localPath : cld(m.image_id, 300);
}

export function MoodStrip({ moods }: { moods: Mood[] }) {
  return (
    <section className="bg-blush-200 py-10">
      <div className="container-lume">
        <h2 className="text-center text-3xl">What do you want to feel today?</h2>
        <p className="mt-2 text-center text-sm text-cocoa-600">Pick a vibe and find your perfect scent.</p>

        <ul className="mt-8 flex snap-x gap-4 overflow-x-auto pb-2 md:justify-center [scrollbar-width:none]">
          {moods.map((m) => (
            <li key={m.slug} className="w-24 shrink-0 snap-start sm:w-28">
              <Link href={`/scent-finder?mood=${m.slug}`} className="group block text-center">
                <span className="relative block aspect-[3/4] overflow-hidden rounded-t-full rounded-b-lg">
                  <Image
                    src={getMoodImage(m)}
                    alt={m.name}
                    fill
                    sizes="112px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </span>
                <span className="mt-2 block text-sm">{m.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

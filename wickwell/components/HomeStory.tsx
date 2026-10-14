import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { STORY } from "@/lib/story";

export function HomeStory() {
  const alt = STORY.photoAlt || (SITE.founder.name ? `${SITE.founder.name}, founder of ${SITE.name}` : `The maker behind ${SITE.name}`);

  return (
    <section className="container-lume max-w-3xl py-12">
      <h2 className="text-3xl">Our story</h2>
      <div className="mt-6 grid overflow-hidden rounded-card bg-cream-50 shadow-soft md:grid-cols-2">
        <div className="relative aspect-[4/3] bg-blush-200 md:aspect-auto md:min-h-64">
          <Image
            src={STORY.photo}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 384px"
            className="object-cover"
          />
        </div>
        <div className="p-6 sm:p-8">
          <p className="text-lg/relaxed text-cocoa-600">
            WickWell began with a simple idea: scent should feel like a companion, not just a fragrance. We create small-batch, hand-poured candles that turn quiet moments into rituals.
          </p>
          <Link href="/our-story" className="mt-5 inline-flex min-h-11 items-center text-sm text-wine-600 hover:underline">
            Read our story →
          </Link>
        </div>
      </div>
    </section>
  );
}

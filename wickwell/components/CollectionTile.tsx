// FILE PATH: wickwell/components/CollectionTile.tsx  (replace/create this file in your project)
"use client";
import { useState } from "react";
import Link from "next/link";
import { cld } from "@/lib/cloudinary";
import { SafeImage } from "./SafeImage";

type Props = { slug: string; name: string; imageId: string | null; imageUrl: string | null; href: string; ratio?: string };

const HAS_CLOUD = !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

/** Prefer the table's image URL, then a Cloudinary upload, then /public/<slug>.png. */
export function CollectionTile({ slug, name, imageId, imageUrl, href, ratio = "aspect-[4/3]" }: Props) {
  const [broken, setBroken] = useState(false);
  const directUrl = imageUrl?.trim();
  const src = directUrl && /^https?:\/\//i.test(directUrl)
    ? directUrl
    : imageId && HAS_CLOUD
      ? cld(imageId, 500)
      : `/${slug}.png`;

  return (
    <Link href={href} className="group block">
      <span className={`relative block ${ratio} overflow-hidden rounded-card bg-gradient-to-br from-wine-700 via-wine-900 to-cocoa-900`}>
        {!broken && (
          <SafeImage
            src={src}
            alt=""
            fill
            sizes="(min-width:1024px) 16vw, 50vw"
            onError={() => setBroken(true)}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        {broken && (
          <span className="absolute inset-0 grid place-items-center px-2 text-center font-display text-2xl text-cream-50/90">{name}</span>
        )}
      </span>
      {!broken && <span className="mt-2 block text-center text-sm">{name}</span>}
    </Link>
  );
}
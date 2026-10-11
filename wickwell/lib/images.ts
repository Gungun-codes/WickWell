// FILE PATH: wickwell/lib/images.ts  (replace/create this file in your project)
import { cld } from "./cloudinary";

const HAS_CLOUD = !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

/**
 * All photos for a product, best first:
 *   1. image_url   (a link pasted into the Supabase products table or the admin page)
 *   2. image_ids   (Cloudinary public ids uploaded from the admin)
 *   3. /public/<slug>.png  (the old way, only if nothing else is set)
 */
export function productImages(slug: string, imageIds?: string[] | null, width = 800, imageUrl?: string | null): string[] {
  const out: string[] = [];
  const link = imageUrl?.trim();
  if (link && /^https?:\/\//i.test(link)) out.push(link);
  if (HAS_CLOUD) for (const id of imageIds ?? []) if (id) out.push(cld(id, width));
  if (!out.length) out.push(`/${slug}.png`);
  return out;
}

export function productImage(slug: string, imageIds?: string[] | null, index = 0, width = 800, imageUrl?: string | null) {
  return productImages(slug, imageIds, width, imageUrl)[index] ?? null;
}
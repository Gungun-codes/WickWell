import { cld } from "./cloudinary";

const HAS_CLOUD = !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

/** Cloudinary when an id + cloud name exist, else the local /public/<slug>.png fallback. */
export function productImage(slug: string, imageIds: string[] | null | undefined, index = 0, width = 800) {
  const id = imageIds?.[index];
  if (id && HAS_CLOUD) return cld(id, width);
  return index === 0 ? `/${slug}.png` : null;
}
const CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

/** Build a Cloudinary URL from a public_id. Upload once, transform on the fly. */
export function cld(publicId: string | null | undefined, width = 800) {
  if (!publicId || !CLOUD) return "/placeholder-candle.svg";
  return `https://res.cloudinary.com/${CLOUD}/image/upload/f_auto,q_auto,w_${width}/${publicId}`;
}

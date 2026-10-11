// FILE PATH: wickwell/components/SafeImage.tsx  (replace/create this file in your project)
import Image, { type ImageProps } from "next/image";

/** next/image, but any link that is not from Cloudinary is shown as-is instead of crashing on an unknown host. */
export function SafeImage(props: ImageProps) {
  const src = typeof props.src === "string" ? props.src : "";
  const external = /^https?:\/\//i.test(src) && !/^https:\/\/res\.cloudinary\.com\//i.test(src);
  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image {...props} unoptimized={external || props.unoptimized} />;
}
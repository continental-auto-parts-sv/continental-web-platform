import type { SanityImageSource } from "@sanity/image-url";
import { Image } from "next-sanity/image";

import { urlForImage } from "@/sanity/image";

type BlogImageProps = {
  alt: string;
  className?: string;
  height: number;
  image: SanityImageSource;
  preload?: boolean;
  sizes: string;
  width: number;
};

export function BlogImage({
  alt,
  className,
  height,
  image,
  preload = false,
  sizes,
  width,
}: BlogImageProps) {
  const src = urlForImage(image)
    .width(width)
    .height(height)
    .fit("crop")
    .auto("format")
    .url();

  return (
    <Image
      alt={alt}
      className={className}
      height={height}
      preload={preload}
      sizes={sizes}
      src={src}
      width={width}
    />
  );
}

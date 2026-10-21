import type { ImageLoaderProps } from "next/image";

export default function imageLoader({ src, width, quality }: ImageLoaderProps) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const imageUrl = src.startsWith("/") ? `${basePath}${src}` : src;
  const separator = imageUrl.includes("?") ? "&" : "?";

  return `${imageUrl}${separator}w=${width}&q=${quality ?? 75}`;
}

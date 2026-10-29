import type { SanityImageSource } from "@sanity/image-url";
import { PortableText, type PortableTextBlock } from "next-sanity";

import { BlogImage } from "./blog-image";

type BlogPostBodyProps = {
  value: unknown[];
};

export function BlogPostBody({ value }: BlogPostBodyProps) {
  return (
    <div className="blog-article-body">
      <PortableText
        value={value as PortableTextBlock[]}
        components={{
          types: {
            image: ({ value: image }) => {
              const contentImage = image as SanityImageSource & {
                alt?: string;
                caption?: string;
              };

              return (
                <figure className="blog-article-figure">
                  <BlogImage
                    alt={contentImage.alt || ""}
                    height={720}
                    image={contentImage}
                    sizes="(max-width: 760px) 100vw, 760px"
                    width={1200}
                  />
                  {contentImage.caption ? (
                    <figcaption>{contentImage.caption}</figcaption>
                  ) : null}
                </figure>
              );
            },
          },
        }}
      />
    </div>
  );
}

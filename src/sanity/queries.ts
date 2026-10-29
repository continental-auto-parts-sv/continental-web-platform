import { defineQuery } from "next-sanity";

export const POSTS_QUERY = defineQuery(`
  *[
    _type == "post" &&
    defined(title) &&
    defined(slug.current) &&
    defined(excerpt) &&
    (defined(blogCategory) || defined(category)) &&
    defined(coverImage.asset) &&
    defined(coverImage.alt) &&
    defined(publishedAt) &&
    publishedAt <= now()
  ] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    "category": coalesce(blogCategory->title, category),
    publishedAt,
    coverImage {
      ...,
      asset-> {
        _id,
        metadata {
          dimensions,
          lqip
        }
      }
    }
  }
`);

export const POST_QUERY = defineQuery(`
  *[
    _type == "post" &&
    slug.current == $slug &&
    defined(title) &&
    defined(excerpt) &&
    (defined(blogCategory) || defined(category)) &&
    defined(coverImage.asset) &&
    defined(coverImage.alt) &&
    defined(body) &&
    defined(publishedAt) &&
    publishedAt <= now()
  ][0] {
    _id,
    title,
    slug,
    excerpt,
    "category": coalesce(blogCategory->title, category),
    publishedAt,
    coverImage {
      ...,
      asset-> {
        _id,
        metadata {
          dimensions,
          lqip
        }
      }
    },
    body[] {
      ...,
      _key,
      _type,
      asset-> {
        _id,
        metadata {
          dimensions,
          lqip
        }
      }
    }
  }
`);

export const POST_SLUGS_QUERY = defineQuery(`
  *[
    _type == "post" &&
    defined(slug.current) &&
    defined(publishedAt) &&
    publishedAt <= now()
  ] {
    "slug": slug.current
  }
`);

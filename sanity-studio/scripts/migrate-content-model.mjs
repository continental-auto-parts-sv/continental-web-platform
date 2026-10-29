import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-10-29" });

const initialCategories = [
  { title: "Mantenimiento", slug: "mantenimiento" },
  { title: "Compatibilidad", slug: "compatibilidad" },
  { title: "Cuidado del vehículo", slug: "cuidado-del-vehiculo" },
  { title: "Noticias", slug: "noticias" },
];

const testPromotion = {
  slug: "prueba-frenos-continental",
  assetId:
    "image-c8095328a824f83b673c07b9f7d433d3be63039d-1536x1024-webp",
  alt: "Disco y pinza de freno de un vehículo",
};

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function findOrCreateCategory(title, preferredSlug) {
  const slug = preferredSlug || slugify(title);
  const existing = await client.fetch(
    `*[_type == "blogCategory" && slug.current == $slug][0]{_id}`,
    { slug },
  );

  if (existing?._id) return existing._id;

  const category = await client.create({
    _type: "blogCategory",
    title,
    slug: { _type: "slug", current: slug },
  });

  return category._id;
}

const categoryIds = new Map();

for (const category of initialCategories) {
  const id = await findOrCreateCategory(category.title, category.slug);
  categoryIds.set(category.title, id);
}

const posts = await client.fetch(`
  *[_type == "post" && !defined(blogCategory) && defined(category)] {
    _id,
    category
  }
`);

for (const post of posts) {
  let categoryId = categoryIds.get(post.category);

  if (!categoryId) {
    categoryId = await findOrCreateCategory(post.category);
    categoryIds.set(post.category, categoryId);
  }

  await client
    .patch(post._id)
    .set({
      blogCategory: {
        _type: "reference",
        _ref: categoryId,
      },
    })
    .unset(["category"])
    .commit();
}

const promotion = await client.fetch(
  `*[
    _type == "promotion" &&
    slug.current == $slug &&
    !defined(coverImage.asset)
  ][0]{_id}`,
  { slug: testPromotion.slug },
);

if (promotion?._id) {
  await client
    .patch(promotion._id)
    .set({
      coverImage: {
        _type: "image",
        alt: testPromotion.alt,
        asset: {
          _type: "reference",
          _ref: testPromotion.assetId,
        },
      },
    })
    .commit();
}

const promotionsWithLegacyIllustrations = await client.fetch(`
  *[_type == "promotion" && defined(icon)] {
    _id,
    "hasCoverImage": defined(coverImage.asset)
  }
`);

const promotionsWithoutCovers = promotionsWithLegacyIllustrations.filter(
  (item) => !item.hasCoverImage,
);

if (promotionsWithoutCovers.length > 0) {
  throw new Error(
    "Cannot remove legacy illustrations until every promotion has a cover image.",
  );
}

for (const item of promotionsWithLegacyIllustrations) {
  await client.patch(item._id).unset(["icon"]).commit();
}

console.log(
  `Content model migration complete: ${categoryIds.size} categories, ${posts.length} posts, and ${promotionsWithLegacyIllustrations.length} promotion illustrations processed.`,
);

import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { TagIcon } from "@sanity/icons/Tag";
import { defineArrayMember, defineField, defineType } from "sanity";

const promotion = defineType({
  name: "promotion",
  title: "Promoción",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: "slug",
      title: "Enlace",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "active",
      title: "Activa",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "description",
      title: "Descripción",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "badge",
      title: "Etiqueta de oferta",
      description: "Ejemplo: 15% OFF",
      type: "string",
      validation: (rule) => rule.required().max(20),
    }),
    defineField({
      name: "category",
      title: "Categoría",
      type: "string",
      options: {
        list: [
          "Motor",
          "Frenos",
          "Suspensión",
          "Filtros",
          "Lubricantes",
          "Otro repuesto",
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Imagen de portada",
      description:
        "Se utiliza en la tarjeta, el detalle y la promoción destacada.",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Texto alternativo",
          description: "Describe la imagen para personas que no pueden verla.",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "terms",
      title: "Condiciones",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shopifyUrl",
      title: "Enlace de compra en Mercadito",
      description:
        "Pega el enlace HTTPS exacto del producto o colección en Shopify.",
      type: "url",
      validation: (rule) =>
        rule
          .required()
          .uri({ scheme: ["https"] })
          .error("Ingresa un enlace HTTPS válido de Mercadito."),
    }),
    defineField({
      name: "startsAt",
      title: "Inicio (opcional)",
      type: "datetime",
    }),
    defineField({
      name: "endsAt",
      title: "Fin (opcional)",
      type: "datetime",
      validation: (rule) =>
        rule.custom((value, context) => {
          const start = context.document?.startsAt;
          return (
            !value ||
            typeof start !== "string" ||
            Date.parse(value) > Date.parse(start) ||
            "El fin debe ser posterior al inicio."
          );
        }),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "category",
      media: "coverImage",
    },
  },
});

const promotionSettings = defineType({
  name: "promotionSettings",
  title: "Promoción de portada",
  type: "document",
  fields: [
    defineField({
      name: "featuredPromotion",
      title: "Única promoción destacada",
      description:
        "Se mostrará solo si está publicada, activa y dentro de sus fechas. Deja vacío para ocultar la sección.",
      type: "reference",
      to: [{ type: "promotion" }],
      options: { filter: "active == true" },
    }),
  ],
});

const blogCategory = defineType({
  name: "blogCategory",
  title: "Categoría del blog",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Nombre",
      type: "string",
      validation: (rule) => rule.required().max(60),
    }),
    defineField({
      name: "slug",
      title: "Enlace",
      type: "slug",
      options: { source: "title", maxLength: 64 },
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Nombre (A–Z)",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
});

const post = defineType({
  name: "post",
  title: "Artículo del blog",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      title: "Título",
      type: "string",
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: "slug",
      title: "Enlace",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Resumen",
      description: "Texto breve para la tarjeta y los resultados de búsqueda.",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(220),
    }),
    defineField({
      name: "blogCategory",
      title: "Categoría",
      type: "reference",
      to: [{ type: "blogCategory" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Categoría anterior (obsoleta)",
      type: "string",
      deprecated: {
        reason:
          "Ahora las categorías se administran desde Categorías del blog.",
      },
      readOnly: true,
      hidden: ({ value }) => value === undefined,
      initialValue: undefined,
    }),
    defineField({
      name: "coverImage",
      title: "Imagen de portada",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Texto alternativo",
          description: "Describe la imagen para personas que no pueden verla.",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Fecha de publicación",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Contenido",
      type: "array",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Texto alternativo",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "caption",
              title: "Pie de foto",
              type: "string",
            }),
          ],
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  orderings: [
    {
      title: "Fecha de publicación (más reciente)",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      category: "blogCategory.title",
      legacyCategory: "category",
      media: "coverImage",
    },
    prepare({ category, legacyCategory, media, title }) {
      return {
        title,
        subtitle: category || legacyCategory,
        media,
      };
    },
  },
});

export const schemaTypes = [promotion, promotionSettings, blogCategory, post];

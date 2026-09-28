import { defineField, defineType } from "sanity";

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
      name: "icon",
      title: "Ilustración",
      type: "string",
      options: {
        list: [
          { title: "Motor", value: "engine" },
          { title: "Frenos", value: "brake" },
          { title: "Suspensión", value: "spring" },
          { title: "Filtros", value: "filter" },
          { title: "Lubricantes", value: "oil" },
        ],
      },
      initialValue: "brake",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "terms",
      title: "Condiciones",
      type: "text",
      validation: (rule) => rule.required(),
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

export const schemaTypes = [promotion, promotionSettings];

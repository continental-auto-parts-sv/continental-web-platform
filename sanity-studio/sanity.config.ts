import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { schemaTypes } from "./schema-types";

// Studio is prepared for later setup; the website runs without these variables.
export default defineConfig({
  name: "continental",
  title: "Continental Auto Parts",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "setup-required",
  dataset: process.env.SANITY_STUDIO_DATASET || "production",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Contenido")
          .items([
            S.listItem()
              .title("Promoción de portada")
              .id("promotionSettings")
              .child(
                S.document()
                  .schemaType("promotionSettings")
                  .documentId("promotionSettings"),
              ),
            S.documentTypeListItem("promotion").title("Promociones"),
          ]),
    }),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(
        (template) => template.schemaType !== "promotionSettings",
      ),
  },
  document: {
    actions: (actions, context) =>
      context.schemaType === "promotionSettings"
        ? actions.filter(
            (action) =>
              action.action !== "duplicate" && action.action !== "delete",
          )
        : actions,
  },
});

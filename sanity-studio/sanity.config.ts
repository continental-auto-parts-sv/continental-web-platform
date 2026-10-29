import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { schemaTypes } from "./schema-types";

export default defineConfig({
  name: "continental",
  title: "Continental Auto Parts",
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || "9pkob7ka",
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
            S.divider(),
            S.listItem()
              .title("Blog")
              .child(
                S.list()
                  .title("Blog")
                  .items([
                    S.documentTypeListItem("post").title("Artículos"),
                    S.documentTypeListItem("blogCategory").title("Categorías"),
                  ]),
              ),
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

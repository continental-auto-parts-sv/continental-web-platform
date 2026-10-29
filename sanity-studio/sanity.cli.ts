import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "9pkob7ka",
    dataset: "production",
  },
  deployment: {
    appId: "qbxu0xum5boah2bv8t0bwcmh",
  },
  typegen: {
    enabled: true,
    path: "../src/**/*.{ts,tsx,js,jsx}",
    schema: "schema.json",
    generates: "../src/sanity/sanity.types.ts",
    overloadClientMethods: true,
  },
});

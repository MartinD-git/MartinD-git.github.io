import { defineConfig } from "astro/config";
import { cvPreview } from "./scripts/render-cv.mjs";

export default defineConfig({
  site: "https://martin.daigne.com",
  output: "static",
  integrations: [cvPreview],
  devToolbar: { enabled: false },
});

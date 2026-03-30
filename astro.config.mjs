import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://apps-for-change.github.io",
  base: "/website",
  vite: {
    plugins: [tailwindcss()],
  },
});

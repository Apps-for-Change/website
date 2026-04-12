import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://apps-for-change.github.io",
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
});

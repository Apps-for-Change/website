import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://appsforchange.org",
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
  },
});

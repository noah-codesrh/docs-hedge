import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  server: {
    // The app itself owns 5174, so the docs sit on the next port up and refuse
    // to drift: a moving port breaks whatever has the docs link bookmarked.
    port: 5175,
    strictPort: true,
  },
  resolve: {
    tsconfigPaths: true,
  },
});

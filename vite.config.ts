import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Static SPA. In dev (Lovable preview) we serve at "/", in production
// build for GitHub Pages we use the repo subpath "/ESP/".
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/ESP/" : "/",
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  server: {
    host: "::",
    port: 8080,
  },
}));

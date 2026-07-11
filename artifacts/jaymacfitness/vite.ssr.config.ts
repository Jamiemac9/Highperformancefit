import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    ssr: true,
    outDir: path.resolve(import.meta.dirname, "dist/ssr"),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(import.meta.dirname, "src/ssr.tsx"),
    },
  },
});

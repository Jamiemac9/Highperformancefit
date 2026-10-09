import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// PORT / BASE_PATH used to be mandatory (Replit injected them). They now
// default so the same config builds on Render, locally, or anywhere else.
const port = Number(process.env.PORT || 5173);
if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${process.env.PORT}"`);
}
const basePath = process.env.BASE_PATH || "/";
const onReplit = process.env.REPL_ID !== undefined;

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    // Replit-only dev tooling: never loaded on Render or local builds.
    ...(onReplit
      ? [
          await import("@replit/vite-plugin-runtime-error-modal").then((m) => m.default()),
          ...(process.env.NODE_ENV !== "production"
            ? [
                await import("@replit/vite-plugin-cartographer").then((m) =>
                  m.cartographer({ root: path.resolve(import.meta.dirname, "..") }),
                ),
              ]
            : []),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
    },
    // Outside Replit the API runs as its own process (pnpm run server:dev, port 5050).
    proxy: onReplit
      ? undefined
      : { "/api": { target: `http://localhost:${process.env.API_PORT || 5050}`, changeOrigin: true } },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});

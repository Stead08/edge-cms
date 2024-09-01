import { defineConfig } from "vite";
import {
  vitePlugin as remix,
  cloudflareDevProxyVitePlugin,
} from "@remix-run/dev";
import tsconfigPaths from "vite-tsconfig-paths";
import devServer, { defaultOptions} from "@hono/vite-dev-server";
import adapter from "@hono/vite-dev-server/cloudflare"

export default defineConfig({
  plugins: [
    cloudflareDevProxyVitePlugin(),
    remix({
      ssr: false,
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
      
    }),
    tsconfigPaths(),
    // devServer({
    //   adapter,
    //   entry: "server.ts",
    //   exclude: [...defaultOptions.exclude, "**/node_modules/**", "assets/**", "/app/**"],
    //   injectClientScript: false,
    // }),
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8787",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    mainFields: ["browser", "module", "main"],
  },
  build: {
    minify: true,
  },
});

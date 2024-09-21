import { defineConfig } from "vite";
import {
	vitePlugin as remix,
	cloudflareDevProxyVitePlugin,
} from "@remix-run/dev";
import tsconfigPaths from "vite-tsconfig-paths";

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
	],
	server: {
		proxy: {
			"/api": {
				target: "http://localhost:8787",
				changeOrigin: true,
			},
			"/auth": {
				target: "http://localhost:8788",
				changeOrigin: true,
				headers: {
					Origin: "http://localhost:5173",
					Host: "localhost:5173",
				},
			},
		},
	},
	resolve: {
		mainFields: ["browser", "module", "main"],
		alias: {
			"@": "/app",
		},
	},
	build: {
		minify: true,
	},
});

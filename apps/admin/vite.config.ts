import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [
		reactRouter(),
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

import { defineConfig } from "vite";

export default defineConfig({
	root: import.meta.dirname,
	resolve: {
		mainFields: ["browser", "module", "main"],
	},
});

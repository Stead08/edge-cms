/// <reference types="vitest/globals" />
import { defineConfig } from "vite";

export default defineConfig({
	root: import.meta.dirname,
	test: {
		globals: true,
	},
});

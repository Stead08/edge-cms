/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */

import { ThemeProvider } from "@/components/theme-provider";
import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

startTransition(() => {
	hydrateRoot(
		document,
		<StrictMode>
			<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
				<HydratedRouter />
			</ThemeProvider>
		</StrictMode>,
	);
});

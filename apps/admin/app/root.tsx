import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import "./globals.css";
import Sidebar from "@/components/side-bar";
import SkipToMain from "@/components/skip-to-main";
import useIsCollapsed from "@/hooks/use-is-collapsed";

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}

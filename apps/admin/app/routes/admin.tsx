import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import "../globals.css";
import Sidebar from "@/components/side-bar";
import SkipToMain from "@/components/skip-to-main";
import useIsCollapsed from "@/hooks/use-is-collapsed";

function AppShell({ children }: { children: React.ReactNode }) {
	const [isCollapsed, setIsCollapsed] = useIsCollapsed();
	return (
		<div className="relative h-full overflow-hidden bg-background">
			<SkipToMain />
			<Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
			<main
				id="content"
				className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${isCollapsed ? "md:ml-14" : "md:ml-64"} h-full`}
			>
				{children}
			</main>
		</div>
	);
}

export function Layout({ children }: { children: React.ReactNode }) {
	return <AppShell>{children}</AppShell>;
}

export default function Admin() {
	return (
		<Layout>
			<Outlet />
		</Layout>
	);
}

import Sidebar from "@/components/side-bar";
import SkipToMain from "@/components/skip-to-main";
import useIsCollapsed from "@/hooks/use-is-collapsed";
import { Outlet } from "react-router";

export default function AppShell() {
	const [isCollapsed, setIsCollapsed] = useIsCollapsed();
	return (
		<div className="relative h-full overflow-hidden bg-background">
			<SkipToMain />
			<Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
			<main
				id="content"
				className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0 ${isCollapsed ? "md:ml-14" : "md:ml-64"} h-full`}
			>
				<Outlet />
			</main>
		</div>
	);
}

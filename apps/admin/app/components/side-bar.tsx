import Nav from "@/components/nav";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { sidelinks } from "@/data/sidelinks";
import { cn } from "@/lib/utils";
import { IconChevronsLeft, IconMenu2, IconX } from "@tabler/icons-react";
import { Suspense, useEffect, useState } from "react";
import { Button } from "./custom/button";
import { Layout } from "./custom/layout";

import { type ClientResponse, hc } from "hono/client";
import type { AppType } from "../../../sandbox/src/index";

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
	isCollapsed: boolean;
	setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const client = hc<AppType>("");

// biome-ignore lint/suspicious/noExplicitAny: utilのためanyを許容
type PromiseType<T extends Promise<any>> = T extends Promise<infer P>
	? P
	: never;

type WorkspaceType = PromiseType<ReturnType<typeof client.api.workspaces.$get>>;

type WorkspaceResultsType = WorkspaceType extends ClientResponse<
	infer R,
	number,
	string
>
	? R extends { results: infer U }
		? U
		: never
	: never;

export default function Sidebar({
	className,
	isCollapsed,
	setIsCollapsed,
}: SidebarProps) {
	const client = hc<AppType>("");

	const [navOpened, setNavOpened] = useState(false);
	const [workspaces, setWorkspaces] = useState<
		WorkspaceResultsType | undefined
	>();
	// biome-ignore lint/correctness/useExhaustiveDependencies: 無理でしたごめんなさい
	useEffect(() => {
		const getWorkspaces = async () => {
			const abortController = new AbortController();
			const res = await client.api.workspaces.$get({
				signal: abortController.signal,
			});
			const workspaces = await res.json();
			setWorkspaces(workspaces.results);
			return () => {
				abortController.abort();
			};
		};
		getWorkspaces();
	}, []);

	/* Make body not scrollable when navBar is opened */
	useEffect(() => {
		if (navOpened) {
			document.body.classList.add("overflow-hidden");
		} else {
			document.body.classList.remove("overflow-hidden");
		}
	}, [navOpened]);

	return (
		<aside
			className={cn(
				`fixed left-0 right-0 top-0 z-50 w-full border-r-2 border-r-muted transition-[width] md:bottom-0 md:right-auto md:h-svh ${isCollapsed ? "md:w-14" : "md:w-64"}`,
				className,
			)}
		>
			{/* Overlay in mobile */}
			<div
				onClick={() => setNavOpened(false)}
				onKeyDown={(e) => {
					if (e.key === "Escape") {
						setNavOpened(false);
					}
				}}
				className={`absolute inset-0 transition-[opacity] delay-100 duration-700 ${navOpened ? "h-svh opacity-50" : "h-0 opacity-0"} w-full bg-black md:hidden`}
			/>

			<Layout fixed className={navOpened ? "h-svh" : ""}>
				{/* Header */}
				<Layout.Header
					sticky
					className="z-50 flex justify-between px-4 py-3 shadow-sm md:px-4"
				>
					<div className={`flex items-center ${!isCollapsed ? "gap-2" : ""}`}>
						<svg
							aria-label="Admin Logo"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 256 256"
							className={`transition-all ${isCollapsed ? "h-6 w-6" : "h-8 w-8"}`}
						>
							<title>Admin Logo</title>
							<rect width="256" height="256" fill="none" />
							<line
								x1="208"
								y1="128"
								x2="128"
								y2="208"
								fill="none"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="16"
							/>
							<line
								x1="192"
								y1="40"
								x2="40"
								y2="192"
								fill="none"
								stroke="currentColor"
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="16"
							/>
							<span className="sr-only">Website Name</span>
						</svg>
						<div
							className={`flex flex-col justify-end truncate ${isCollapsed ? "invisible w-0" : "visible w-auto"}`}
						>
							<span className="font-medium">Shadcn Admin</span>
							<span className="text-xs">Vite + ShadcnUI</span>
						</div>
					</div>

					{/* Toggle Button in mobile */}
					<Button
						variant="ghost"
						size="icon"
						className="md:hidden"
						aria-label="Toggle Navigation"
						aria-controls="sidebar-menu"
						aria-expanded={navOpened}
						onClick={() => setNavOpened((prev) => !prev)}
					>
						{navOpened ? <IconX /> : <IconMenu2 />}
					</Button>
				</Layout.Header>
				<Suspense fallback={<div>Loading...</div>}>
					<Select>
						<SelectTrigger>
							<SelectValue placeholder="Select a workspace" />
						</SelectTrigger>
						<SelectContent>
							{workspaces?.map((workspace) => (
								<SelectItem key={workspace.id} value={workspace.id}>
									{workspace.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</Suspense>

				{/* Navigation links */}
				<Nav
					id="sidebar-menu"
					className={`z-40 h-full flex-1 overflow-auto ${navOpened ? "max-h-screen" : "max-h-0 py-0 md:max-h-screen md:py-2"}`}
					closeNav={() => setNavOpened(false)}
					isCollapsed={isCollapsed}
					links={sidelinks}
				/>
				{/* Scrollbar width toggle button */}
				<Button
					onClick={() => setIsCollapsed((prev) => !prev)}
					size="icon"
					variant="outline"
					className="absolute -right-5 top-1/2 z-50 hidden rounded-full md:inline-flex"
				>
					<IconChevronsLeft
						stroke={1.5}
						className={`h-5 w-5 ${isCollapsed ? "rotate-180" : ""}`}
					/>
				</Button>
			</Layout>
		</aside>
	);
}

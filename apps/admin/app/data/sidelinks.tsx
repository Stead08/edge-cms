import {
	IconApps,
	IconBarrierBlock,
	IconBoxSeam,
	IconChartHistogram,
	IconChecklist,
	IconComponents,
	IconError404,
	IconExclamationCircle,
	IconHexagonNumber1,
	IconHexagonNumber2,
	IconHexagonNumber3,
	IconHexagonNumber4,
	IconHexagonNumber5,
	IconLayoutDashboard,
	IconLock,
	IconMessages,
	IconRouteAltLeft,
	IconServerOff,
	IconSettings,
	IconTruck,
	IconUserShield,
	IconUsers,
} from "@tabler/icons-react";
import type { Collection } from "~/store/useStore";

export interface NavLink {
	title: string;
	label?: string;
	href: string;
	icon: JSX.Element;
}

export interface SideLink extends NavLink {
	sub?: NavLink[];
}

export const getSidelinks = (collections: Collection[]) => [
	{
		title: "Dashboard",
		label: "",
		href: "/admin/dashboard",
		icon: <IconLayoutDashboard size={18} />,
	},
	{
		title: "Collections",
		label: collections.length.toString(),
		href: "/admin/collections",
		icon: <IconChecklist size={18} />,
		sub: collections.map((collection) => ({
			title: collection.name,
			label: collection.name,
			href: `/admin/collections/${collection.id}`,
			icon: <IconHexagonNumber1 size={18} />,
		})),
	},
	{
		title: "Chats",
		label: "9",
		href: "/admin/dashboard",
		icon: <IconMessages size={18} />,
	},
	{
		title: "Apps",
		label: "",
		href: "/admin/dashboard",
		icon: <IconApps size={18} />,
	},
	{
		title: "Authentication",
		label: "",
		href: "",
		icon: <IconUserShield size={18} />,
		sub: [
			{
				title: "Sign In (email + password)",
				label: "",
				href: "/sign-in",
				icon: <IconHexagonNumber1 size={18} />,
			},
			{
				title: "Sign In (Box)",
				label: "",
				href: "/sign-in-2",
				icon: <IconHexagonNumber2 size={18} />,
			},
			{
				title: "Sign Up",
				label: "",
				href: "/sign-up",
				icon: <IconHexagonNumber3 size={18} />,
			},
			{
				title: "Forgot Password",
				label: "",
				href: "/forgot-password",
				icon: <IconHexagonNumber4 size={18} />,
			},
			{
				title: "OTP",
				label: "",
				href: "/otp",
				icon: <IconHexagonNumber5 size={18} />,
			},
		],
	},
	{
		title: "Error Pages",
		label: "",
		href: "",
		icon: <IconExclamationCircle size={18} />,
		sub: [
			{
				title: "Not Found",
				label: "",
				href: "/404",
				icon: <IconError404 size={18} />,
			},
			{
				title: "Internal Server Error",
				label: "",
				href: "/500",
				icon: <IconServerOff size={18} />,
			},
			{
				title: "Maintenance Error",
				label: "",
				href: "/503",
				icon: <IconBarrierBlock size={18} />,
			},
			{
				title: "Unauthorised Error",
				label: "",
				href: "/401",
				icon: <IconLock size={18} />,
			},
		],
	},
	{
		title: "Settings",
		label: "",
		href: "/admin/dashboard",
		icon: <IconSettings size={18} />,
	},
];

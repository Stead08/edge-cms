import { useLocation } from "@remix-run/react";

export default function useCheckActiveNav() {
	const { pathname } = useLocation();

	const checkActiveNav = (nav: string) => {
		const pathArray = pathname.split("/").filter((item) => item !== "");

		if (nav === "/" && pathArray.length < 1) return true;

		return pathArray.includes(nav.replace(/^\//, ""));
	};

	return { checkActiveNav };
}

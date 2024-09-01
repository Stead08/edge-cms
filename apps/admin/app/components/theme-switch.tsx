import { IconMoon, IconSun } from "@tabler/icons-react";
import { useEffect } from "react";
import { Button } from "./custom/button";
import { useTheme } from "./theme-provider";

export default function ThemeSwitch() {
	const { theme, setTheme } = useTheme();

	/* Update theme-color meta tag
	 * when theme is updated */
	useEffect(() => {
		const themeColor = theme === "dark" ? "#020817" : "#fff";
		const metaThemeColor = document.querySelector("meta[name='theme-color']");
		metaThemeColor?.setAttribute("content", themeColor);
	}, [theme]);

	return (
		<Button
			size="icon"
			variant="ghost"
			className="rounded-full"
			onClick={() => setTheme(theme === "light" ? "dark" : "light")}
		>
			{theme === "light" ? <IconMoon size={20} /> : <IconSun size={20} />}
		</Button>
	);
}

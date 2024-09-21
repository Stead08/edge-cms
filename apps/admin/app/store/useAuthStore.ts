import { hc } from "hono/client";
import { create } from "zustand";

interface AuthStore {
	login: (form: FormData) => Promise<boolean>;
	signup: (form: FormData) => Promise<boolean>;
	logout: () => Promise<boolean>;
}

export const useAuthStore = create<AuthStore>((set) => ({
	login: async (form) => {
		const res = await fetch("/auth/login", {
			method: "POST",
			body: form,
		});
		console.log(res);
		if (res.ok) {
			window.location.href = "/admin";
			return true;
		}
		console.log("ログイン失敗");
		return false;
	},
	signup: async (form) => {
		const res = await fetch("/auth/signup", {
			method: "POST",
			body: form,
		});
		console.log(res);
		if (res.ok) {
			window.location.href = "/admin";
			return true;
		}
		console.log("サインアップ失敗");
		return false;
	},
	logout: async () => {
		const res = await fetch("/auth/logout", {
			method: "POST",
		});
		if (res.ok) {
			window.location.href = "/login";
			return true;
		}
		return false;
	},
}));

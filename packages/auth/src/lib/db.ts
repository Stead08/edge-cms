import type { D1Database } from "@cloudflare/workers-types";
import { D1Adapter } from "@lucia-auth/adapter-sqlite";
import { Lucia } from "lucia";

export function initializeLucia(D1: D1Database) {
	const adapter = new D1Adapter(D1, {
		user: "users",
		session: "sessions",
	});
	return new Lucia(adapter, {
		sessionCookie: {
			attributes: {
				secure: false,
			},
		},
		getUserAttributes: (attributes) => {
			return {
				username: attributes.username,
			};
		},
	});
}

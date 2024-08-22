import type { D1Database } from "@cloudflare/workers-types";
import { Hono } from "hono";

export const createHonoWithDB = () => {
	const app = new Hono<{
		Bindings: {
			DB: D1Database;
			AUTH_SECRET: string;
			JWT_SECRET: string;
		};
		Variables: {
			db: D1Database;
			auth_secret: Uint8Array;
			jwt_secret: string;
		};
	}>();
	app.use(async (c, next) => {
		c.set("db", c.env.DB);
		const secretSalt = Uint8Array.from(
			new TextEncoder().encode(c.env.AUTH_SECRET),
		);
		c.set("auth_secret", secretSalt);
		c.set("jwt_secret", c.env.JWT_SECRET);
		await next();
	});
	return app;
};

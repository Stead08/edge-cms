import { D1Database } from "@cloudflare/workers-types";
import { Hono } from "hono";

export const createHonoWithDB = () => {
	const app = new Hono<{
		Bindings: {
			DB: D1Database;
		};
		Variables: {
			db: D1Database;
		};
	}>();
	app.use(async (c, next) => {
		c.set("db", c.env.DB);
		await next();
	});
	return app;
};

import type {
	D1Database,
	KVNamespace,
	R2Bucket,
} from "@cloudflare/workers-types";
import { Hono } from "hono";

export const createHonoWithDB = () => {
	const app = new Hono<{
		Bindings: {
			DB: D1Database;
			KV: KVNamespace;
			R2: R2Bucket;
			AUTH_SECRET: string;
			JWT_SECRET: string;
		};
		Variables: {
			db: D1Database;
			kv: KVNamespace;
			r2: R2Bucket;
			auth_secret: Uint8Array;
			jwt_secret: string;
		};
	}>();
	app.use(async (c, next) => {
		if (
			!c.env.DB ||
			!c.env.AUTH_SECRET ||
			!c.env.JWT_SECRET ||
			!c.env.KV ||
			!c.env.R2
		) {
			console.error("env is not set properly");
			return new Response("Internal server error", { status: 500 });
		}
		c.set("db", c.env.DB);
		c.set("kv", c.env.KV);
		c.set("r2", c.env.R2);
		const secretSalt = Uint8Array.from(
			new TextEncoder().encode(c.env.AUTH_SECRET),
		);
		c.set("auth_secret", secretSalt);
		c.set("jwt_secret", c.env.JWT_SECRET);
		await next();
	});
	return app;
};

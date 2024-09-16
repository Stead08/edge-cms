import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { generateId } from "lucia";
import type { User, Session } from "lucia";
import { verifyRequestOrigin, Scrypt } from "lucia";
import { getCookie } from "hono/cookie";

import { initializeLucia } from "./lib/db";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { users } from "../db/schema";

import type { D1Database } from "@cloudflare/workers-types";

interface DatabaseUserAttributes {
	username: string;
}

declare module "lucia" {
	interface Register {
		Auth: ReturnType<typeof initializeLucia>;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

type Bindings = {
	DB: D1Database;
};

const app = new Hono<{
	Bindings: Bindings;
	Variables: {
		user: User | null;
		session: Session | null;
	};
}>();

app.use("*", async (c, next) => {
	if (c.req.method === "GET") {
		return next();
	}
	const originHeader = c.req.header("Origin");
	const hostHeader = c.req.header("Host");
	if (
		!originHeader ||
		!hostHeader ||
		!verifyRequestOrigin(originHeader, [hostHeader])
	) {
		return c.body(null, 403);
	}
	return next();
});

app.use("*", async (c, next) => {
	const lucia = initializeLucia(c.env.DB);
	const sessionId = getCookie(c, lucia.sessionCookieName) ?? null;
	if (!sessionId) {
		c.set("user", null);
		c.set("session", null);
		return next();
	}
	const { session, user } = await lucia.validateSession(sessionId);
	if (session?.fresh) {
		// use `header()` instead of `setCookie()` to avoid TS errors
		c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), {
			append: true,
		});
	}
	if (!session) {
		c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
			append: true,
		});
	}
	c.set("user", user);
	c.set("session", session);
	return next();
});

app.post(
	"/signup",
	zValidator(
		"form",
		z.object({
			username: z.string().email(),
			password: z.string().min(1),
		}),
	),
	async (c) => {
		const { username, password } = c.req.valid("form");
		const lucia = initializeLucia(c.env.DB);
		const db = drizzle(c.env.DB);

		const hashedPassword = await new Scrypt().hash(password);
		const userId = generateId(15);

		try {
			await db.insert(users).values({
				id: userId,
				username,
				hashedPassword,
			});

			const session = await lucia.createSession(userId, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			c.header("Set-Cookie", sessionCookie.serialize(), {
				append: true,
			});
			return c.json({ message: "User created successfully", success: true });
		} catch (error) {
			console.error(error);
			return c.json({ error: "Something went wrong", success: false }, 400);
		}
	},
);

app.post(
	"/login",
	zValidator(
		"form",
		z.object({
			username: z.string().email(),
			password: z.string().min(1),
		}),
	),
	async (c) => {
		const { username, password } = c.req.valid("form");
		const lucia = initializeLucia(c.env.DB);
		const db = drizzle(c.env.DB);
		const userQuery = await db
			.select()
			.from(users)
			.where(eq(users.username, username))
			.limit(1);
		const user = userQuery[0];

		if (!user || !user.hashedPassword) {
			return c.json(
				{ error: "Invalid username or password", success: false },
				401,
			);
		}
		const validPassword = await new Scrypt().verify(
			user.hashedPassword,
			password,
		);
		if (!validPassword) {
			return c.json(
				{ error: "Invalid username or password", success: false },
				401,
			);
		}

		const session = await lucia.createSession(user.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		c.header("Set-Cookie", sessionCookie.serialize(), {
			append: true,
		});
		return c.json({ message: "Logged in successfully", success: true });
	},
);

app.post("/logout", async (c) => {
	const lucia = initializeLucia(c.env.DB);
	const sessionId = c.get("session")?.id;
	if (!sessionId) {
		return c.json({ error: "Unauthorized", success: false }, 401);
	}
	await lucia.invalidateSession(sessionId);
	const sessionCookie = lucia.createBlankSessionCookie();
	c.header("Set-Cookie", sessionCookie.serialize(), {
		append: true,
	});
	return c.json({ message: "Logged out successfully", success: true });
});

export default app;

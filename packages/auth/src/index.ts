import { Hono } from "hono";
import { verifyRequestOrigin } from "lucia";

export const createAuthApp = () => {
	const app = new Hono();
	app.get("/hello", (c) => c.text("Hello World"));

	// app.use("*", async (c, next) => {
	// 	if (c.req.method === "GET") {
	// 		return next();
	// 	}
	// 	const originHeader = c.req.header("Origin") ?? null;
	// 	const hostHeader = c.req.header("Host") ?? null;
	// 	if (
	// 		!originHeader ||
	// 		!hostHeader ||
	// 		!verifyRequestOrigin(originHeader, [hostHeader])
	// 	) {
	// 		return c.body(null, 403);
	// 	}
	// 	return next();
	// });

	// app.use("*", async (c, next) => {
	// 	const sessionId = lucia.readSessionCookie(c.req.header("Cookie") ?? "");
	// 	if (!sessionId) {
	// 		c.set("user", null);
	// 		c.set("session", null);
	// 		return next();
	// 	}

	// 	const { session, user } = await lucia.validateSession(sessionId);
	// 	if (session?.fresh) {
	// 		c.header(
	// 			"Set-Cookie",
	// 			lucia.createSessionCookie(session.id).serialize(),
	// 			{
	// 				append: true,
	// 			},
	// 		);
	// 	}
	// 	if (!session) {
	// 		c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
	// 			append: true,
	// 		});
	// 	}
	// 	c.set("session", session);
	// 	c.set("user", user);
	// 	return next();
	// });

	return app;
};

const app = createAuthApp();

export type AppType = ReturnType<typeof createAuthApp>;

export default app;

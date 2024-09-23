import { handle, type EventContext } from "hono/cloudflare-pages";
import { middleware } from "@repo/auth";
import { Hono } from "hono/tiny";

export type Bindings = {
	DB: D1Database;
};

const app = new Hono<{
	Bindings: {
		eventContext: EventContext;
		DB: D1Database;
	};
}>();

app.use("/admin/*", middleware);
app.use("/api/*", middleware);

app.all("*", async (c) => {
	return c.env.eventContext.next();
});

export const onRequest = handle(app);

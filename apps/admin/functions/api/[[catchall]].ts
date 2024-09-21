import { Hono } from "hono/tiny";

const app = new Hono<{
	Bindings: {
		MY_VAR: string;
		API: Fetcher;
		__STATIC_CONTENT: KVNamespace;
	};
}>();

app.all("*", (c) => {
	const res = c.env.API.fetch(c.req.raw);
	return res;
});

export async function onRequest(context: EventContext<Env, "/api/*", null>) {
	return await app.fetch(context.request, context.env);
}

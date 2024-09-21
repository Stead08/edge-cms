import { createAuth } from "@repo/auth";
import { Hono } from "hono/tiny";

const app = new Hono().basePath("/auth").route("/", createAuth());

export async function onRequest(context: EventContext<Env, "/auth/*", null>) {
	return await app.fetch(context.request, context.env);
}

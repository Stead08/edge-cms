import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { createHonoWithDB } from "./factory";
import { collectionManagerApp } from "./routes/collectionManager";
import { rolesApp } from "./routes/roles";
import { usersApp } from "./routes/users";
import { workspacesApp } from "./routes/workspaces";

export const createEdgeCms = () => {
	const app = createHonoWithDB()
		.route("/users", usersApp)
		.route("/workspaces", workspacesApp)
		.route("/roles", rolesApp)
		.route("/collection", collectionManagerApp)
		.get("/kv", async (c) => {
			const test = c.req.query("test") ?? "no test";
			if (test) {
				await c.env.KV.put("test", JSON.stringify(test));
			}
			const output_test = (await c.env.KV.get("test")) ?? "no test";
			return c.text(output_test);
		})
		.post("/r2", async (c) => {
			const r2 = c.get("r2");
			const params = await c.req.json();
			const res = await r2.put(params.id, JSON.stringify(params));
			if (!res) {
				return new Response("Cannot upload asset", {
					status: 500,
				});
			}
			return c.json({ status: "uploaded successfully", key: res.key }, 200);
		})
		.get(
			"/hello",
			zValidator(
				"query",
				z.object({
					name: z.string(),
				}),
			),
			(c) => {
				const { name } = c.req.valid("query");

				return c.text(`Hello ${name}`);
			},
		)

		.get("/", (c) => {
			return c.text("Hello Hono");
		});

	return app;
};

const app = createEdgeCms();

export type AppType = ReturnType<typeof createEdgeCms>;

export default app;

import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { createHonoWithDB } from "./factory";
import { collectionsApp } from "./routes/collections";
import { fieldValuesApp } from "./routes/fieldValues";
import { fieldsApp } from "./routes/fields";
import { itemsApp } from "./routes/items";
import { rootSlugApp } from "./routes/root";
import { usersApp } from "./routes/users";

export const createEdgeCms = () => {
	const app = createHonoWithDB()
		.route("/users", usersApp)
		.route("/fields", fieldsApp)
		.route("/field_values", fieldValuesApp)
		.route("/collections", collectionsApp)
		.route("/items", itemsApp)
		.route("/", rootSlugApp)
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

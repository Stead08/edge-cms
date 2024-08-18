import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { createHonoWithDB } from "./factory";
import { contentTypesApp } from "./routes/contentTypes";
import { entriesApp } from "./routes/entries";
import { fieldsApp } from "./routes/fields";
import { fieldValuesApp } from "./routes/fieldValues";
import { usersApp } from "./routes/users";

export const createEdgeCms = () => {
	const app = createHonoWithDB()
		.route("/users", usersApp) //
		.route("/content-types", contentTypesApp)
		.route("/fields", fieldsApp)
		.route("/entries", entriesApp)
		.route("/field-values", fieldValuesApp)
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
		);

	return app;
};

export type AppType = ReturnType<typeof createEdgeCms>;

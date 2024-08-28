import { z } from "zod";
import { createHonoWithDB } from "../factory";
import * as sql from "../gen/sqlc/querier";

const fieldTemplateSchema = z.object({
	name: z.string().min(1).max(50),
	type: z.string(),
	required: z.boolean().default(false),
	default_value: z.string().optional(),
	options: z.record(z.unknown()).optional(),
	metadata: z.record(z.unknown()).optional(),
});

export const fieldTemplatesApp = createHonoWithDB()
	.post("/", async (c) => {
		const db = c.get("db");
		const body = await c.req.json();
		const validatedData = fieldTemplateSchema.parse(body);

		const result = await sql.createFieldTemplate(db, {
			name: validatedData.name,
			type: validatedData.type,
			required: validatedData.required ? 1 : 0,
			defaultValue: validatedData.default_value ?? null,
			options: validatedData.options
				? JSON.stringify(validatedData.options)
				: null,
			metadata: validatedData.metadata
				? JSON.stringify(validatedData.metadata)
				: null,
		});
		return c.json(result, 201);
	})
	.get("/:id", async (c) => {
		const id = c.req.param("id");
		const db = c.get("db");
		const result = await sql.getFieldTemplate(db, { id: Number(id) });
		if (!result) {
			return c.json({ error: "フィールドテンプレートが見つかりません" }, 404);
		}
		return c.json(result);
	})
	.put("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		const body = await c.req.json();
		const validatedData = fieldTemplateSchema.partial().parse(body);

		const field = await sql.getFieldTemplate(db, { id: Number(id) });
		if (!field) {
			return c.json({ error: "フィールドテンプレートが見つかりません" }, 404);
		}

		const result = await sql.updateFieldTemplate(db, {
			id: Number(id),
			name: validatedData.name ?? field.name,
			type: validatedData.type ?? field.type,
			required: validatedData.required ? 1 : 0,
			defaultValue: validatedData.default_value ?? null,
			options: validatedData.options
				? JSON.stringify(validatedData.options)
				: null,
			metadata: validatedData.metadata
				? JSON.stringify(validatedData.metadata)
				: null,
		});
		return c.json(result);
	})
	.delete("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		await sql.deleteFieldTemplate(db, { id: Number(id) });
		return c.text("フィールドテンプレートが削除されました", 200);
	});

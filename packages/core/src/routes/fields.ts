import { z } from "zod";
import { createHonoWithDB } from "../factory";
import * as sql from "../gen/sqlc/querier";
import { validateFieldType, validateFieldValue } from "../utils/fieldValidator";

const fieldSchema = z.object({
	collection_id: z.number().int().positive(),
	template_id: z.number().int().positive().optional(),
	name: z.string().min(1).max(50),
	type: z.string().refine(validateFieldType, { message: "Invalid field type" }),
	required: z.boolean().default(false),
	default_value: z.string().optional(),
	options: z.record(z.unknown()).optional(),
});

export const fieldsApp = createHonoWithDB()
	.post("/", async (c) => {
		const db = c.get("db");
		const body = await c.req.json();
		const validatedData = fieldSchema.parse(body);

		const result = await sql.createField(db, {
			collectionId: validatedData.collection_id,
			templateId: validatedData.template_id ?? null,
			name: validatedData.name,
			type: validatedData.type,
			required: validatedData.required ? 1 : 0,
			defaultValue: validatedData.default_value ?? null,
			options: validatedData.options
				? JSON.stringify(validatedData.options)
				: null,
		});
		return c.json(result, 201);
	})
	.get("/:id", async (c) => {
		const id = c.req.param("id");
		const db = c.get("db");
		const result = await sql.getField(db, { id: Number(id) });
		if (!result) {
			return c.json({ error: "フィールドが見つかりません" }, 404);
		}
		return c.json(result);
	})
	.put("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		const body = await c.req.json();
		const validatedData = fieldSchema.partial().parse(body);

		const field = await sql.getField(db, { id: Number(id) });
		if (!field) {
			return c.json({ error: "フィールドが見つかりません" }, 404);
		}

		const result = await sql.updateField(db, {
			id: Number(id),
			templateId: validatedData.template_id ?? field.templateId,
			name: validatedData.name ?? field.name,
			type: validatedData.type ?? field.type,
			required: validatedData.required ? 1 : 0,
			defaultValue: validatedData.default_value ?? field.defaultValue,
			options: validatedData.options
				? JSON.stringify(validatedData.options)
				: null,
		});
		return c.json(result);
	})
	.delete("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		await sql.deleteField(db, { id: Number(id) });
		return c.text("フィールドが削除されました", 200);
	})
	.post("/validate", async (c) => {
		const { type, value } = await c.req.json();
		if (!validateFieldType(type)) {
			return c.json({ error: "Invalid field type" }, 400);
		}
		const isValid = validateFieldValue(type, value);
		return c.json({ isValid });
	});

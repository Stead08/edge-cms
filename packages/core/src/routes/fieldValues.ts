import { z } from "zod";
import { createHonoWithDB } from "../factory";
import * as sql from "../gen/sqlc/querier";
import { parseFieldType, validateFieldValue } from "../utils/fieldValidator";

const fieldValueSchema = z.object({
	item_id: z.number().int().positive(),
	field_id: z.number().int().positive(),
	value: z.any(),
});

export const fieldValuesApp = createHonoWithDB()
	.post("/", async (c) => {
		const db = c.get("db");
		const body = await c.req.json();
		const validatedData = fieldValueSchema.parse(body);

		const field = await sql.getField(db, { id: validatedData.field_id });
		if (!field) {
			return c.json({ error: "フィールドが見つかりません" }, 404);
		}
		const type = parseFieldType(field.type.toString());
		const isValid = validateFieldValue(type, validatedData.value);
		if (!isValid) {
			return c.json({ error: "無効な値です" }, 400);
		}
		const result = await sql.createFieldValue(db, {
			itemId: validatedData.item_id,
			fieldId: validatedData.field_id,
			value: validatedData.value,
		});
		return c.json(result, 201);
	})
	.get("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		const result = await sql.getFieldValue(db, { id: Number(id) });
		if (!result) {
			return c.json({ error: "フィールド値が見つかりません" }, 404);
		}
		return c.json(result);
	})
	.put("/:id", async (c) => {
		const id = c.req.param("id");
		const { value } = await c.req.json();
		const db = c.get("db");

		const currentVersion = await sql.getFieldValueVersion(db, {
			id: Number(id),
		});
		if (!currentVersion) {
			return c.json({ error: "フィールド値が見つかりません" }, 404);
		}

		const result = await sql.updateFieldValue(db, {
			id: Number(id),
			value,
		});
		return c.json(result);
	})
	.delete("/:id", async (c) => {
		const id = c.req.param("id");
		const db = c.get("db");
		await sql.deleteFieldValue(db, { id: Number(id) });
		return c.text("フィールド値が削除されました", 200);
	});

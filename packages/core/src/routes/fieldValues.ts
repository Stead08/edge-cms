import { createHonoWithDB } from "../factory";
import * as sql from "../gen/sqlc/querier";

export const fieldValuesApp = createHonoWithDB()
	.post("/", async (c) => {
		const db = c.get("db");
		const { entry_id, field_id, value } = await c.req.json();
		const result = await sql.createFieldValue(db, {
			entryId: entry_id,
			fieldId: field_id,
			value,
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
		const result = await sql.updateFieldValue(db, { id: Number(id), value });
		return c.json(result);
	})
	.delete("/:id", async (c) => {
		const id = c.req.param("id");
		const db = c.get("db");
		await sql.deleteFieldValue(db, { id: Number(id) });
		return c.text("フィールド値が削除されました", 200);
	});

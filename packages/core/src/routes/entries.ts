import { createHonoWithDB } from "../factory";
import * as sql from "../gen/sqlc/querier";

export const entriesApp = createHonoWithDB()
	.post("/", async (c) => {
		const db = c.get("db");
		const { content_type_id, created_by } = await c.req.json();
		const result = await sql.createEntry(db, {
			contentTypeId: content_type_id,
			createdBy: created_by,
		});
		return c.json(result, 201);
	})
	.get("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		const result = await sql.getEntry(db, { id: Number(id) });
		if (!result) {
			return c.json({ error: "エントリーが見つかりません" }, 404);
		}
		return c.json(result);
	})
	.get("/:entry_id/field-values", async (c) => {
		const db = c.get("db");
		const entry_id = c.req.param("entry_id");
		const result = await sql.listFieldValues(db, { entryId: Number(entry_id) });
		return c.json(result);
	})
	.put("/:id", async (c) => {
		const id = c.req.param("id");
		const db = c.get("db");
		const result = await sql.updateEntry(db, { id: Number(id) });
		return c.json(result);
	})
	.delete("/:id", async (c) => {
		const id = c.req.param("id");
		const db = c.get("db");
		await sql.deleteEntry(db, { id: Number(id) });
		return c.text("エントリーが削除されました", 200);
	});

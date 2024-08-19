import { createHonoWithDB } from "../factory";
import * as sql from "../gen/sqlc/querier";

export const fieldsApp = createHonoWithDB()
	.post("/", async (c) => {
		const db = c.get("db");
		const { collection_id, name, type, required } = await c.req.json();
		const result = await sql.createField(db, {
			collectionId: collection_id,
			name,
			type,
			required,
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
		const { name, type, required } = await c.req.json();
		const result = await sql.updateField(db, {
			id: Number(id),
			name: name ?? null,
			type: type ?? null,
			required: required ?? null,
		});
		return c.json(result);
	})
	.delete("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		await sql.deleteField(db, { id: Number(id) });
		return c.text("フィールドが削除されました", 200);
	});

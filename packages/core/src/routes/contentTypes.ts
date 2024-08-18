import { createHonoWithDB } from "../factory";
import * as sql from "../gen/sqlc/querier";

export const contentTypesApp = createHonoWithDB()
	.get("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		const result = await sql.getContentType(db, { id: Number(id) });
		if (!result) {
			return c.json({ error: "コンテンツタイプが見つかりません" }, 404);
		}
		return c.json(result);
	})
	.get("/", async (c) => {
		const db = c.get("db");
		const result = await sql.listContentTypes(db, {});
		return c.json(result);
	})
	.post("/", async (c) => {
		const db = c.get("db");
		const { name, description } = await c.req.json();
		const result = await sql.createContentType(db, {
			name,
			description,
		});
		return c.json(result, 201);
	})
	.get("/:content_type_id/fields", async (c) => {
		const db = c.get("db");
		const content_type_id = c.req.param("content_type_id");
		const result = await sql.listFields(db, {
			contentTypeId: Number(content_type_id),
		});
		return c.json(result);
	})
	.get("/:content_type_id/entries", async (c) => {
		const db = c.get("db");
		const content_type_id = c.req.param("content_type_id");
		const result = await sql.listEntries(db, {
			contentTypeId: Number(content_type_id),
		});
		return c.json(result);
	})
	.put("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		const { name, description } = await c.req.json();
		const result = await sql.updateContentType(db, {
			id: Number(id),
			name,
			description,
		});
		return c.json(result);
	})
	.delete("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		await sql.deleteContentType(db, { id: Number(id) });
		return c.text("コンテンツタイプが削除されました", 200);
	});

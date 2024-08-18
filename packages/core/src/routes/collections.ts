import { createHonoWithDB } from "../factory";
import * as sql from "../gen/sqlc/querier";

export const collectionsApp = createHonoWithDB()
	// Create a new collection
	.post("/", async (c) => {
		const db = c.get("db");
		const {
			slug,
			label,
			description,
			access,
			default_sort,
			list_searchable_fields,
			pagination,
			default_limit,
			max_limit,
		} = await c.req.json();
		const result = await sql.createCollection(db, {
			slug,
			label,
			description,
			access,
			defaultSort: default_sort,
			listSearchableFields: JSON.stringify(list_searchable_fields), // JSON.stringifyを使用
			pagination,
			defaultLimit: default_limit,
			maxLimit: max_limit,
		});
		return c.json(result, 201);
	})

	// Get a collection by ID
	.get("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		const result = await sql.getCollection(db, { id: Number(id) });
		if (!result) {
			return c.json({ error: "コレクションが見つかりません" }, 404);
		}
		return c.json(result);
	})

	// Update a collection by ID
	.put("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		const {
			slug,
			label,
			description,
			access,
			default_sort,
			list_searchable_fields,
			pagination,
			default_limit,
			max_limit,
		} = await c.req.json();
		const result = await sql.updateCollection(db, {
			id: Number(id),
			slug,
			label,
			description,
			access,
			defaultSort: default_sort,
			listSearchableFields: JSON.stringify(list_searchable_fields), // JSON.stringifyを使用
			pagination,
			defaultLimit: default_limit,
			maxLimit: max_limit,
		});
		return c.json(result);
	})

	// Delete a collection by ID
	.delete("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		await sql.deleteCollection(db, { id: Number(id) });
		return c.text("コレクションが削除されました", 200);
	})

	// List all collections
	.get("/", async (c) => {
		const db = c.get("db");
		const result = await sql.listCollections(db, {});
		return c.json(result);
	});

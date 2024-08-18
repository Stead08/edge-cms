import { createHonoWithDB } from "../factory";
import * as sql from "../gen/sqlc/querier";

export const itemsApp = createHonoWithDB()
	// Create a new item
	.post("/", async (c) => {
		const db = c.get("db");
		const { collection_id } = await c.req.json();
		const result = await sql.createItem(db, {
			collectionId: collection_id,
		});
		return c.json(result, 201);
	})

	// Get an item by ID
	.get("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		const result = await sql.getItem(db, { id: Number(id) });
		if (!result) {
			return c.json({ error: "アイテムが見つかりません" }, 404);
		}
		return c.json(result);
	})

	// Update an item by ID
	.put("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		const result = await sql.updateItem(db, { id: Number(id) });
		return c.json(result);
	})

	// Delete an item by ID
	.delete("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		await sql.deleteItem(db, { id: Number(id) });
		return c.text("アイテムが削除されました", 200);
	})

	// List all items in a collection
	.get("/", async (c) => {
		const db = c.get("db");
		const { collection_id } = c.req.query();
		const result = await sql.listItems(db, {
			collectionId: Number(collection_id),
		});
		return c.json(result);
	});

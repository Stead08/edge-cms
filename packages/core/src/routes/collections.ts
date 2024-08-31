import { z } from "zod";
import { createHonoWithDB } from "../factory";
import * as sql from "../gen/sqlc/querier";
import { itemsApp } from "./items";

const collectionSchema = z.object({
	workspace_id: z.string(),
	name: z.string().min(1).max(100),
	slug: z.string().min(1).max(100),
	schema: z.record(z.unknown()), // JSONスキーマを受け入れる
});

export const collectionsApp = createHonoWithDB()
	.put("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		const body = await c.req.json();
		const validatedData = collectionSchema.partial().parse(body);

		const collection = await sql.getCollection(db, { id: id });
		if (!collection) {
			return c.json({ error: "コレクションが見つかりません" }, 404);
		}

		const result = await sql.updateCollection(db, {
			id: id,
			name: validatedData.name ?? collection.name,
			slug: validatedData.slug ?? collection.slug,
			schema: validatedData.schema
				? JSON.stringify(validatedData.schema)
				: collection.schema,
		});
		if (!result) {
			return c.json({ error: "コレクションの更新に失敗しました" }, 500);
		}
		return c.json({
			...result,
			schema: JSON.parse(result.schema.toString()),
		});
	})
	.delete("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		await sql.deleteCollection(db, { id: id });
		return c.text("コレクションが削除されました", 200);
	})
	.route("/:id", itemsApp);

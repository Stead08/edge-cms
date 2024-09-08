import { z } from "zod";
import { createHonoWithDB } from "../factory";
import * as sql from "../gen/sqlc/querier";
import { validateJson } from "../utils/jsonValidator";

const itemSchema = z.object({
	collection_id: z.string(),
	status: z.string(),
	data: z.record(z.unknown()), // JSONスキーマでバリデーションされたデータ
});

export const itemsApp = createHonoWithDB()
	.post("/items", async (c) => {
		const db = c.get("db");
		const body = await c.req.json();
		try {
			const validatedData = itemSchema.parse(body);

			const collection = await sql.getCollection(db, {
				id: validatedData.collection_id,
			});
			if (!collection) {
				return c.json({ error: "コレクションが見つかりません" }, 404);
			}

			// コレクションのスキーマに対してデータをバリデーション
			const collectionSchema = JSON.parse(collection.schema as string);
			const isValid = validateJson(validatedData.data, collectionSchema);
			if (!isValid.valid) {
				return c.json({ error: isValid.errors }, 400);
			}

			const result = await sql.createItem(db, {
				id: crypto.randomUUID().toString(),
				collectionId: validatedData.collection_id,
				data: JSON.stringify(validatedData.data),
				status: validatedData.status,
			});
			if (!result) {
				return c.json({ error: "アイテムの作成に失敗しました" }, 500);
			}
			return c.json(
				{
					...result,
					data: JSON.parse(result.data.toString()),
				},
				201,
			);
		} catch (error) {
			return c.json({ error: error }, 400);
		}
	})
	.get("/", async (c) => {
		const db = c.get("db");
		const collectionId = c.req.param("id");
		if (!collectionId) {
			return c.json({ error: "コレクションIDが指定されていません" }, 400);
		}
		const result = await sql.listItems(db, { collectionId: collectionId });
		if (!result) {
			return c.json({ error: "アイテムが見つかりません" }, 404);
		}
		// result.results.dataをJSON.parseして返す、他のプロパティはそのまま返す
		const serializedData = result.results.map((item) => ({
			...item,
			data: JSON.parse(item.data.toString()),
		}));
		return c.json({
			...result,
			results: serializedData,
		});
	})
	.get("/:item_id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("item_id");
		const result = await sql.getItem(db, { id: id });
		if (!result) {
			return c.json({ error: "アイテムが見つかりません" }, 404);
		}
		return c.json({
			...result,
			data: JSON.parse(result.data.toString()),
		});
	})
	.put("/:item_id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("item_id");
		const body = await c.req.json();
		const validatedData = itemSchema.partial().parse(body);

		const item = await sql.getItem(db, { id: id });
		if (!item) {
			return c.json({ error: "アイテムが見つかりません" }, 404);
		}

		const collection = await sql.getCollection(db, { id: item.collectionId });
		if (!collection) {
			return c.json({ error: "コレクションが見つかりません" }, 404);
		}

		// コレクションのスキーマに対してデータをバリデーション
		if (validatedData.data) {
			const collectionSchema = JSON.parse(collection.schema as string);
			const validationResult = validateJson(
				validatedData.data,
				collectionSchema,
			);
			if (!validationResult.valid) {
				return c.json({ error: validationResult.errors }, 400);
			}
		}

		const result = await sql.updateItem(db, {
			id: id,
			data: validatedData.data ? JSON.stringify(validatedData.data) : item.data,
		});
		if (!result) {
			return c.json({ error: "アイテムの更新に失敗しました" }, 500);
		}
		return c.json({
			...result,
			data: JSON.parse(result.data.toString()),
		});
	})
	.delete("/:item_id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("item_id");
		await sql.deleteItem(db, { id: id });
		return c.text("アイテムが削除されました", 200);
	});

import { z } from "zod";
import { createHonoWithDB } from "../factory";
import * as sql from "../gen/sqlc/querier";

// statusのバリデーション
const statusSchema = z.enum(["draft", "published", "unpublished"]).optional();

export const itemsApp = createHonoWithDB()
	// Create a new item
	.post("/", async (c) => {
		const db = c.get("db");
		const { collection_id, status } = await c.req.json();

		// statusのバリデーション
		const validatedStatus = statusSchema.safeParse(status);
		if (!validatedStatus.success) {
			return c.json({ error: "Invalid status" }, 400);
		}

		const result = await sql.createItem(db, {
			collectionId: collection_id,
			status: validatedStatus.data ?? "draft", // undefinedの場合は'draft'を使用
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
		const { status } = await c.req.json();

		// statusのバリデーション
		const validatedStatus = statusSchema.safeParse(status);
		if (!validatedStatus.success) {
			return c.json({ error: "Invalid status" }, 400);
		}

		const result = await sql.updateItem(db, {
			id: Number(id),
			status: validatedStatus.data ?? "draft",
		});
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
		const { collection_id, status } = c.req.query();
		const result = await sql.listItems(db, {
			collectionId: Number(collection_id),
			status: status ?? null,
		});
		return c.json(result);
	})
	.get("/:collection_slug", async (c) => {
		const db = c.get("db");
		const collectionSlug = c.req.param("collection_slug");
		const page = Number(c.req.query("page") || "1");
		const limit = Number(c.req.query("limit") || "10");
		const offset = (page - 1) * limit;

		// コレクション情報を取得
		const collection = await sql.getCollectionBySlug(db, {
			slug: collectionSlug,
		});
		if (!collection) {
			return c.json({ error: "コレクションが見つかりません" }, 404);
		}

		// アイテム一覧を取得
		const items = await sql.listItemsForCollection(db, {
			collectionId: collection.id,
			limit: limit,
			offset: offset,
		});

		// 総アイテム数を取得
		const totalItems = await sql.countItemsForCollection(db, {
			collectionId: collection.id,
		});
		if (!totalItems) {
			return c.json({ error: "アイテムが見つかりません" }, 404);
		}

		// フィールド情報を取得
		const fields = await sql.getFieldsForCollection(db, {
			collectionId: collection.id,
		});

		// アイテムごとにフィールド値を取得
		const itemsWithContent = await Promise.all(
			items.results.map(async (item) => {
				const fieldValues = await sql.getFieldValuesForItem(db, {
					itemId: item.id,
				});
				const content = fieldValues.results.map((fv) => {
					const field = fields.results.find((f) => f.id === fv.fieldId);
					return {
						name: field?.name,
						type: field?.type,
						value: fv.value,
					};
				});
				return {
					...item,
					content,
				};
			}),
		);

		// 結果をJSONとして返却
		return c.json({
			collection: {
				id: collection.id,
				slug: collection.slug,
				label: collection.label,
			},
			items: itemsWithContent,
			pagination: {
				page: page,
				limit: limit,
				totalItems: totalItems.count,
				totalPages: Math.ceil(totalItems.count / limit),
			},
		});
	});

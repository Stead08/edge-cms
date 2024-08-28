import { z } from "zod";
import { createHonoWithDB } from "../factory";
import * as sql from "../gen/sqlc/querier";

const statusSchema = z.enum(["draft", "published", "unpublished"]);

const itemSchema = z.object({
	collection_id: z.number().int().positive(),
	status: statusSchema.default("draft"),
	metadata: z.record(z.unknown()).optional(),
});

export const itemsApp = createHonoWithDB()
	.post("/", async (c) => {
		const db = c.get("db");
		const body = await c.req.json();
		try {
			const validatedData = itemSchema.parse(body);
			const result = await sql.createItem(db, {
				collectionId: validatedData.collection_id,
				status: validatedData.status,
				metadata: validatedData.metadata
					? JSON.stringify(validatedData.metadata)
					: null,
			});
			return c.json(result, 201);
		} catch (error) {
			return c.json({ error: "バリデーションエラー", details: error }, 400);
		}
	})
	.get("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		const result = await sql.getItem(db, { id: Number(id) });
		if (!result) {
			return c.json({ error: "アイテムが見つかりません" }, 404);
		}
		return c.json({
			...result,
			metadata: result.metadata ? JSON.parse(result.metadata.toString()) : null,
		});
	})
	.put("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		const body = await c.req.json();
		const validatedData = itemSchema.partial().parse(body);

		const currentVersion = await sql.getItemVersion(db, { id: Number(id) });
		if (!currentVersion) {
			return c.json({ error: "アイテムが見つかりません" }, 404);
		}

		const result = await sql.updateItem(db, {
			id: Number(id),
			status: validatedData.status ?? "draft",
			metadata: validatedData.metadata
				? JSON.stringify(validatedData.metadata)
				: null,
		});
		return c.json({
			...result,
			metadata: result?.metadata
				? JSON.parse(result.metadata.toString())
				: null,
		});
	})
	.delete("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		await sql.deleteItem(db, { id: Number(id) });
		return c.text("アイテムが削除されました", 200);
	})
	.get("/collection/:collection_slug", async (c) => {
		const db = c.get("db");
		const collectionSlug = c.req.param("collection_slug");
		const page = Number(c.req.query("page") || "1");
		const limit = Number(c.req.query("limit") || "10");
		const status = c.req.query("status") || "draft";
		const offset = (page - 1) * limit;

		const collection = await sql.getCollectionBySlug(db, {
			slug: collectionSlug,
		});
		if (!collection) {
			return c.json({ error: "コレクションが見つかりません" }, 404);
		}

		const items = await sql.listItemsForCollection(db, {
			collectionId: collection.id,
			limit: limit,
			offset: offset,
		});

		const totalItems = await sql.countItemsForCollection(db, {
			collectionId: collection.id,
		});
		if (!totalItems) {
			return c.json({ error: "アイテムが見つかりません" }, 404);
		}

		const fields = await sql.getFieldsByCollection(db, {
			collectionId: collection.id,
		});

		const itemsWithContent = await Promise.all(
			items.results
				.filter((item) => item.status === status)
				.map(async (item) => {
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
					return { ...item, content };
				}),
		);

		return c.json({
			items: itemsWithContent,
			pagination: {
				page,
				limit,
				totalItems: totalItems.count,
				totalPages: Math.ceil(totalItems.count / limit),
			},
		});
	});

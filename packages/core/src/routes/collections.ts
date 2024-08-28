import { z } from "zod";
import { createHonoWithDB } from "../factory";
import * as sql from "../gen/sqlc/querier";

const collectionSchema = z.object({
	slug: z.string().min(1).max(100),
	label: z.string().min(1).max(100),
	description: z.string().optional(),
	access: z.boolean().default(true),
	default_sort: z.string().optional(),
	list_searchable_fields: z.array(z.string()).optional(),
	pagination: z.boolean().default(false),
	default_limit: z.number().int().positive().default(10),
	max_limit: z.number().int().positive().default(100),
	metadata: z.record(z.unknown()).optional(),
});

// slugとlabelのみ必須のupdateSchemaを作成
const updateCollectionSchema = z.object({
	slug: z.string().min(1).max(100),
	label: z.string().min(1).max(100),
	description: z.string().optional(),
	access: z.boolean().optional(),
	default_sort: z.string().optional(),
	list_searchable_fields: z.array(z.string()).optional(),
	pagination: z.boolean().optional(),
	default_limit: z.number().int().positive().optional(),
	max_limit: z.number().int().positive().optional(),
	metadata: z.record(z.unknown()).optional(),
});

export const collectionsApp = createHonoWithDB()
	.post("/", async (c) => {
		const db = c.get("db");
		const body = await c.req.json();
		const validatedData = collectionSchema.parse(body);

		const result = await sql.createCollection(db, {
			slug: validatedData.slug,
			label: validatedData.label,
			description: validatedData.description ?? null,
			access: validatedData.access ? 1 : 0,
			defaultSort: validatedData.default_sort ?? null,
			listSearchableFields: validatedData.list_searchable_fields
				? JSON.stringify(validatedData.list_searchable_fields)
				: null,
			pagination: validatedData.pagination ? 1 : 0,
			defaultLimit: validatedData.default_limit,
			maxLimit: validatedData.max_limit,
			metadata: validatedData.metadata
				? JSON.stringify(validatedData.metadata)
				: null,
		});
		return c.json(result, 201);
	})
	.get("/", async (c) => {
		const db = c.get("db");
		const result = await sql.listCollections(db);
		const count = await sql.countCollections(db);
		return c.json({ results: result.results, total_count: count?.count });
	})
	.get("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		const result = await sql.getCollection(db, { id: Number(id) });
		if (!result) {
			return c.json({ error: "コレクションが見つかりません" }, 404);
		}
		return c.json(result);
	})
	.put("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		const body = await c.req.json();
		const validatedData = updateCollectionSchema.parse(body);

		const result = await sql.updateCollection(db, {
			slug: validatedData.slug,
			label: validatedData.label,
			description: validatedData.description ?? null,
			access: validatedData.access ? 1 : 0,
			defaultSort: validatedData.default_sort ?? null,
			listSearchableFields: validatedData.list_searchable_fields
				? JSON.stringify(validatedData.list_searchable_fields)
				: null,
			pagination: validatedData.pagination ? 1 : 0,
			defaultLimit: validatedData.default_limit ?? null,
			maxLimit: validatedData.max_limit ?? null,
			metadata: validatedData.metadata
				? JSON.stringify(validatedData.metadata)
				: null,
			id: Number(id),
		});
		return c.json(result);
	})
	.delete("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		await sql.deleteCollection(db, { id: Number(id) });
		return c.text("コレクションが削除されました", 200);
	});

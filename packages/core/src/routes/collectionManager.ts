import { z } from "zod";
import { createHonoWithDB } from "../factory";
import * as sql from "../gen/sqlc/querier";

const collectionSchema = z.object({
	workspace_id: z.string(),
	name: z.string().min(1).max(100),
	slug: z.string().min(1).max(100),
	schema: z.record(z.unknown()), // JSONスキーマを受け入れる
});

export const collectionManagerApp = createHonoWithDB()
	.post("/", async (c) => {
		const db = c.get("db");
		try {
			const body = await c.req.json();
			const validatedData = collectionSchema.parse(body);
			const id = crypto.randomUUID().toString();

			const result = await sql.createCollection(db, {
				id: id,
				workspaceId: validatedData.workspace_id,
				name: validatedData.name,
				slug: validatedData.slug,
				schema: JSON.stringify(validatedData.schema),
			});
			return c.json(result, 201);
		} catch (error) {
			return c.json({ error: error }, 400);
		}
	})
	.get("/:workspace_id/:collection_id/schema", async (c) => {
		const db = c.get("db");
		const workspaceId = c.req.param("workspace_id");
		const collectionId = c.req.param("collection_id");
		const result = await sql.getCollectionSchema(db, {
			workspaceId: workspaceId,
			id: collectionId,
		});
		if (!result) {
			return c.json({ error: "Collection not found" }, 404);
		}
		return c.json(JSON.parse(result.schema as string));
	})
	.get("/:workspace_id", async (c) => {
		const db = c.get("db");
		const workspaceId = c.req.param("workspace_id");
		const result = await sql.listCollections(db, { workspaceId: workspaceId });
		return c.json(result);
	});

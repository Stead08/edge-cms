import { z } from "zod";
import { createHonoWithDB } from "../factory";
import * as sql from "../gen/sqlc/querier";
import { collectionsApp } from "./collections";

const workspaceSchema = z.object({
	name: z.string().min(1).max(100),
	slug: z.string().min(1).max(100),
});

export const workspacesApp = createHonoWithDB()
	.post("/", async (c) => {
		const db = c.get("db");
		const body = await c.req.json();
		try {
			const validatedData = workspaceSchema.parse(body);
			const id = `${validatedData.slug}_${crypto.randomUUID().slice(0, 8)}`;
			const result = await sql.createWorkspace(db, {
				id: id,
				name: validatedData.name,
				slug: validatedData.slug,
			});
			return c.json(result, 201);
		} catch (error) {
			return c.json({ error: error }, 400);
		}
	})
	.get("/", async (c) => {
		const db = c.get("db");
		const result = await sql.listWorkspaces(db);
		return c.json(result);
	})
	.get("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		const result = await sql.getWorkspaceById(db, { id: id });
		if (!result) {
			return c.json({ error: "ワークスペースが見つかりません" }, 404);
		}
		return c.json(result);
	})
	.put("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		const body = await c.req.json();
		const validatedData = workspaceSchema.partial().parse(body);

		const workspace = await sql.getWorkspaceById(db, { id: id });
		if (!workspace) {
			return c.json({ error: "ワークスペースが見つかりません" }, 404);
		}

		const result = await sql.updateWorkspace(db, {
			id: id,
			name: validatedData.name ?? workspace.name,
			slug: validatedData.slug ?? workspace.slug,
		});
		return c.json(result);
	})
	.delete("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		await sql.deleteWorkspace(db, { id: id });
		return c.text("ワークスペースが削除されました", 200);
	})
	.route("/:workspace_id", collectionsApp);

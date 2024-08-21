import { createHonoWithDB } from "../factory";
import * as sql from "../gen/sqlc/querier";

export const rolesApp = createHonoWithDB()
	.post("/", async (c) => {
		const db = c.get("db");
		const { name, description } = await c.req.json();
		const result = await sql.createRole(db, { name, description });
		return c.json(result, 201);
	})
	.get("/", async (c) => {
		const db = c.get("db");
		const result = await sql.listRoles(db);
		return c.json(result);
	})
	.get("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		const result = await sql.getRole(db, { id: Number(id) });
		if (!result) {
			return c.json({ error: "ロールが見つかりません" }, 404);
		}
		return c.json(result);
	})
	.put("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		const { name, description } = await c.req.json();
		const result = await sql.updateRole(db, {
			id: Number(id),
			name,
			description,
		});
		return c.json(result);
	})
	.delete("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		await sql.deleteRole(db, { id: Number(id) });
		return c.text("ロールが削除されました", 200);
	});

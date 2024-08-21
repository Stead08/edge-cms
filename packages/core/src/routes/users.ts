import { createHonoWithDB } from "../factory";
import * as sql from "../gen/sqlc/querier";

export const usersApp = createHonoWithDB()
	.post("/", async (c) => {
		const db = c.get("db");
		const { username, email, password } = await c.req.json();

		const result = await sql.createUser(db, {
			username,
			email,
			passwordHash: password,
			isAdmin: null,
		});
		return c.json(result, 201);
	})
	.get("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		const result = await sql.getUser(db, { id: Number(id) });
		if (!result) {
			return c.json({ error: "ユーザーが見つかりません" }, 404);
		}
		return c.json(result);
	})
	.put("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		const { username, email } = await c.req.json();
		const result = await sql.updateUser(db, {
			id: Number(id),
			username,
			email,
			isAdmin: null,
		});
		return c.json(result);
	})
	.delete("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		await sql.deleteUser(db, { id: Number(id) });
		return c.text("ユーザーが削除されました", 200);
	})
	.post("/:id/roles", async (c) => {
		const db = c.get("db");
		const userId = c.req.param("id");
		const { roleId } = await c.req.json();
		const result = await sql.assignRoleToUser(db, {
			userId: Number(userId),
			roleId: Number(roleId),
		});
		return c.json(result, 201);
	})
	.delete("/:id/roles/:roleId", async (c) => {
		const db = c.get("db");
		const userId = c.req.param("id");
		const roleId = c.req.param("roleId");
		await sql.removeRoleFromUser(db, {
			userId: Number(userId),
			roleId: Number(roleId),
		});
		return c.text("ロールがユーザーから削除されました", 200);
	})
	.get("/:id/roles", async (c) => {
		const db = c.get("db");
		const userId = c.req.param("id");
		const result = await sql.getUserRoles(db, { userId: Number(userId) });
		return c.json(result);
	});

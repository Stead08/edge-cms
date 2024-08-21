import { createHonoWithDB } from "../factory";
import * as sql from "../gen/sqlc/querier";
import { Role } from "../types/roleTypes";

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
		const result = await sql.getUserWithRoles(db, { id: Number(id) });
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
		const { role } = await c.req.json();

		if (!Object.values(Role).includes(role as Role)) {
			return c.json({ error: "無効なロールです" }, 400);
		}

		const result = await sql.assignRoleToUser(db, {
			userId: Number(userId),
			roleName: role,
		});
		return c.json(result, 201);
	})
	.delete("/:id/roles/:role", async (c) => {
		const db = c.get("db");
		const userId = c.req.param("id");
		const role = c.req.param("role");
		await sql.removeRoleFromUser(db, {
			userId: Number(userId),
			roleName: role,
		});
		return c.text("ロールがユーザーから削除されました", 200);
	})
	.get("/:id/roles", async (c) => {
		const db = c.get("db");
		const userId = c.req.param("id");
		const result = await sql.getUserRoles(db, { userId: Number(userId) });
		return c.json(result);
	});

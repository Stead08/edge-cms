import { z } from "zod";
import { createHonoWithDB } from "../factory";
import * as sql from "../gen/sqlc/querier";

const createUserSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().email(),
});

const roleSchema = z.object({
	roles: z.array(z.string()),
});

export const usersApp = createHonoWithDB()
	.post("/", async (c) => {
		const db = c.get("db");
		try {
			const json = await c.req.json();
			const { id, name, email } = createUserSchema.parse(json);

			const result = await sql.createUser(db, {
				id,
				name,
				email,
			});
			if (!result) {
				return c.json({ error: "ユーザーを作成できませんでした。" }, 500);
			}
			return c.json(
				{
					id: result.id,
					name: result.name,
					email: result.email,
				},
				201,
			);
		} catch (error) {
			return c.json({ error: error }, 400);
		}
	})
	.get("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		const result = await sql.getUserWithRoles(db, { id });
		if (!result) {
			return c.json({ error: "ユーザーが見つかりません" }, 404);
		}
		if (result.roles) {
			return c.json({
				...result,
				roles: JSON.parse(result.roles.toString()),
			});
		}
		return c.json(result);
	})
	.put("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		const { name, email } = await c.req.json();
		const result = await sql.updateUser(db, {
			id: id ?? null,
			name: name ?? null,
			email: email ?? null,
		});
		return c.json(result);
	})
	.delete("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		await sql.deleteUser(db, { id });
		return c.text("ユーザーが削除されました", 200);
	})
	.post("/:id/roles", async (c) => {
		const db = c.get("db");
		const userId = c.req.param("id");
		try {
			const json = await c.req.json();
			const { roles } = roleSchema.parse(json);

			const results = await Promise.all(
				roles.map((role) =>
					sql.assignRoleToUser(db, {
						userId: userId,
						roleName: role,
					}),
				),
			);
			if (results.some((result) => result === null)) {
				return c.json({ error: "ロールの割り当てに失敗しました" }, 400);
			}
			return c.json(results, 201);
		} catch (_error) {
			return c.text("ロールの割り当てに失敗しました", 400);
		}
	})
	.delete("/:id/roles/:role", async (c) => {
		const db = c.get("db");
		const userId = c.req.param("id");
		const role = c.req.param("role");
		await sql.removeRoleFromUser(db, {
			userId: userId,
			roleName: role,
		});
		return c.text("ロールがユーザーから削除されました", 200);
	})
	.get("/:id/roles", async (c) => {
		const db = c.get("db");
		const userId = c.req.param("id");
		const result = await sql.getUserRoles(db, { userId: userId });
		return c.json(result);
	});

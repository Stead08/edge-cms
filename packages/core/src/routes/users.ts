import { createHonoWithDB } from "../factory";
import * as sql from "../gen/sqlc/querier";
import { hashPassword } from "../utils/auth";

export const usersApp = createHonoWithDB()
	.post("/", async (c) => {
		const db = c.get("db");
		const secretSalt = c.get("auth_secret");
		const { id, name, email, emailVerified, image, password } =
			await c.req.json();
		const passwordhash = await hashPassword(password, secretSalt);

		const result = await sql.createUser(db, {
			id,
			name,
			email,
			emailVerified,
			image,
			passwordhash,
		});
		return c.json(result, 201);
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
		const { name, email, emailVerified, image, passwordhash } =
			await c.req.json();
		const result = await sql.updateUser(db, {
			id: id ?? null,
			name: name ?? null,
			email: email ?? null,
			emailVerified: emailVerified ?? null,
			image: image ?? null,
			passwordhash: passwordhash ?? null,
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
		const { roles } = await c.req.json();

		if (
			!Array.isArray(roles) ||
			!roles.every((role) => typeof role === "string")
		) {
			return c.json({ error: "無効なロール形式です" }, 400);
		}

		const results = await Promise.all(
			roles.map((role) =>
				sql.assignRoleToUser(db, {
					userId: userId,
					roleName: role,
				}),
			),
		);
		return c.json(results, 201);
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

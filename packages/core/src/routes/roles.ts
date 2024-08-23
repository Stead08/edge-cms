import { createHonoWithDB } from "../factory";
import * as sql from "../gen/sqlc/querier";

export const rolesApp = createHonoWithDB()
	.post("/", async (c) => {
		const db = c.get("db");
		const { name, description, permissions, assumeRolePolicy } =
			await c.req.json();
		const result = await sql.createRole(db, {
			name,
			description,
			permissions: JSON.stringify(permissions),
			assumeRolePolicy: JSON.stringify(assumeRolePolicy),
		});
		if (!result) {
			return c.json({ error: "ロールがすでに存在しています" }, 400);
		}
		if (result.permissions && result.assumeRolePolicy) {
			return c.json(
				{
					...result,
					permissions: JSON.parse(result.permissions.toString()),
					assumeRolePolicy: JSON.parse(result.assumeRolePolicy.toString()),
				},
				201,
			);
		}
		return c.json({ error: "ロールが作成できませんでした" }, 500);
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
		if (result.permissions && result.assumeRolePolicy) {
			return c.json({
				...result,
				permissions: JSON.parse(result.permissions.toString()),
				assumeRolePolicy: JSON.parse(result.assumeRolePolicy.toString()),
			});
		}
		return c.json({ error: "ロールが見つかりません" }, 404);
	})
	.put("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		const { name, description, permissions, assumeRolePolicy } =
			await c.req.json();
		const result = await sql.updateRole(db, {
			id: Number(id),
			name,
			description,
			permissions: JSON.stringify(permissions),
			assumeRolePolicy: JSON.stringify(assumeRolePolicy),
		});
		if (!result) {
			return c.json({ error: "ロールが見つかりません" }, 404);
		}
		if (result.permissions && result.assumeRolePolicy) {
			return c.json({
				...result,
				permissions: JSON.parse(result.permissions.toString()),
				assumeRolePolicy: JSON.parse(result.assumeRolePolicy.toString()),
			});
		}
		return c.json({ error: "ロールが見つかりません" }, 404);
	})
	.delete("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		await sql.deleteRole(db, { id: Number(id) });
		return c.text("ロールが削除されました", 200);
	});
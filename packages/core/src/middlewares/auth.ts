import type { Context } from "hono";
import * as sql from "../gen/sqlc/querier";

export async function checkPermission(
	c: Context,
	action: string,
	resource: string,
) {
	const db = c.get("db");
	const userId = c.get("userId");
	const result = await sql.checkUserPermission(db, {
		userId,
		action,
		resource,
	});
	if (!result?.hasPermission) {
		return c.json({ error: "アクセス権限がありません" }, 403);
	}
}

export async function requireAdmin(c: Context) {
	return checkPermission(c, "admin:*", "*");
}

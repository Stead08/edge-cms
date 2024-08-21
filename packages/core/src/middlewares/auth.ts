import type { Context } from "hono";
import * as sql from "../gen/sqlc/querier";
import { Role } from "../types/roleTypes";

export async function requireRole(c: Context, requiredRole: Role) {
	const db = c.get("db");
	const userId = c.get("userId"); // 認証ミドルウェアで設定されたユーザーID
	const userRoles = await sql.getUserRoles(db, { userId });

	if (!userRoles.results.some((role) => role.name === requiredRole)) {
		return c.json({ error: "アクセス権限がありません" }, 403);
	}
}

export async function requireAdmin(c: Context) {
	return requireRole(c, Role.ADMIN);
}

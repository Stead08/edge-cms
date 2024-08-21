import type { Context } from "hono";
import * as sql from "../gen/sqlc/querier";

export async function requireRole(c: Context, requiredRole: string) {
	const db = c.get("db");
	const userId = c.get("userId"); // 認証ミドルウェアで設定されたユーザーID
	const userRoles = await sql.getUserRoles(db, { userId });

	if (!userRoles.results.some((role) => role.name === requiredRole)) {
		return c.json({ error: "アクセス権限がありません" }, 403);
	}
}

export async function requireAdmin(c: Context) {
	const db = c.get("db");
	const userId = c.get("userId");
	const user = await sql.getUser(db, { id: userId });

	if (!user || !user.isAdmin) {
		return c.json({ error: "管理者権限が必要です" }, 403);
	}
}

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
		});
		return c.json(result);
	})
	.delete("/:id", async (c) => {
		const db = c.get("db");
		const id = c.req.param("id");
		await sql.deleteUser(db, { id: Number(id) });
		return c.text("ユーザーが削除されました", 200);
	});

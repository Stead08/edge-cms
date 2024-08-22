import { zValidator } from "@hono/zod-validator";
import { decode, jwt, sign, verify } from "hono/jwt";
import { z } from "zod";
import { createHonoWithDB } from "../factory";
import * as sql from "../gen/sqlc/querier";
import { hashPassword } from "../utils/auth";

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
});

export const authApp = createHonoWithDB()
	.post("/login", zValidator("json", loginSchema), async (c) => {
		const { email, password } = c.req.valid("json");
		const db = c.get("db");
		const secretSalt = c.get("auth_secret");
		const jwtSecret = c.get("jwt_secret");

		try {
			const user = await sql.getUserByEmail(db, { email });
			if (!user) {
				return c.json({ error: "ユーザーが見つかりません" }, 401);
			}

			const hashedPassword = await hashPassword(password, secretSalt);
			const userWithHash = await sql.getUserWithPasswordHash(db, {
				id: user.id,
			});
			if (!userWithHash || userWithHash.passwordhash !== hashedPassword) {
				return c.json({ error: "パスワードが正しくありません" }, 401);
			}

			const token = await sign({ id: user.id }, jwtSecret, "HS256");
			return c.json({ token });
		} catch (error) {
			console.error("Login error:", error);
			return c.json({ error: "ログイン処理中にエラーが発生しました" }, 500);
		}
	})
	.use("/me", (c, next) => {
		const jwtMiddleware = jwt({
			secret: c.get("jwt_secret"),
		});
		return jwtMiddleware(c, next);
	})
	.get("/me", async (c) => {
		const payload = c.get("jwtPayload");
		const userId = payload.id;
		const db = c.get("db");

		try {
			const user = await sql.getUser(db, { id: userId });
			if (!user) {
				return c.json({ error: "ユーザーが見つかりません" }, 404);
			}
			return c.json(user);
		} catch (error) {
			console.error("Get user error:", error);
			return c.json(
				{ error: "ユーザー情報の取得中にエラーが発生しました" },
				500,
			);
		}
	});

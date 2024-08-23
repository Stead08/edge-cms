import { SELF } from "cloudflare:test";

describe("Auth Routes", () => {
	it("should log in a user and return a JWT token", async () => {
		// テストユーザーを作成
		const userRes = await SELF.fetch("https://example.com/users", {
			method: "POST",
			body: JSON.stringify({
				id: "TestAuthUser",
				name: "Test Auth User",
				email: "testauth@test.com",
				emailVerified: "2024-01-01T00:00:00Z",
				image: "https://example.com/image.png",
				password: "password",
			}),
		});
		expect(userRes.status).toBe(201);

		// ログインリクエスト
		const res = await SELF.fetch("https://example.com/auth/login", {
			method: "POST",
			body: JSON.stringify({
				email: "testauth@test.com",
				password: "password",
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});

		expect(res.status).toBe(200);
		const result = await res.json();
		expect(result).toHaveProperty("token");
	});

	it("should return an error for invalid credentials", async () => {
		const res = await SELF.fetch("https://example.com/auth/login", {
			method: "POST",
			body: JSON.stringify({
				email: "test@test.com",
				password: "wrongpassword",
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});

		expect(res.status).toBe(401);
		const result = await res.json();
		expect(result).toEqual({ error: "パスワードが正しくありません" });
	});

	it("should return an error for non-existent user", async () => {
		const res = await SELF.fetch("https://example.com/auth/login", {
			method: "POST",
			body: JSON.stringify({
				email: "nonexistent@test.com",
				password: "password",
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});

		expect(res.status).toBe(401);
		const result = await res.json();
		expect(result).toEqual({ error: "ユーザーが見つかりません" });
	});

	it("should get the current user info", async () => {
		await SELF.fetch("https://example.com/users", {
			method: "POST",
			body: JSON.stringify({
				id: "userinfo",
				name: "User Info",
				email: "userinfo@test.com",
				emailVerified: "2024-01-01T00:00:00Z",
				image: "https://example.com/image.png",
				password: "password",
			}),
		});

		const loginRes = await SELF.fetch("https://example.com/auth/login", {
			method: "POST",
			body: JSON.stringify({
				email: "userinfo@test.com",
				password: "password",
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});
		const json = await loginRes.json();

		const { token } = json;

		const userRes = await SELF.fetch("https://example.com/auth/me", {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		expect(userRes.status).toBe(200);
		const user = await userRes.json();
		expect(user).toHaveProperty("id", "userinfo");
		expect(user).toHaveProperty("name", "User Info");
	});

	it("should return an error for unauthorized access with no headers Authorization", async () => {
		const res = await SELF.fetch("https://example.com/auth/me", {
			method: "GET",
		});

		expect(res.status).toBe(401);
	});
	it("should return an error for unauthorized access with invalid Bearer token", async () => {
		const res = await SELF.fetch("https://example.com/auth/me", {
			method: "GET",
			headers: {
				Authorization: "Bearer it-is-very-secret",
			},
		});
		expect(res.status).toBe(401);
	});
});

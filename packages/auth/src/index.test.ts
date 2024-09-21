import { SELF } from "cloudflare:test";

describe("auth", () => {
	beforeAll(async () => {
		const res = await SELF.fetch("http://example.com/signup", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Origin: "http://example.com",
				Host: "example.com",
			},
			body: new URLSearchParams({
				username: "testuser@example.com",
				password: "password123",
			}).toString(),
		});
		expect(res.status).toBe(200);
	});
	it("should successfully signup", async () => {
		const res = await SELF.fetch("http://example.com/signup", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Origin: "http://example.com",
				Host: "example.com",
			},
			body: new URLSearchParams({
				username: "testuser2@example.com",
				password: "password1234",
			}).toString(),
		});
		expect(res.status).toBe(200);
		const json = (await res.json()) as { success: boolean };
		expect(json.success).toBe(true);
	});

	it("should successfully login", async () => {
		const res = await SELF.fetch("http://example.com/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Origin: "http://example.com",
				Host: "example.com",
			},
			body: new URLSearchParams({
				username: "testuser@example.com",
				password: "password123",
			}).toString(),
		});
		expect(res.status).toBe(200);
		const json = (await res.json()) as { success: boolean };
		expect(json.success).toBe(true);
	});

	it("should return 400 for invalid signup data", async () => {
		const res = await SELF.fetch("http://example.com/signup", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Origin: "http://example.com",
				Host: "example.com",
			},
			body: new URLSearchParams({
				username: "invalid-email",
				password: "short",
			}).toString(),
		});
		expect(res.status).toBe(400);
	});

	it("should return 401 for invalid login credentials", async () => {
		const res = await SELF.fetch("http://example.com/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Origin: "http://example.com",
				Host: "example.com",
			},
			body: new URLSearchParams({
				username: "testuser@example.com",
				password: "wrongpassword",
			}).toString(),
		});
		expect(res.status).toBe(401);
	});
	it("should successfully logout", async () => {
		// ログイン
		const res = await SELF.fetch("http://example.com/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Origin: "http://example.com",
				Host: "example.com",
			},
			body: new URLSearchParams({
				username: "testuser@example.com",
				password: "password123",
			}).toString(),
		});
		expect(res.status).toBe(200);
		// jsonが返される
		const json = (await res.json()) as { success: boolean };
		expect(json.success).toBe(true);
		const cookie = res.headers.get("Set-Cookie") ?? "";
		expect(cookie).toBeDefined();

		// ログアウト
		const res2 = await SELF.fetch("http://example.com/logout", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Origin: "http://example.com",
				Host: "example.com",
				Cookie: cookie,
			},
		});
		expect(res2.status).toBe(200);
		// jsonが返される
		const json2 = (await res2.json()) as { success: boolean };
		expect(json2.success).toBe(true);
	});
});

import { SELF } from "cloudflare:test";

describe("roles", () => {
	it("should create a role", async () => {
		const res = await SELF.fetch("https://example.com/roles", {
			method: "POST",
			body: JSON.stringify({
				name: "Editor",
				description: "Can edit content",
			}),
		});
		expect(res.status).toBe(201);
		const role = await res.json();
		expect(role).toEqual({
			id: expect.any(Number),
			name: "Editor",
			description: "Can edit content",
			createdAt: expect.any(String),
			updatedAt: expect.any(String),
		});
	});

	it("should get a role", async () => {
		const res = await SELF.fetch("https://example.com/roles/1");
		expect(res.status).toBe(200);
		const role = await res.json();
		expect(role).toEqual({
			id: 1,
			name: "Viewer",
			description: "Can view content",
			createdAt: expect.any(String),
			updatedAt: expect.any(String),
		});
	});

	it("should update a role", async () => {
		const res = await SELF.fetch("https://example.com/roles/1", {
			method: "PUT",
			body: JSON.stringify({
				name: "Viewer",
				description: "Can view content",
			}),
		});
		expect(res.status).toBe(200);
		const role = await res.json();
		expect(role).toEqual({
			id: 1,
			name: "Viewer",
			description: "Can view content",
			createdAt: expect.any(String),
			updatedAt: expect.any(String),
		});
	});

	it("should list all roles", async () => {
		const res = await SELF.fetch("https://example.com/roles");
		expect(res.status).toBe(200);
		const json = await res.json();
		const roles = json.results;
		expect(Array.isArray(roles)).toBe(true);
		expect(roles.length).toBeGreaterThan(0);
		expect(roles[0]).toHaveProperty("id");
		expect(roles[0]).toHaveProperty("name");
		expect(roles[0]).toHaveProperty("description");
	});

	it("should delete a role", async () => {
		const res = await SELF.fetch("https://example.com/roles/1", {
			method: "DELETE",
		});
		expect(res.status).toBe(200);
		expect(await res.text()).toBe("ロールが削除されました");
	});
});

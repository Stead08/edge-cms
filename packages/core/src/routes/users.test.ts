import { SELF } from "cloudflare:test";

describe("users", () => {
	it("should create a user", async () => {
		const res = await SELF.fetch("https://example.com/users", {
			method: "POST",
			body: JSON.stringify({
				username: "John Doe",
				email: "john.doe@example.com",
				password: "password",
			}),
		});
		expect(res.status).toBe(201);
		const result = await res.json();
		expect(result.isAdmin).toBeFalsy();
		expect(result).toEqual({
			id: 2,
			username: "John Doe",
			email: "john.doe@example.com",
			passwordHash: "password",
			isAdmin: expect.any(Number),
			createdAt: expect.any(String),
			updatedAt: expect.any(String),
		});
	});
	it("should get a user", async () => {
		const res = await SELF.fetch("https://example.com/users/1");
		expect(res.status).toBe(200);
		const result = await res.json();
		expect(result.isAdmin).toBeFalsy();
		expect(result).toEqual({
			id: 1,
			username: "test",
			email: "test@test.com",
			passwordHash: "test",
			isAdmin: expect.any(Number),
			roles: "Viewer",
			createdAt: expect.any(String),
			updatedAt: expect.any(String),
		});
	});
	it("should update a user", async () => {
		const res = await SELF.fetch("https://example.com/users/1", {
			method: "PUT",
			body: JSON.stringify({
				username: "test2",
				email: "test2@test.com",
			}),
		});
		expect(res.status).toBe(200);
		const result = await res.json();
		expect(result.isAdmin).toBeFalsy();
		expect(result).toEqual({
			id: 1,
			username: "test2",
			email: "test2@test.com",
			passwordHash: "test",
			isAdmin: expect.any(Number),
			createdAt: expect.any(String),
			updatedAt: expect.any(String),
		});
	});
	it("should delete a user", async () => {
		const res = await SELF.fetch("https://example.com/users/1", {
			method: "DELETE",
		});
		expect(res.status).toBe(200);
		expect(await res.text()).toBe("ユーザーが削除されました");
	});
	it("should assign a role to a user", async () => {
		const userRes = await SELF.fetch("https://example.com/users", {
			method: "POST",
			body: JSON.stringify({
				username: "testuser",
				email: "testuser@example.com",
				password: "password",
			}),
		});
		const user = await userRes.json();

		const assignRes = await SELF.fetch(
			`https://example.com/users/${user.id}/roles`,
			{
				method: "POST",
				body: JSON.stringify({
					role: "Editor",
				}),
			},
		);
		// EditorのroleIdを取得
		const roleRes = await SELF.fetch("https://example.com/roles");
		const roles = await roleRes.json();
		const editorRole = roles.results.find(
			(role: { name: string }) => role.name === "Editor",
		);
		expect(assignRes.status).toBe(201);
		const assignedRole = await assignRes.json();
		expect(assignedRole).toEqual({
			id: expect.any(Number),
			userId: user.id,
			roleId: editorRole.id,
			createdAt: expect.any(String),
			updatedAt: expect.any(String),
		});
	});

	it("should get user roles", async () => {
		const userRes = await SELF.fetch("https://example.com/users/1/roles");
		expect(userRes.status).toBe(200);
		const json = await userRes.json();
		const roles = json.results;
		expect(Array.isArray(roles)).toBe(true);
		expect(roles.length).toBeGreaterThan(0);
		expect(roles[0]).toHaveProperty("id");
		expect(roles[0]).toHaveProperty("name");
		expect(roles[0]).toHaveProperty("description");
	});
});

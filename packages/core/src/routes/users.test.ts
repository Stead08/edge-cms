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
			roles: [
				{
					id: 1,
					name: "Viewer",
					description: "Can view content",
				},
			],
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
	it("should assign multiple roles to a user", async () => {
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
					roles: ["Editor", "Viewer"],
				}),
			},
		);
		expect(assignRes.status).toBe(201);
		const assignedRoles = await assignRes.json();
		expect(assignedRoles).toHaveLength(2);
		expect(assignedRoles[0]).toEqual({
			id: expect.any(Number),
			userId: user.id,
			roleId: expect.any(Number),
			createdAt: expect.any(String),
			updatedAt: expect.any(String),
		});
		expect(assignedRoles[1]).toEqual({
			id: expect.any(Number),
			userId: user.id,
			roleId: expect.any(Number),
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

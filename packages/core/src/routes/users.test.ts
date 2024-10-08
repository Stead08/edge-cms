import { SELF } from "cloudflare:test";

describe("users", () => {
	it("should create a user", async () => {
		const res = await SELF.fetch("https://example.com/users", {
			method: "POST",
			body: JSON.stringify({
				id: "JohnDoe",
				name: "John Doe",
				email: "john.doe@example.com",
				password: "password",
			}),
		});
		expect(res.status).toBe(201);
		const result = await res.json();
		expect(result.isAdmin).toBeFalsy();
		expect(result).toEqual({
			id: "JohnDoe",
			name: "John Doe",
			email: "john.doe@example.com",
		});
	});
	it("should get a user", async () => {
		const res = await SELF.fetch("https://example.com/users/TestUser");
		expect(res.status).toBe(200);
		const result = await res.json();
		expect(result.isAdmin).toBeFalsy();
		expect(result).toEqual({
			id: "TestUser",
			name: "Test User",
			email: "test@test.com",
			roles: [
				{
					id: 1,
					name: "Viewer",
					description: "Can view content",
				},
			],
		});
	});
	it("should update a user", async () => {
		const res = await SELF.fetch("https://example.com/users/TestUser", {
			method: "PUT",
			body: JSON.stringify({
				name: "Test User 2",
				email: "test2@test.com",
			}),
		});
		expect(res.status).toBe(200);
		const result = await res.json();
		expect(result.isAdmin).toBeFalsy();
		expect(result).toEqual({
			id: "TestUser",
			name: "Test User 2",
			email: "test2@test.com",
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
				id: "testuser",
				name: "testuser",
				email: "testuser@example.com",
			}),
		});
		expect(userRes.status).toBe(201);
		const user = await userRes.json();
		expect(user.id).toBe("testuser");
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
			roleId: expect.any(Number),
			createdAt: expect.any(String),
			updatedAt: expect.any(String),
			userId: user.id,
		});
		expect(assignedRoles[1]).toEqual({
			id: expect.any(Number),
			roleId: expect.any(Number),
			createdAt: expect.any(String),
			updatedAt: expect.any(String),
			userId: user.id,
		});
	});

	it("should get user roles", async () => {
		const userRes = await SELF.fetch(
			"https://example.com/users/TestUser/roles",
		);
		expect(userRes.status).toBe(200);
		const json = await userRes.json();
		const roles = json.results;
		expect(Array.isArray(roles)).toBe(true);
		expect(roles.length).toBeGreaterThan(0);
		expect(roles[0]).toHaveProperty("id");
		expect(roles[0]).toHaveProperty("name");
		expect(roles[0]).toHaveProperty("description");
	});
	it("should remove a role from a user", async () => {
		const res = await SELF.fetch(
			"https://example.com/users/TestUser/roles/Viewer",
			{
				method: "DELETE",
			},
		);
		expect(res.status).toBe(200);
		expect(await res.text()).toBe("ロールがユーザーから削除されました");
	});
	it("should not create a user with invalid email", async () => {
		const res = await SELF.fetch("https://example.com/users", {
			method: "POST",
			body: JSON.stringify({
				id: "InvalidUser",
				name: "Invalid User",
				email: "invalid-email",
			}),
		});
		expect(res.status).toBe(400);
	});

	it("should return 404 for non-existent user", async () => {
		const res = await SELF.fetch("https://example.com/users/non-existent-id");
		expect(res.status).toBe(404);
	});

	it("should not assign non-existent role to a user", async () => {
		const res = await SELF.fetch("https://example.com/users/TestUser/roles", {
			method: "POST",
			body: JSON.stringify({
				roles: ["NonExistentRole"],
			}),
		});
		expect(res.status).toBe(400);
	});
});

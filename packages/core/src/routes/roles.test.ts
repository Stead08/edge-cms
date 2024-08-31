import { SELF } from "cloudflare:test";
describe("roles", () => {
	it("should create a role", async () => {
		const res = await SELF.fetch("https://example.com/roles", {
			method: "POST",
			body: JSON.stringify({
				name: "TestEditor",
				description: "Can edit content",
				permissions: {
					actions: ["read", "write"],
					resources: ["posts", "comments"],
				},
				assumeRolePolicy: {
					effect: "Allow",
					principal: {
						user: ["user1", "user2"],
					},
					action: ["sts:AssumeRole"],
				},
			}),
		});
		expect(res.status).toBe(201);
		const role = await res.json();
		expect(role).toEqual({
			id: expect.any(Number),
			name: "TestEditor",
			description: "Can edit content",
			permissions: {
				actions: ["read", "write"],
				resources: ["posts", "comments"],
			},
			assumeRolePolicy: {
				effect: "Allow",
				principal: {
					user: ["user1", "user2"],
				},
				action: ["sts:AssumeRole"],
			},
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
			permissions: {
				view: true,
			},
			assumeRolePolicy: {
				view: true,
			},
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
				permissions: {
					view: true,
				},
				assumeRolePolicy: {
					view: true,
				},
			}),
		});

		expect(res.status).toBe(200);
		const role = await res.json();
		expect(role).toEqual({
			id: 1,
			name: "Viewer",
			description: "Can view content",
			permissions: {
				view: true,
			},
			assumeRolePolicy: {
				view: true,
			},
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

	it("should create a role with permissions and assume role policy", async () => {
		const res = await SELF.fetch("https://example.com/roles", {
			method: "POST",
			body: JSON.stringify({
				name: "CustomRole",
				description: "Custom role with specific permissions",
				permissions: {
					actions: ["read", "write"],
					resources: ["posts", "comments"],
				},
				assumeRolePolicy: {
					effect: "Allow",
					principal: {
						user: ["user1", "user2"],
					},
					action: ["sts:AssumeRole"],
				},
			}),
		});
		expect(res.status).toBe(201);
		const role = await res.json();
		expect(role).toEqual({
			id: expect.any(Number),
			name: "CustomRole",
			description: "Custom role with specific permissions",
			permissions: {
				actions: ["read", "write"],
				resources: ["posts", "comments"],
			},
			assumeRolePolicy: {
				effect: "Allow",
				principal: {
					user: ["user1", "user2"],
				},
				action: ["sts:AssumeRole"],
			},
			createdAt: expect.any(String),
			updatedAt: expect.any(String),
		});
	});

	it.skip("should update a role with new permissions and assume role policy", async () => {
		const res = await SELF.fetch("https://example.com/roles/1", {
			method: "PUT",
			body: JSON.stringify({
				name: "UpdatedRole",
				description: "Updated role description",
				permissions: {
					actions: ["read"],
					resources: ["posts"],
				},
				assumeRolePolicy: {
					effect: "Deny",
					principal: {
						service: ["test.example.com"],
					},
					action: ["sts:AssumeRole"],
				},
			}),
		});
		expect(res.status).toBe(200);
		const role = await res.json();
		expect(role).toEqual({
			id: 1,
			name: "UpdatedRole",
			description: "Updated role description",
			permissions: {
				actions: ["read"],
				resources: ["posts"],
			},
			assumeRolePolicy: {
				effect: "Deny",
				principal: {
					service: ["test.example.com"],
				},
				action: ["sts:AssumeRole"],
			},
			createdAt: expect.any(String),
			updatedAt: expect.any(String),
		});
	});

	it.skip("should not create a role with invalid permissions", async () => {
		const res = await SELF.fetch("https://example.com/roles", {
			method: "POST",
			body: JSON.stringify({
				name: "InvalidRole",
				description: "Invalid role",
				permissions: "invalid permissions",
				assumeRolePolicy: {},
			}),
		});
		expect(res.status).toBe(400);
	});

	it("should return 404 for non-existent role", async () => {
		const res = await SELF.fetch("https://example.com/roles/9999");
		expect(res.status).toBe(404);
	});

	it("should not update a role with invalid data", async () => {
		const res = await SELF.fetch("https://example.com/roles/1", {
			method: "PUT",
			body: JSON.stringify({
				name: "", // Empty name
				description: "Invalid update",
			}),
		});
		expect(res.status).toBe(400);
	});
});

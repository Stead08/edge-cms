import { SELF } from "cloudflare:test";

describe("Workspaces Test", () => {
	it("should create a workspace", async () => {
		const res = await SELF.fetch("https://example.com/workspaces", {
			method: "POST",
			body: JSON.stringify({
				name: "Test Workspace 1",
				slug: "test-workspace-1",
			}),
		});
		const workspace = await res.json();
		expect(res.status).toBe(201);
		expect(workspace.name).toBe("Test Workspace 1");
		expect(workspace.slug).toBe("test-workspace-1");
	});

	it("should get a workspace by id", async () => {
		const createRes = await SELF.fetch("https://example.com/workspaces", {
			method: "POST",
			body: JSON.stringify({
				name: "Test Workspace 2",
				slug: "test-workspace-2",
			}),
		});
		const createJson = await createRes.json();
		const res = await SELF.fetch(
			`https://example.com/workspaces/${createJson.id}`,
		);
		const workspace = await res.json();
		expect(res.status).toBe(200);
		expect(workspace.id).toBe(createJson.id);
		expect(workspace.name).toBe("Test Workspace 2");
	});

	it("should update a workspace", async () => {
		const createRes = await SELF.fetch("https://example.com/workspaces", {
			method: "POST",
			body: JSON.stringify({
				name: "Test Workspace 3",
				slug: "test-workspace-3",
			}),
		});
		const createJson = await createRes.json();
		const res = await SELF.fetch(
			`https://example.com/workspaces/${createJson.id}`,
			{
				method: "PUT",
				body: JSON.stringify({
					name: "Updated Test Workspace",
				}),
			},
		);
		const workspace = await res.json();
		expect(res.status).toBe(200);
		expect(workspace.name).toBe("Updated Test Workspace");
	});

	it("should delete a workspace", async () => {
		const res = await SELF.fetch("https://example.com/workspaces/1", {
			method: "DELETE",
		});
		expect(res.status).toBe(200);
		expect(await res.text()).toBe("ワークスペースが削除されました");
	});
});

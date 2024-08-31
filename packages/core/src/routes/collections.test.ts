import { SELF } from "cloudflare:test";

describe("Collections Test", () => {
	it("should update a collection", async () => {
		const createRes = await SELF.fetch("https://example.com/collection", {
			method: "POST",
			body: JSON.stringify({
				workspace_id: "test-workspace_aabbccdd",
				name: "Test Collection",
				slug: "test-collection-1",
				schema: {
					type: "object",
					properties: {
						title: { type: "string" },
						content: { type: "string" },
					},
				},
			}),
		});
		const id = (await createRes.json()).id;
		const collection_res = await SELF.fetch(
			`https://example.com/workspaces/test-workspace_aabbccdd/${id}`,
			{
				method: "PUT",
				body: JSON.stringify({
					name: "Updated Test Collection",
					schema: {
						type: "object",
						properties: {
							title: { type: "string" },
							content: { type: "string" },
							author: { type: "string" },
						},
					},
				}),
			},
		);
		const collection = await collection_res.json();
		expect(collection_res.status).toBe(200);
		expect(collection.name).toBe("Updated Test Collection");
		expect(collection.schema.properties.author).toBeDefined();
	});

	it("should delete a collection", async () => {
		const collection_res = await SELF.fetch(
			"https://example.com/workspaces/test-workspace_aabbccdd/test-collection",
			{
				method: "DELETE",
			},
		);
		expect(collection_res.status).toBe(200);
		expect(await collection_res.text()).toBe("コレクションが削除されました");
	});

	it("should not update a non-existent collection", async () => {
		const res = await SELF.fetch(
			"https://example.com/workspaces/test-workspace_aabbccdd/collections/non-existent-id",
			{
				method: "PUT",
				body: JSON.stringify({
					name: "Updated Collection",
				}),
			},
		);
		expect(res.status).toBe(404);
	});
});

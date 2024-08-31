import { SELF } from "cloudflare:test";

describe("createCollection test", () => {
	it("should create a collection", async () => {
		const collection_res = await SELF.fetch("https://example.com/collection", {
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
		expect(collection_res.status).toBe(201);
		const collection = await collection_res.json();
		expect(collection.name).toBe("Test Collection");
		expect(collection.slug).toBe("test-collection-1");
		expect(collection.schema).toBeDefined();
	});
	it("should not create a collection with invalid schema", async () => {
		const res = await SELF.fetch("https://example.com/collection", {
			method: "POST",
			body: JSON.stringify({
				workspace_id: "test-workspace_aabbccdd",
				name: "Invalid Collection",
				slug: "invalid-collection",
				schema: "invalid schema",
			}),
		});
		expect(res.status).toBe(400);
	});
	it("should get a collection", async () => {
		const collection_res = await SELF.fetch(
			"https://example.com/collection/test-workspace_aabbccdd",
		);
		expect(collection_res.status).toBe(200);
		expect(await collection_res.json()).toBeDefined();
	});
});

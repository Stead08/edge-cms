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
	it("should create a collection with mdx field", async () => {
		const collection_res = await SELF.fetch("https://example.com/collection", {
			method: "POST",
			body: JSON.stringify({
				workspace_id: "test-workspace_aabbccdd",
				name: "Test Collection with MDX",
				slug: "test-collection-2",
				schema: {
					type: "object",
					properties: {
						title: { type: "string" },
						content: { type: "string", format: "mdx" },
						author: { type: "string" },
					},
				},
			}),
		});
		expect(collection_res.status).toBe(201);
		const collection = await collection_res.json();
		expect(collection.name).toBe("Test Collection with MDX");
		expect(collection.slug).toBe("test-collection-2");
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
	it("should get a collection schema", async () => {
		const create_res = await SELF.fetch("https://example.com/collection", {
			method: "POST",
			body: JSON.stringify({
				workspace_id: "test-workspace_aabbccdd",
				name: "Test Collection",
				slug: "test-collection-2",
				schema: {
					type: "object",
				},
			}),
		});
		const collection_id = (await create_res.json()).id;
		const schema_res = await SELF.fetch(
			`https://example.com/collection/test-workspace_aabbccdd/${collection_id}/schema`,
		);
		expect(schema_res.status).toBe(200);
		expect(await schema_res.json()).toEqual({
			type: "object",
		});
	});
	it("should create a collection with mdx field schema and get schema", async () => {
		const create_res = await SELF.fetch("https://example.com/collection", {
			method: "POST",
			body: JSON.stringify({
				workspace_id: "test-workspace_aabbccdd",
				name: "Test Collection with MDX",
				slug: "test-collection-3",
				schema: {
					type: "object",
					properties: {
						title: { type: "string" },
						content: { type: "string", format: "mdx" },
						author: { type: "string" },
					},
				},
			}),
		});
		const collection_id = (await create_res.json()).id;
		const schema_res = await SELF.fetch(
			`https://example.com/collection/test-workspace_aabbccdd/${collection_id}/schema`,
		);
		expect(schema_res.status).toBe(200);
		expect(await schema_res.json()).toEqual({
			type: "object",
			properties: {
				title: { type: "string" },
				content: { type: "string", format: "mdx" },
				author: { type: "string" },
			},
		});
	});
});

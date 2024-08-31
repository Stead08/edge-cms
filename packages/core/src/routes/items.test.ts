import { SELF } from "cloudflare:test";

describe("Items Test", () => {
	it("should create an item", async () => {
		const res = await SELF.fetch(
			"https://example.com/workspaces/test-workspace_aabbccdd/test-collection/items",
			{
				method: "POST",
				body: JSON.stringify({
					collection_id: "test-collection",
					data: {
						title: "Test Item",
						content: "This is a test item",
					},
					status: "draft",
				}),
			},
		);
		expect(res.status).toBe(201);
		const item = await res.json();
		expect(item.id).toBeDefined();
		expect(item.data.title).toBe("Test Item");
		expect(item.status).toBe("draft");
	});

	it("should not create an item with invalid data", async () => {
		const res = await SELF.fetch(
			"https://example.com/workspaces/test-workspace_aabbccdd/test-collection/items",
			{
				method: "POST",
				body: JSON.stringify({
					collection_id: "test-collection",
					data: {
						title: 123, // Should be a string according to the schema
						content: "This is a test item",
					},
					status: "draft",
				}),
			},
		);
		expect(res.status).toBe(400);
	});

	it("should not create an item with missing required fields", async () => {
		const res = await SELF.fetch(
			"https://example.com/workspaces/test-workspace_aabbccdd/test-collection/items",
			{
				method: "POST",
				body: JSON.stringify({
					data: {
						// title is missing
						content: "This is a test item",
					},
					status: "draft",
				}),
			},
		);
		expect(res.status).toBe(400);
	});

	it("should return 404 for non-existent item", async () => {
		const res = await SELF.fetch(
			"https://example.com/workspaces/test-workspace_aabbccdd/test-collection/non-existent-id",
		);
		expect(res.status).toBe(404);
	});

	it("should get an item by ID", async () => {
		const res = await SELF.fetch(
			"https://example.com/workspaces/test-workspace_aabbccdd/test-collection/c851a41a-8ec6-41ac-bedc-73b2b2614f4d",
		);
		expect(res.status).toBe(200);
		const item = await res.json();
		expect(item.id).toBe("c851a41a-8ec6-41ac-bedc-73b2b2614f4d");
		expect(item.data).toBeDefined();
		expect(item.status).toBeDefined();
	});

	it("should list items for a collection", async () => {
		const res = await SELF.fetch(
			"https://example.com/workspaces/test-workspace_aabbccdd/test-collection",
		);
		expect(res.status).toBe(200);
		const items = await res.json();
		expect(items.results.length).toBe(2);
	});

	it("should update an item by ID", async () => {
		const res = await SELF.fetch(
			"https://example.com/workspaces/test-workspace_aabbccdd/test-collection/c851a41a-8ec6-41ac-bedc-73b2b2614f4d",
			{
				method: "PUT",
				body: JSON.stringify({
					data: {
						title: "Updated Test Item",
						content: "This is an updated test item",
					},
					status: "published",
				}),
			},
		);
		expect(res.status).toBe(200);
		const item = await res.json();
		expect(item.data.title).toBe("Updated Test Item");
		expect(item.status).toBe("published");
	});

	it("should not update an item with invalid data", async () => {
		const res = await SELF.fetch(
			"https://example.com/workspaces/test-workspace_aabbccdd/test-collection/c851a41a-8ec6-41ac-bedc-73b2b2614f4d",
			{
				method: "PUT",
				body: JSON.stringify({
					data: {
						title: 123, // Should be a string
						content: "Updated content",
					},
				}),
			},
		);
		expect(res.status).toBe(400);
	});

	it("should delete an item by ID", async () => {
		const res = await SELF.fetch(
			"https://example.com/workspaces/test-workspace_aabbccdd/test-collection/c851a41a-8ec6-41ac-bedc-73b2b2614f4d",
			{
				method: "DELETE",
			},
		);
		expect(res.status).toBe(200);
		expect(await res.text()).toBe("アイテムが削除されました");
	});
});

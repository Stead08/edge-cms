// collectionsのテスト
import { SELF } from "cloudflare:test";

describe("Collections Test", () => {
	it("should get a collection", async () => {
		const collection_res = await SELF.fetch(
			"https://example.com/collections/1",
		);
		const collection = await collection_res.json();
		expect(collection.slug).toBe("test");
	});
	it("should list collections", async () => {
		const collection_res = await SELF.fetch("https://example.com/collections");
		const collection = await collection_res.json();
		expect(collection.total_count).toBe(1);
	});
	it("should create a collection", async () => {
		const collection_res = await SELF.fetch("https://example.com/collections", {
			method: "POST",
			body: JSON.stringify({
				slug: "create_field_values",
				label: "create_field_values",
				description: "create_field_values",
				access: true,
				default_sort: "created_at",
				list_searchable_fields: ["created_at"],
				pagination: false,
				default_limit: 10,
				max_limit: 100,
			}),
		});
		const collection = await collection_res.json();
		expect(collection.slug).toBe("create_field_values");
		expect(collection.label).toBe("create_field_values");
		expect(collection.description).toBe("create_field_values");
		expect(collection.access).toBe(1);
	});
	it("should update a collection", async () => {
		const collection_res = await SELF.fetch(
			"https://example.com/collections/1",
			{
				method: "PUT",
				body: JSON.stringify({
					slug: "test",
					label: "test",
					description: "test",
					access: true,
					default_sort: "created_at",
					list_searchable_fields: ["created_at"],
					pagination: false,
					default_limit: 10,
					max_limit: 100,
				}),
			},
		);
		const collection = await collection_res.json();
		expect(collection.slug).toBe("test");
	});
	it("should update a partial collection", async () => {
		const collection_res = await SELF.fetch(
			"https://example.com/collections/1",
			{
				method: "PUT",
				body: JSON.stringify({
					slug: "test",
				}),
			},
		);
		expect(collection_res.status).toBe(200);
	});
	it("should delete a collection", async () => {
		const collection_res = await SELF.fetch(
			"https://example.com/collections/1",
			{
				method: "DELETE",
			},
		);
		expect(collection_res.status).toBe(200);
	});
});

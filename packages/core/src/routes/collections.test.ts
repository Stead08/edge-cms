// collectionsのテスト
import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

describe("Collections Test", () => {
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
});

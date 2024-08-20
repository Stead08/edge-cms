import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

describe("Items Test", () => {
	it("should create an item no status", async () => {
		const res = await SELF.fetch("https://example.com/items", {
			method: "POST",
			body: JSON.stringify({
				collection_id: 1,
			}),
		});
		expect(res.status).toBe(201);
		const item = await res.json();
		expect(item.id).toBeTypeOf("number");
		expect(item.status).toBe("draft");
	});
	it("should create an item with status", async () => {
		const res = await SELF.fetch("https://example.com/items", {
			method: "POST",
			body: JSON.stringify({
				collection_id: 1,
				status: "published",
			}),
		});
		expect(res.status).toBe(201);
		const item = await res.json();
		expect(item.id).toBeTypeOf("number");
		expect(item.status).toBe("published");
	});

	it("should not create an item with invalid status", async () => {
		const res = await SELF.fetch("https://example.com/items", {
			method: "POST",
			body: JSON.stringify({
				collection_id: 1,
				status: "invalid",
			}),
		});
		expect(res.status).toBe(400);
	});

	it("should get an item by ID", async () => {
		const res = await SELF.fetch("https://example.com/items/1");
		expect(res.status).toBe(200);
		const item = await res.json();
		expect(item.id).toBe(1);
		expect(item.status).toBeTypeOf("string");
	});

	it("should update an item by ID", async () => {
		const res = await SELF.fetch("https://example.com/items/1", {
			method: "PUT",
			body: JSON.stringify({
				status: "published",
			}),
		});
		expect(res.status).toBe(200);
		const item = await res.json();
		expect(item.id).toBe(1);
		expect(item.status).toBe("published");
	});
	it("should list items by collection ID", async () => {
		const res = await SELF.fetch("https://example.com/items?collection_id=1");
		expect(res.status).toBe(200);
		const items = await res.json();
		expect(items.results).toBeInstanceOf(Array);
		expect(items.results.length).toBeGreaterThan(0);
		for (const item of items.results) {
			expect(item.collectionId).toBe(1);
		}
	});
	it("should list items by collections id and status", async () => {
		const res = await SELF.fetch(
			"https://example.com/items?collection_id=1&status=published",
		);
		expect(res.status).toBe(200);
		const items = await res.json();
		expect(items.results).toBeInstanceOf(Array);
		for (const item of items.results) {
			expect(item.collectionId).toBe(1);
			expect(item.status).toBe("published");
		}
	});

	it("should delete an item by ID", async () => {
		const res = await SELF.fetch("https://example.com/items/1", {
			method: "DELETE",
		});
		expect(res.status).toBe(200);
		expect(await res.text()).toBe("アイテムが削除されました");
	});
});

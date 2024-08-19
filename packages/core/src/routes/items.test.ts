import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

describe("Items Test", () => {
	it("should create an item", async () => {
		const res = await SELF.fetch("https://example.com/items", {
			method: "POST",
			body: JSON.stringify({
				collection_id: 1,
			}),
		});
		expect(res.status).toBe(201);
		const item = await res.json();
		expect(item.id).toBeTypeOf("number");
	});
	it("should get an item by ID", async () => {
		const res = await SELF.fetch("https://example.com/items/1");
		expect(res.status).toBe(200);
		const item = await res.json();
		expect(item.id).toBe(1);
	});
	it("should update an item by ID", async () => {
		const res = await SELF.fetch("https://example.com/items/1", {
			method: "PUT",
			body: JSON.stringify({
				collection_id: 1,
			}),
		});
		expect(res.status).toBe(200);
		const item = await res.json();
		expect(item.id).toBe(1);
	});
	it("should delete an item by ID", async () => {
		const res = await SELF.fetch("https://example.com/items/1", {
			method: "DELETE",
		});
		expect(res.status).toBe(200);
		expect(await res.text()).toBe("アイテムが削除されました");
	});
});

import { SELF } from "cloudflare:test";

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

	it("should create an item with default status", async () => {
		const res = await SELF.fetch("https://example.com/items", {
			method: "POST",
			body: JSON.stringify({
				collection_id: 1,
				metadata: { key: "value" }, // メタデータの追加
			}),
		});
		expect(res.status).toBe(201);
		const item = await res.json();
		expect(item.status).toBe("draft"); // デフォルトステータスの確認
	});

	it("should create an item with specified status", async () => {
		const res = await SELF.fetch("https://example.com/items", {
			method: "POST",
			body: JSON.stringify({
				collection_id: 1,
				status: "published", // ステータスの指定
				metadata: { key: "value" },
			}),
		});
		expect(res.status).toBe(201);
		const item = await res.json();
		expect(item.status).toBe("published");
	});

	it("should not create an item with invalid collection_id", async () => {
		const res = await SELF.fetch("https://example.com/items", {
			method: "POST",
			body: JSON.stringify({
				collection_id: -1, // 無効なコレクションID
				metadata: { key: "value" },
			}),
		});
		expect(res.status).toBe(400);
	});

	it("should get an item by ID", async () => {
		const res = await SELF.fetch("https://example.com/items/1");
		expect(res.status).toBe(200);
		const item = await res.json();
		expect(item.id).toBe(1);
		expect(item.metadata).toBeDefined();
	});

	it("should update an item by ID", async () => {
		const res = await SELF.fetch("https://example.com/items/1", {
			method: "PUT",
			body: JSON.stringify({
				status: "published", // ステータスの更新
				metadata: { updatedKey: "newValue" },
			}),
		});
		expect(res.status).toBe(200);
		const item = await res.json();
		expect(item.status).toBe("published");
		expect(item.metadata).toEqual({ updatedKey: "newValue" });
	});

	it("should list items by collection ID", async () => {
		const res = await SELF.fetch("https://example.com/items/collection/test");
		expect(res.status).toBe(200);
		const json = await res.json();
		const items = json.items;
		expect(items).toBeInstanceOf(Array);
		expect(items.length).toBeGreaterThan(0);
		for (const item of items) {
			expect(item.collectionId).toBe(1);
		}
	});

	it("should list items by collections id and status", async () => {
		const res = await SELF.fetch(
			"https://example.com/items/collection/test?status=published",
		);
		expect(res.status).toBe(200);
		const json = await res.json();
		const items = json.items;
		expect(items).toBeInstanceOf(Array);
		for (const item of items) {
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

	it("should list items by collection slug", async () => {
		const res = await SELF.fetch("https://example.com/items/collection/test");
		expect(res.status).toBe(200);
		const data = await res.json();
		expect(data.items).toBeInstanceOf(Array);
		expect(data.pagination).toBeDefined();
	});
});

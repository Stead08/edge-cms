import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

describe("root", () => {
	it("should return items GET /:collection_slug?page=1&limit=10", async () => {
		const res = await SELF.fetch("https://example.com/test?page=1&limit=10");
		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({
			collection: {
				id: expect.any(Number),
				slug: expect.any(String),
				label: expect.any(String),
			},
			items: expect.any(Array),
			pagination: {
				page: 1,
				limit: 10,
				totalItems: expect.any(Number),
				totalPages: expect.any(Number),
			},
		});
	});
	it("returns some item GET /:collection_slug/:item_id/full", async () => {
		const res = await SELF.fetch("https://example.com/test/1/full");
		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({
			id: 1,
			collection: {
				id: expect.any(Number),
				slug: expect.any(String),
				label: expect.any(String),
			},
			createdAt: expect.any(String),
			updatedAt: expect.any(String),
			content: [expect.any(Object)],
		});
	});
});

import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

describe("Fields Test", () => {
	it("should create a field", async () => {
		const field_res = await SELF.fetch("https://example.com/fields", {
			method: "POST",
			body: JSON.stringify({
				collection_id: 1,
				name: "test",
				type: "text",
				required: true,
			}),
		});
		const field = await field_res.json();
		expect(field.name).toBe("test");
	});
	it("should get a field", async () => {
		const field_res = await SELF.fetch("https://example.com/fields/1");
		const field = await field_res.json();
		expect(field.name).toBe("test");
	});
	it("should update a field", async () => {
		const field_res = await SELF.fetch("https://example.com/fields/1", {
			method: "PUT",
			body: JSON.stringify({
				name: "test2",
				type: "text",
				required: true,
			}),
		});
		const field = await field_res.json();
		expect(field.name).toBe("test2");
	});
	it("should update a name field", async () => {
		const field_res = await SELF.fetch("https://example.com/fields/1", {
			method: "PUT",
			body: JSON.stringify({
				name: "test3",
			}),
		});
		const field = await field_res.json();
		expect(field.name).toBe("test3");
	});
	it("should update a type field", async () => {
		const field_res = await SELF.fetch("https://example.com/fields/1", {
			method: "PUT",
			body: JSON.stringify({
				type: "text",
			}),
		});
		const field = await field_res.json();
		expect(field.type).toBe("text");
	});
	it("should update a required field", async () => {
		const field_res = await SELF.fetch("https://example.com/fields/1", {
			method: "PUT",
			body: JSON.stringify({
				required: true,
			}),
		});
		const field = await field_res.json();
		expect(field.required).toBeTruthy();
	});
	it("should delete a field", async () => {
		const field_res = await SELF.fetch("https://example.com/fields/1", {
			method: "DELETE",
		});
		expect(field_res.status).toBe(200);
	});
});

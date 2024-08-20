import { SELF } from "cloudflare:test";

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

	it("should validate field type", async () => {
		const validation_res = await SELF.fetch(
			"https://example.com/fields/validate",
			{
				method: "POST",
				body: JSON.stringify({
					type: "text",
					value: "sample text",
				}),
			},
		);
		const validation = await validation_res.json();
		expect(validation.isValid).toBe(true);
	});

	it("should fail validation for invalid field type", async () => {
		const validation_res = await SELF.fetch(
			"https://example.com/fields/validate",
			{
				method: "POST",
				body: JSON.stringify({
					type: "number",
					value: "not a number",
				}),
			},
		);
		const validation = await validation_res.json();
		expect(validation.isValid).toBe(false);
	});

	it("should delete a field", async () => {
		const field_res = await SELF.fetch("https://example.com/fields/1", {
			method: "DELETE",
		});
		expect(field_res.status).toBe(200);
	});
});

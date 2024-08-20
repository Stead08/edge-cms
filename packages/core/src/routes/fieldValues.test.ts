import { SELF } from "cloudflare:test";

describe("FieldValues Test", () => {
	it("should create a field value", async () => {
		const fieldValue_res = await SELF.fetch(
			"https://example.com/field_values",
			{
				method: "POST",
				body: JSON.stringify({
					item_id: 1,
					field_id: 1,
					value: "test",
				}),
			},
		);
		expect(fieldValue_res.status).toBe(201);
		const fieldValue = await fieldValue_res.json();
		expect(fieldValue.value).toBe("test");
	});

	it("should not create a field value with invalid type", async () => {
		const fieldValue_res = await SELF.fetch(
			"https://example.com/field_values",
			{
				method: "POST",
				body: JSON.stringify({
					item_id: 1,
					field_id: 1,
					value: 1,
				}),
			},
		);
		expect(fieldValue_res.status).toBe(400);
	});
	it("should get a field value", async () => {
		const fieldValue_res = await SELF.fetch(
			"https://example.com/field_values/1",
		);
		const fieldValue = await fieldValue_res.json();
		expect(fieldValue.value).toBe("test");
	});
	it("should update a field value", async () => {
		const fieldValue_res = await SELF.fetch(
			"https://example.com/field_values/1",
			{
				method: "PUT",
				body: JSON.stringify({
					value: "test2",
				}),
			},
		);
		const fieldValue = await fieldValue_res.json();
		expect(fieldValue.value).toBe("test2");
	});
	it("should delete a field value", async () => {
		const fieldValue_res = await SELF.fetch(
			"https://example.com/field_values/1",
			{
				method: "DELETE",
			},
		);
		expect(fieldValue_res.status).toBe(200);
	});
});

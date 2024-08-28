import { SELF } from "cloudflare:test";

describe("FieldTemplates Test", () => {
	it("should create a field template", async () => {
		const res = await SELF.fetch("https://example.com/field_templates", {
			method: "POST",
			body: JSON.stringify({
				name: "Test Template",
				type: "text",
				required: true,
				default_value: "default",
				options: { option1: "value1" },
				metadata: { key: "value" },
			}),
		});
		expect(res.status).toBe(201);
		const template = await res.json();
		expect(template.name).toBe("Test Template");
	});

	it("should get a field template by ID", async () => {
		const res = await SELF.fetch("https://example.com/field_templates/1");
		expect(res.status).toBe(200);
		const template = await res.json();
		expect(template.id).toBe(1);
	});

	it("should update a field template", async () => {
		const res = await SELF.fetch("https://example.com/field_templates/1", {
			method: "PUT",
			body: JSON.stringify({
				name: "Updated Template",
				required: false,
			}),
		});
		expect(res.status).toBe(200);
		const template = await res.json();
		expect(template.name).toBe("Updated Template");
		expect(template.required).toBe(0); // falseは0に変換される
	});

	it("should delete a field template", async () => {
		const res = await SELF.fetch("https://example.com/field_templates/1", {
			method: "DELETE",
		});
		expect(res.status).toBe(200);
		const message = await res.text();
		expect(message).toBe("フィールドテンプレートが削除されました");
	});

	it("should return 404 for a non-existent field template", async () => {
		const res = await SELF.fetch("https://example.com/field_templates/100");
		expect(res.status).toBe(404);
		const errorResponse = await res.json();
		expect(errorResponse.error).toBe("フィールドテンプレートが見つかりません");
	});
});

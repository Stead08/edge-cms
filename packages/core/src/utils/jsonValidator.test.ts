import { validateJson } from "./jsonValidator";

describe("jsonValidator", () => {
	it("should validate JSON against a schema", () => {
		const schema = {
			type: "object",
			properties: {
				name: { type: "string" },
				age: { type: "number" },
			},
			required: ["name", "age"],
		};

		const json = { name: "John", age: 30 };
		const result = validateJson(json, schema);
		expect(result.valid).toBe(true);
	});

	it("should return false for invalid JSON", () => {
		const schema = {
			type: "object",
			properties: {
				name: { type: "string" },
				age: { type: "number" },
			},
			required: ["name", "age"],
		};

		const json = { name: "John", age: "30" };
		const result = validateJson(json, schema);
		expect(result.valid).toBe(false);
	});
});

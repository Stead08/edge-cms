import { validateRole } from "./roleValidator";

describe("roleValidator", () => {
	it("should validate role", () => {
		expect(validateRole("Viewer")).toBe(true);
	});
	it("should validate role", () => {
		expect(validateRole("Editor")).toBe(true);
	});
	it("should validate role", () => {
		expect(validateRole("Admin")).toBe(true);
	});
});

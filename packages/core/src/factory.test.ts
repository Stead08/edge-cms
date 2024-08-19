import { describe, expect, it } from "vitest";
import { createHonoWithDB } from "./factory";

describe("factory", () => {
	it("returns a factory", () => {
		const app = createHonoWithDB();
		expect(app).toBeDefined();
	});
});

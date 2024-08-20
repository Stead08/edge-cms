import { createHonoWithDB } from "./factory";

describe("factory", () => {
	it("returns a factory", () => {
		const app = createHonoWithDB();
		expect(app).toBeDefined();
	});
});

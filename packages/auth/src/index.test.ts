import { SELF } from "cloudflare:test";

describe("auth", () => {
	it("should return hello world", async () => {
		const res = await SELF.fetch("http://example.com/hello");
		expect(res.status).toBe(200);
		expect(await res.text()).toBe("Hello World");
	});
});

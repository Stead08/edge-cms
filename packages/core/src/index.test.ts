import { SELF } from "cloudflare:test";
import { describe, expect, it } from "vitest";

describe("index", () => {
	it("returns a hello hono", async () => {
		const res = await SELF.fetch("https://example.com/");
		expect(res.status).toBe(200);
		expect(await res.text()).toBe("Hello Hono");
	});
	it("returns greeting", async () => {
		const res = await SELF.fetch("https://example.com/?name=hono");
		expect(res.status).toBe(200);
		expect(await res.text()).toBe("Hello Hono");
	});
});

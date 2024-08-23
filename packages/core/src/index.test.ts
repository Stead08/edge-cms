import { SELF } from "cloudflare:test";

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
	it("should return 'test' in kv", async () => {
		const res = await SELF.fetch("https://example.com/kv?test=hello");
		expect(res.status).toBe(200);
		expect(await res.json()).toBe("hello");
	});
	it("should upload json to r2", async () => {
		const res = await SELF.fetch("https://example.com/r2", {
			method: "POST",
			body: JSON.stringify({
				id: crypto.randomUUID(),
				name: "test",
			}),
			headers: {
				"Content-Type": "application/json",
			},
		});
		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({
			status: "uploaded successfully",
			key: expect.any(String),
		});
	});
});

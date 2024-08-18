import { SELF } from "cloudflare:test";
import { it, describe, expect  } from "vitest";
import app from "./index";

describe("index", () => {
	it("returns a hello hono", async () => {
        let res = await SELF.fetch("https://example.com/");
        expect(res.status).toBe(200);
        expect(await res.text()).toBe("Hello Hono");
	});
    it("returns greeting", async () => {
        let res = await SELF.fetch("https://example.com/?name=hono");
        expect(res.status).toBe(200);
        expect(await res.text()).toBe("Hello Hono");
    });
});

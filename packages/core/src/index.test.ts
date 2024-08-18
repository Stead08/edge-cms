import { unstable_dev } from "wrangler";
import type { UnstableDevWorker } from "wrangler";

describe("GET /hello", () => {
    let worker: UnstableDevWorker;
  
    beforeAll(async () => {
      worker = await unstable_dev("./test/prepare.ts", {
        experimental: {
          disableExperimentalWarning: true,
        },
      });
    });

    afterAll(async () => {
        await worker.stop();
    });

    it("returns a greeting", async () => {
        const res = await worker.fetch("/hello?name=John");
        expect(res.status).toBe(200);
        expect(await res.text()).toBe("Hello John");
    });
});
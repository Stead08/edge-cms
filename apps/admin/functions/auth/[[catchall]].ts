
import { Hono } from "hono/tiny"

const app = new Hono<{
    Bindings: {
      AUTH: Fetcher,
    }
  }>()

app.all("*", async (c) => {
    const res = c.env.AUTH.fetch(c.req.raw);
    console.log(await res);
    return res
})


export async function onRequest(context: EventContext<Env, "/auth/*", {}>) {
    return await app.fetch(context.request, context.env)
}
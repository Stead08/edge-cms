import { getAssetFromKV } from '@cloudflare/kv-asset-handler'
import type { RequestHandler } from '@remix-run/cloudflare'
import { type AppLoadContext, createRequestHandler } from '@remix-run/cloudflare'
import { Hono } from 'hono'
import { poweredBy } from 'hono/powered-by'
import * as build from './build/server'

const app = new Hono<{
  Bindings: {
    MY_VAR: string,
    API: Fetcher,
    __STATIC_CONTENT: KVNamespace,
  }
}>()

let handler: RequestHandler | undefined

app.get('/hono', (c) => c.text(`Hono, ${c.env.MY_VAR}`))

app.on(
  'GET',
  ['/assets/*', '/favicon.ico'],
  async (c) => {
    if (process.env.NODE_ENV !== 'development' || import.meta.env.PROD) {
      const manifest = await import('__STATIC_CONTENT_MANIFEST')
      try {
        return await getAssetFromKV({
          request: c.req.raw,
          waitUntil: c.executionCtx.waitUntil.bind(c.executionCtx)
        }, {
          ASSET_NAMESPACE: c.env.__STATIC_CONTENT,
          ASSET_MANIFEST: JSON.parse(manifest.default),
        })
      } catch (e) {
        return c.notFound()
      }
    }
  }
)
app.get('/api/*', async (c) => {
  const res = await c.env.API.fetch(c.req.raw);
  console.log(res);
  return res;
})

app.use(
  async (c, next) => {
    c.env.MY_VAR = 'Hello from Hono'
    return next()
  }
)

app.all('*', async (c) => {
  const remixContext = {
    cloudflare: { env: c.env }
  } as unknown as AppLoadContext

  if (process.env.NODE_ENV !== 'development' || import.meta.env.PROD) {
    // wrangler
    // production
    const handleRemixRequest = createRequestHandler(build, 'production')
    return handleRemixRequest(c.req.raw, remixContext)
  // biome-ignore lint/style/noUselessElse: wrangler deployがelseがないと動かないので仕方なく。
  } else {
    if (!handler) {
      // @ts-expect-error it's not typed
      const build = await import('virtual:remix/server-build')
      const { createRequestHandler } = await import('@remix-run/cloudflare')
      handler = createRequestHandler(build, 'development')
    }
    return handler(c.req.raw, remixContext)
  }
})

export default app
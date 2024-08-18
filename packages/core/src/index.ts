import { Hono } from 'hono'
import { D1Database } from '@cloudflare/workers-types'

const createHonoWithDB = () => {
    const app = new Hono<{
      Bindings: {
        DB: D1Database
      }
      Variables: {
        db: D1Database
      }
    }>()
    app.use(async (c, next) => {
      c.set('db', c.env.DB)
      await next()
    })
    return app
}

export const createEdgeCms = () => {
    const app = createHonoWithDB();
    app.get('/', (c) => {
        return c.text('Hello Edge CMS!')
    });
    app.get('/users', (c) => {
        const db = c.get('db');
        const users = db.prepare('SELECT * FROM users').all();
        return c.json(users);
    })
    return app;
}

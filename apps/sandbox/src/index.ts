import { AppType, createEdgeCms } from '@repo/core';
import { hc } from 'hono/client';

const app = createEdgeCms();
const client = hc<typeof app>("");



export default app;

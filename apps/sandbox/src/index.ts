import { AppType, createEdgeCms } from '@repo/core';
import { hc } from 'hono/client';

const app = createEdgeCms().basePath("/api");



export default app;

import { AppType, createEdgeCms } from '@repo/core';
import { Hono } from 'hono';
const app = new Hono().basePath('/api').route('/*', createEdgeCms());




export default app;

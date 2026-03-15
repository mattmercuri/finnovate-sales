import { serve } from '@hono/node-server'
import { OpenAPIHono } from '@hono/zod-openapi';
import auth from './auth/auth'
import db from './db'
import { environmentConfig } from './environment';
import type { Variables } from './types';

const app = new OpenAPIHono<{ Variables: Variables }>()

app.use("*", async (c, next) => {
  c.set("db", db);
  c.set("environmentConfig", environmentConfig);
  await next();
});

app.route('/auth', auth)

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Finnovate Sales API',
    description: 'API documentation for Finnovate Sales',
  }
})

serve({
  fetch: app.fetch,
  port: 3001
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})

import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import auth from './auth.js'
import { environmentConfig } from './environment.js';
import type { Variables } from './types.js';

const app = new Hono<{ Variables: Variables }>()

app.use("*", async (c, next) => {
  c.set("environmentConfig", environmentConfig);
  await next();
});

app.route('/auth', auth)

serve({
  fetch: app.fetch,
  port: 3001
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})

import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import auth from './auth.js'
import config, { type Config } from './config.js';

type Variables = {
  config: Config;
};

const app = new Hono<{ Variables: Variables }>()

app.use("*", async (c, next) => {
  c.set("config", config);
  await next();
});

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.route('/auth', auth)

serve({
  fetch: app.fetch,
  port: 3001
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})

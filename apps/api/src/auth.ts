import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.json({ message: 'Authentication endpoint' })
})

app.post('/google', async (c) => {
  const { code } = await c.req.json();
})

export default app

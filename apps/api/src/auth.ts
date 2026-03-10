import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.json({ message: 'Authentication endpoint' })
})

export default app

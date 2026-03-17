import { serve } from '@hono/node-server'
import { OpenAPIHono } from '@hono/zod-openapi';
import { jwt } from 'hono/jwt';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { swaggerUI } from '@hono/swagger-ui';
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

app.use("*", logger())

app.use("*", cors({ origin: environmentConfig.FRONTEND_URL, credentials: true }))

app.use("*", csrf({
  origin: environmentConfig.FRONTEND_URL,
}))

app.use('*', secureHeaders({
  strictTransportSecurity: environmentConfig.IS_DEV
    ? false
    : 'max-age=31536000; includeSubDomains; preload',
  xFrameOptions: 'DENY',
  xContentTypeOptions: 'nosniff',
  referrerPolicy: 'strict-origin-when-cross-origin',
}))

app.use('/api/*', (c, next) => {
  const path = c.req.path

  if (['/api/auth/google', '/api/auth/google/callback', '/api/auth/refresh'].includes(path)) {
    return next()
  }

  const jwtMiddleware = jwt({
    secret: c.var.environmentConfig.JWT_SECRET,
    alg: 'HS256',
    cookie: 'access_token',
    verification: {
      iss: 'finnovate-sales',
      aud: 'finnovate-users'
    }
  })
  return jwtMiddleware(c, next)
})

app.route('/api/auth', auth)

if (environmentConfig.IS_DEV) {
  app.doc('/doc', {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Finnovate Sales API',
      description: 'API documentation for Finnovate Sales',
    }
  })
  app.get('/docs', swaggerUI({ url: '/doc' }))
}

serve({
  fetch: app.fetch,
  port: 3001
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})

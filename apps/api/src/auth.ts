import { Hono } from 'hono'
import { setCookie } from 'hono/cookie'
import crypto from 'crypto'
import { getGoogleOAuthClient, getRedirectUrl, signOAuthState } from './auth.services.js'

const app = new Hono()

app.get('/', (c) => {
  return c.json({ message: 'Authentication endpoint' })
})

app.get('/google', async (c) => {
  const nonce = crypto.randomBytes(16).toString('hex')
  const codeVerifier = crypto.randomBytes(32).toString('base64url')
  const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url')

  const stateToken = await signOAuthState({ nonce, codeVerifier })

  setCookie(c, 'google_oauth_state', stateToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/auth/google/callback',
    maxAge: 60 * 10
  })

  const authUrl = await getRedirectUrl(stateToken, codeChallenge)

  return c.redirect(authUrl)
})

app.post('/google/callback', async (c) => {
  const { code } = await c.req.json();
  const googleOAuthClient = getGoogleOAuthClient();

  const tokens = await googleOAuthClient.getToken(code);

})

export default app

import { Hono } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import crypto from 'crypto'
import { getGoogleOAuthClient, getRedirectUrl, signOAuthState, verifyOAuthState } from './auth.services.js'
import { environmentConfig } from './environment.js'

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
  const { code, state } = await c.req.json();
  const stateFromCookie = getCookie(c, 'google_oauth_state');

  if (!code || !state || !stateFromCookie) {
    return c.json({ error: 'Missing code or state' }, 400)
  }

  if (state !== stateFromCookie) {
    return c.json({ error: 'Invalid state' }, 400)
  }

  const statePayload = await verifyOAuthState(state)
  const codeVerifier = statePayload.codeVerifier

  if (typeof codeVerifier !== 'string' || !codeVerifier) {
    return c.json({ error: 'Invalid PKCE verifier' }, 400)
  }

  deleteCookie(c, 'google_oauth_state', {
    path: '/auth/google/callback'
  })

  const googleOAuthClient = getGoogleOAuthClient();
  const { tokens } = await googleOAuthClient.getToken({
    code,
    codeVerifier,
    redirect_uri: environmentConfig.GOOGLE_REDIRECT_URI,
  });

  if (!tokens || !tokens.id_token) {
    return c.json({ error: 'Failed to obtain tokens' }, 500)
  }

  const ticket = await googleOAuthClient.verifyIdToken({
    idToken: tokens.id_token,
    audience: environmentConfig.GOOGLE_CLIENT_ID,
  });

  const claims = ticket.getPayload();

  if (!claims || !claims.email || !claims.sub) {
    return c.json({ error: 'Invalid Google identity' }, 400)
  }

  /**
   * TODO:
   * - Move tickets, token, and claims validation to a separate service function
   * - Check if user exists in DB, if not create a new user
   * - Adjust secure cookie settings for development vs production
   * - Generate a JWT
   * - Set JWT as HttpOnly cookie
   * - Return success response (or redirect)
   * - Wrap endpoint in error handling
   * - Add logging
   * - Read environment variables from hono context
   */
})

export default app

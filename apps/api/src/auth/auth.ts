import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import crypto from 'node:crypto'
import { getGoogleOAuthClient, getRedirectUrl, signOAuthState, verifyOAuthState, signJWTToken, authConfig, verifyRefreshToken, type SignJWtPayload } from './auth.services.js'
import { CallbackSchema, OAuthRequestSchema, RefreshResponseSchema, RequestGoogleOAuthSchema, UserSchema } from './auth.schema'
import type { Context } from 'hono'
import type { Variables } from '../types'

const auth = new OpenAPIHono<{ Variables: Variables }>()

async function issueTokens(c: Context<{ Variables: Variables }>, payload: SignJWtPayload) {
  const accessToken = await signJWTToken(payload, 'access')
  const refreshToken = await signJWTToken(payload, 'refresh')

  setCookie(c, 'access_token', accessToken, {
    httpOnly: true,
    secure: !c.var.environmentConfig.IS_DEV,
    sameSite: 'strict',
    maxAge: authConfig.accessExpiration,
    path: '/'
  })
  setCookie(c, 'refresh_token', refreshToken, {
    httpOnly: true,
    secure: !c.var.environmentConfig.IS_DEV,
    sameSite: 'strict',
    maxAge: authConfig.refreshExpiration,
    path: '/'
  })
}

const requestOAuthRoute = createRoute({
  tags: ['Authentication'],
  method: 'post',
  path: '/google',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: RequestGoogleOAuthSchema
        }
      },
      description: 'Redirect to Google OAuth consent screen'
    }
  }
})

auth.openapi(requestOAuthRoute, async (c) => {
  const nonce = crypto.randomBytes(16).toString('hex')
  const codeVerifier = crypto.randomBytes(32).toString('base64url')
  const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url')

  const stateToken = await signOAuthState({ nonce, codeVerifier })

  setCookie(c, 'google_oauth_state', stateToken, {
    httpOnly: true,
    secure: !c.var.environmentConfig.IS_DEV,
    sameSite: 'strict',
    maxAge: 60 * 5,
    path: '/'
  })

  const authUrl = await getRedirectUrl(stateToken, codeChallenge)

  return c.json({ redirectTo: authUrl })
})

const callbackRoute = createRoute({
  tags: ['Authentication'],
  method: 'post',
  path: '/google/callback',
  request: {
    body: {
      content: {
        'application/json': {
          schema: OAuthRequestSchema
        }
      }
    }
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: CallbackSchema
        }
      },
      description: 'Successful Google OAuth callback'
    },
    400: {
      description: 'Invalid request'
    },
    500: {
      description: 'Internal server error'
    }
  }

})

auth.openapi(callbackRoute, async (c) => {
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

  deleteCookie(c, 'google_oauth_state')

  const googleOAuthClient = getGoogleOAuthClient();
  const { tokens } = await googleOAuthClient.getToken({
    code,
    codeVerifier,
    redirect_uri: c.var.environmentConfig.GOOGLE_REDIRECT_URI,
  });

  if (!tokens || !tokens.id_token) {
    return c.json({ error: 'Failed to obtain tokens' }, 500)
  }

  const ticket = await googleOAuthClient.verifyIdToken({
    idToken: tokens.id_token,
    audience: c.var.environmentConfig.GOOGLE_CLIENT_ID,
  });

  const claims = ticket.getPayload();

  if (!claims || !claims.email || !claims.sub) {
    return c.json({ error: 'Invalid Google identity' }, 400)
  }

  if (!claims.email_verified) {
    return c.json({ error: 'Google account email is not verified' }, 400)
  }

  const user = await c.var.db.user.upsert({
    where: { googleSubject: claims.sub },
    create: {
      email: claims.email,
      name: claims.name,
      givenName: claims.given_name,
      familyName: claims.family_name,
      profileImageUrl: claims.picture,
      googleSubject: claims.sub,
      lastLogin: new Date(),
      signupDate: new Date(),
    },
    update: {
      name: claims.name,
      email: claims.email,
      givenName: claims.given_name,
      familyName: claims.family_name,
      profileImageUrl: claims.picture,
      lastLogin: new Date(),
    },
  })

  const jwtPayload = {
    sub: user.id.toString(),
    email: user.email,
    name: user.name || ''
  }
  await issueTokens(c, jwtPayload)

  return c.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      profilePicture: user.profileImageUrl
    }
  })
})

const profileRoute = createRoute({
  tags: ['Authentication'],
  method: 'get',
  path: '/me',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: UserSchema
        }
      },
      description: 'Get current user profile'
    },
    404: {
      description: 'User not found'
    }
  }
})

auth.openapi(profileRoute, async (c) => {
  const userId = c.var.jwtPayload.sub
  const user = await c.var.db.user.findUnique({
    where: { id: parseInt(userId) }
  })

  if (!user) {
    return c.json({ error: 'User not found' }, 404)
  }

  return c.json({
    id: user.id,
    email: user.email,
    name: user.name,
    profilePicture: user.profileImageUrl
  })
})

const refreshRoutes = createRoute({
  tags: ['Authentication'],
  method: 'post',
  path: '/refresh',
  responses: {
    200: {
      content: {
        'application/json': {
          schema: RefreshResponseSchema
        }
      },
      description: 'Refresh access token'
    },
    400: {
      description: 'Missing or invalid refresh token'
    }
  }
})

auth.openapi(refreshRoutes, async (c) => {
  const refreshToken = getCookie(c, 'refresh_token')
  if (!refreshToken) {
    return c.json({ error: 'Missing refresh token' }, 400)
  }

  try {
    const payload = await verifyRefreshToken(refreshToken)

    await c.var.db.user.update({
      where: { id: parseInt(payload.sub) },
      data: { lastLogin: new Date() }
    })

    const jwtPayload: SignJWtPayload = {
      sub: payload.sub,
      email: payload.email,
      name: payload.name
    }
    await issueTokens(c, jwtPayload)
    return c.json({ success: true })
  } catch (error) {
    return c.json({ error: 'Error refreshing token' }, 400)
  }
})

const logoutRoute = createRoute({
  tags: ['Authentication'],
  method: 'post',
  path: '/logout',
  responses: {
    200: {
      description: 'Logout successful'
    }
  }
})

auth.openapi(logoutRoute, async (c) => {
  deleteCookie(c, 'access_token')
  deleteCookie(c, 'refresh_token')

  return c.json({ success: true })
})

export default auth

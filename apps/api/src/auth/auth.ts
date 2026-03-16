import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import crypto from 'node:crypto'
import { getGoogleOAuthClient, getRedirectUrl, signOAuthState, verifyOAuthState, signJWTToken, authConfig } from './auth.services.js'
import { CallbackSchema, OAuthRequestSchema, RequestGoogleOAuthSchema, UserSchema } from './auth.schema'
import type { Variables } from '../types'

const auth = new OpenAPIHono<{ Variables: Variables }>()

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
  console.log('Received Google OAuth callback with code:', code, 'and state:', state, 'State from cookie:', stateFromCookie)

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

  const user = await c.var.db.user.upsert({
    where: { email: claims.email },
    create: {
      email: claims.email,
      name: claims.name,
      givenName: claims.given_name,
      familyName: claims.family_name,
      profileImageUrl: claims.picture,
    },
    update: {
      name: claims.name,
      givenName: claims.given_name,
      familyName: claims.family_name,
      profileImageUrl: claims.picture,
    },
  })

  const jwtPayload = {
    sub: user.id.toString(),
    email: user.email,
    name: user.name || ''
  }
  const accessToken = await signJWTToken(jwtPayload, 'access')
  const refreshToken = await signJWTToken(jwtPayload, 'refresh')

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

  return c.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      profilePicture: user.profileImageUrl
    }
  })

  /**
   * TODO:
   * - Wrap endpoint in error handling
   * - Add logging
   * - Add validation and typed responses
   */
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

export default auth

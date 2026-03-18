import { type CodeChallengeMethod, OAuth2Client } from 'google-auth-library';
import { environmentConfig } from '../environment';
import { jwtVerify, SignJWT, type JWTPayload } from 'jose';

export const authConfig = {
  googleClientConfig: {
    clientId: environmentConfig.GOOGLE_CLIENT_ID,
    clientSecret: environmentConfig.GOOGLE_CLIENT_SECRET,
    redirectUri: environmentConfig.GOOGLE_REDIRECT_URI,
  },
  jwtSecret: environmentConfig.JWT_SECRET,
  accessExpiration: 60 * 15,
  refreshExpiration: 60 * 60 * 24 * 7
};

export function getGoogleOAuthClient() {
  const client = new OAuth2Client(authConfig.googleClientConfig);
  return client;
}

export async function signOAuthState(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', typ: 'code' })
    .setIssuedAt()
    .setIssuer('finnovate-sales')
    .setAudience('google-oauth-state')
    .setExpirationTime('10m')
    .sign(new TextEncoder().encode(authConfig.jwtSecret));
}

export async function getRedirectUrl(stateToken: string, codeChallenge: string, nonce: string) {
  const googleOAuthClient = getGoogleOAuthClient();
  const authUrl = googleOAuthClient.generateAuthUrl({
    access_type: 'offline',
    scope: ['openid', 'email', 'profile'],
    prompt: 'consent',
    state: stateToken,
    nonce,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256' as CodeChallengeMethod,
  });
  return authUrl;
}

export async function verifyOAuthState(stateToken: string) {
  const { payload } = await jwtVerify(stateToken, new TextEncoder().encode(authConfig.jwtSecret), {
    issuer: 'finnovate-sales',
    audience: 'google-oauth-state'
  });

  return payload;
}

export type SignJWtPayload = {
  sub: string; // user ID
  email: string;
  name?: string;
}

export async function signJWTToken(payload: SignJWtPayload, type: 'access' | 'refresh' = 'access') {
  const typeString = type === 'access' ? 'JWT' : 'refresh';
  const expirationTime = type === 'access' ?
    authConfig.accessExpiration : authConfig.refreshExpiration;
  const audience = type === 'access' ? 'finnovate-users' : 'finnovate-users-refresh';

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', typ: typeString })
    .setIssuedAt()
    .setIssuer('finnovate-sales')
    .setAudience(audience)
    .setExpirationTime(`${expirationTime}s`)
    .sign(new TextEncoder().encode(authConfig.jwtSecret));
}

export async function verifyRefreshToken(refreshToken: string) {
  const { payload } = await jwtVerify<SignJWtPayload>(
    refreshToken,
    new TextEncoder().encode(
      authConfig.jwtSecret),
    {
      issuer: 'finnovate-sales',
      audience: 'finnovate-users-refresh'
    }
  );

  return payload;
}

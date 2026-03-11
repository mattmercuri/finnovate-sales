import { type CodeChallengeMethod, OAuth2Client } from "google-auth-library";
import { environmentConfig } from "./environment.js";
import { SignJWT, type JWTPayload } from 'jose'

export function getGoogleOAuthClient() {
  const config = {
    clientId: environmentConfig.GOOGLE_CLIENT_ID,
    clientSecret: environmentConfig.GOOGLE_CLIENT_SECRET,
    redirectUri: environmentConfig.GOOGLE_REDIRECT_URI,
  };
  const client = new OAuth2Client(config);
  return client;
}

export async function signOAuthState(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setIssuer('finnovate-sales')
    .setAudience('google-oauth-state')
    .setExpirationTime('10m')
    .sign(new TextEncoder().encode(environmentConfig.JWT_SECRET));
}

export async function getRedirectUrl(stateToken: string, codeChallenge: string) {
  const googleOAuthClient = getGoogleOAuthClient();
  const authUrl = googleOAuthClient.generateAuthUrl({
    access_type: 'offline',
    scope: ['openid', 'email', 'profile'],
    prompt: 'consent',
    state: stateToken,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256' as CodeChallengeMethod,
  });
  return authUrl;
}

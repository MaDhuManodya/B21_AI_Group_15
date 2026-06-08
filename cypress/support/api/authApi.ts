// ============================================================
// authApi — JWT login helper.
// The QA Training App uses JWT Bearer tokens (despite the
// 401 error message claiming "Use Basic Auth or JWT").
//
// Flow:
//   POST /api/auth/login { username, password } -> { token, tokenType }
//   then send "Authorization: Bearer <token>" on subsequent calls.
//
// Usage in step defs (async, Cypress chainable):
//   jwtAuthHeader('admin').then((auth) => { state.auth = auth; });
//
// Tokens are cached per-role within a single spec run.
// ============================================================
import users from '../../fixtures/users.json';
import type { UserRole } from '../index.d';

const tokenCache: Partial<Record<UserRole, string>> = {};

interface JwtLoginResponse { token: string; tokenType: string }

export function jwtAuthHeader(role: UserRole): Cypress.Chainable<{ Authorization: string }> {
  const cached = tokenCache[role];
  if (cached) return cy.wrap({ Authorization: `Bearer ${cached}` }, { log: false });

  const { username, password } = users[role];
  const base = Cypress.env('apiBaseUrl') || Cypress.config('baseUrl');
  return cy
    .request({
      method: 'POST',
      url: `${base}/api/auth/login`,
      body: { username, password },
      failOnStatusCode: false,
    })
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(
          `JWT login failed for "${role}": HTTP ${res.status} — ${JSON.stringify(res.body)}`
        );
      }
      const token = (res.body as JwtLoginResponse).token;
      tokenCache[role] = token;
      return { Authorization: `Bearer ${token}` };
    });
}

export function noAuthHeader(): Record<string, string> {
  return {};
}

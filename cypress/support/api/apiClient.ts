// ============================================================
// apiClient — single wrapper around cy.request().
// Use this from every per-resource client (salesApi, plantsApi, ...).
//
// `failOnStatusCode: false` so negative tests can assert on 4xx/5xx
// without Cypress retrying or marking the step as failed.
// ============================================================

type Headers = Record<string, string>;
type Query = Record<string, string | number | boolean | undefined>;
// Body intentionally wide: per-resource clients pass their own DTO interfaces,
// which TypeScript can't structurally match against Record<string, unknown>.
type Body = object | unknown[] | string | undefined;

export interface ApiResponse<T = unknown> {
  status: number;
  body: T;
  headers: Cypress.Response<T>['headers'];
  duration: number;
}

function request<T = unknown>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  opts: { auth?: Headers; body?: Body; qs?: Query } = {}
): Cypress.Chainable<ApiResponse<T>> {
  const base = Cypress.env('apiBaseUrl') || Cypress.config('baseUrl');
  return cy
    .request<T>({
      method,
      url: `${base}${path}`,
      headers: { 'Content-Type': 'application/json', ...(opts.auth ?? {}) },
      body: opts.body,
      qs: opts.qs,
      failOnStatusCode: false,
    })
    .then((res) => ({
      status: res.status,
      body: res.body,
      headers: res.headers,
      duration: res.duration,
    }));
}

export const apiClient = {
  get:    <T = unknown>(path: string, qs?: Query, auth?: Headers) =>
            request<T>('GET', path, { auth, qs }),
  post:   <T = unknown>(path: string, body?: Body, auth?: Headers, qs?: Query) =>
            request<T>('POST', path, { auth, body, qs }),
  put:    <T = unknown>(path: string, body?: Body, auth?: Headers, qs?: Query) =>
            request<T>('PUT', path, { auth, body, qs }),
  patch:  <T = unknown>(path: string, body?: Body, auth?: Headers, qs?: Query) =>
            request<T>('PATCH', path, { auth, body, qs }),
  delete: <T = unknown>(path: string, auth?: Headers, qs?: Query) =>
            request<T>('DELETE', path, { auth, qs }),
};

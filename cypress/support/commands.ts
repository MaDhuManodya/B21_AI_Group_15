// ============================================================
// Custom Cypress commands shared by every spec.
// Implementations of the signatures declared in index.d.ts.
// ============================================================
import './index.d';
import type { UserRole } from './index.d';
import users from '../fixtures/users.json';

Cypress.Commands.add('loginUI', (role: UserRole) => {
  const { username, password } = users[role];
  cy.session(
    ['ui', role],
    () => {
      cy.visit('/ui/login');
      cy.get('input[name="username"]').type(username);
      cy.get('input[name="password"]').type(password, { log: false });
      cy.get('button[type="submit"], input[type="submit"]').first().click();
      cy.url().should('include', '/ui/dashboard');
    },
    {
      // Re-validate the cached JSESSIONID before each scenario.
      // If the server no longer recognises it, Cypress re-runs the setup.
      validate() {
        cy.request({
          url: '/ui/dashboard',
          failOnStatusCode: false,
          followRedirect: false,
        }).its('status').should('eq', 200);
      },
      cacheAcrossSpecs: true,
    }
  );
});

Cypress.Commands.add('logoutUI', () => {
  cy.request({
    method: 'POST',
    url: '/logout',
    failOnStatusCode: false,
    followRedirect: false,
  });
  Cypress.session.clearAllSavedSessions();
});

Cypress.Commands.add('apiAuth', (role: UserRole) => {
  const { username, password } = users[role];
  const token = Buffer.from(`${username}:${password}`).toString('base64');
  return cy.wrap({ Authorization: `Basic ${token}` }, { log: false });
});

Cypress.Commands.add('resetSession', () => {
  Cypress.session.clearAllSavedSessions();
});

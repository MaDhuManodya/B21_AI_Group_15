// Cypress custom-command type augmentations.
// Keeps every cy.<cmd> call type-safe across the suite.

export {};

export type UserRole = 'admin' | 'user';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Logs into the UI via /ui/login as the given role.
       * Reads credentials from cypress/fixtures/users.json.
       */
      loginUI(role: UserRole): Chainable<void>;

      /**
       * Logs out via /logout (POST) and verifies redirect to /ui/login.
       */
      logoutUI(): Chainable<void>;

      /**
       * Returns a Basic-Auth header object for the given role.
       * Use for API tests: cy.apiAuth('admin').then(auth => ...).
       */
      apiAuth(role: UserRole): Chainable<{ Authorization: string }>;

      /**
       * Reset session state between scenarios. Wraps Cypress.session.clearAllSavedSessions.
       */
      resetSession(): Chainable<void>;
    }
  }
}

// ============================================================
// BasePage — shared Page Object base class.
// Every page object should extend this and override `url`.
//
// Usage:
//   class MyPage extends BasePage {
//     readonly url = '/ui/something';
//     // page-specific selectors / actions ...
//   }
// ============================================================
export abstract class BasePage {
  abstract readonly url: string;

  visit(): Cypress.Chainable<Cypress.AUTWindow> {
    return cy.visit(this.url);
  }

  expectUrl(path: string): void {
    cy.url().should('include', path);
  }

  expectToastOrAlert(message: string | RegExp): void {
    cy.contains(message).should('be.visible');
  }
}

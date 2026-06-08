// ============================================================
// SHARED — Generic navigation + assertion steps.
// Reusable across every member's feature files.
//
// Steps provided:
//   Given the app is running at {string}
//   When  I navigate to {string}
//   When  I click the {string} button
//   Then  I should be redirected to {string}
//   Then  the URL should (remain|be) {string}
//   Then  I should see {string}
//   Then  I should NOT see {string}
//   Then  I should be redirected to the 403 page
// ============================================================
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

Given('the app is running at {string}', (baseUrl: string) => {
  cy.request({ url: baseUrl, failOnStatusCode: false }).its('status').should('be.lt', 500);
});

When('I navigate to {string}', (path: string) => {
  cy.visit(path, { failOnStatusCode: false });
});

When('I click the {string} button', (label: string) => {
  cy.contains('button, a, input[type="submit"]', label).click();
});

Then('I should be redirected to {string}', (path: string) => {
  cy.url().should('include', path);
});

Then(/^the URL should (remain|be) "([^"]+)"$/, (_word: string, path: string) => {
  cy.url().should('include', path);
});

Then('I should see {string}', (text: string) => {
  cy.contains(text).should('be.visible');
});

Then('I should NOT see {string}', (text: string) => {
  cy.contains(text).should('not.exist');
});

Then('I should be redirected to the 403 page', () => {
  cy.url().should('match', /403|access[-_ ]?denied/i);
  cy.contains(/access denied|403/i).should('be.visible');
});

// ============================================================
// SHARED — Authentication step definitions.
// Reusable across every member's feature files.
//
// Steps provided:
//   Given I am logged in as "admin"|"user"      (uses session cache — fast)
//   When  I log in as "admin"|"user"            (fills the live login form)
//   Given I am not logged in
//   When  I log out
// ============================================================
import { Given, When } from '@badeball/cypress-cucumber-preprocessor';
import type { UserRole } from '../../support/index.d';
import { LoginPage } from '../../support/pages/LoginPage';
import users from '../../fixtures/users.json';

const loginPage = new LoginPage();

Given('I am logged in as {string}', (role: string) => {
  cy.loginUI(role as UserRole);
});

When('I log in as {string}', (role: string) => {
  const creds = users[role as UserRole];
  loginPage.fillUsername(creds.username);
  loginPage.fillPassword(creds.password);
  loginPage.submit();
});

Given('I am not logged in', () => {
  cy.resetSession();
  cy.clearCookies();
});

When('I log out', () => {
  cy.logoutUI();
});

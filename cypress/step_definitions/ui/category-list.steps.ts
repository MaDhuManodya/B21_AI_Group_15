// ============================================================
// OWNER: Manodya
// Step definitions for: cypress/e2e/ui/categories/category-list.feature
//
// Reuse shared steps from step_definitions/shared/*.
// Page object: cypress/support/pages/CategoryListPage.ts
// ============================================================
import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { CategoryListPage } from '../../support/pages/CategoryListPage';

const page = new CategoryListPage();

When('I search for category {string}', (name: string) => page.search(name));

Then('the category list should show {int} row(s)', (count: number) => {
  page.rows().should('have.length', count);
});

Then('the {string} button should be visible on the categories page', (label: string) => {
  cy.contains('a,button', label).should('be.visible');
});

Then('the {string} button should NOT be visible on the categories page', (label: string) => {
  cy.contains('a,button', label).should('not.exist');
});

// TODO Manodya: add steps for sortBy, filterByParent, clickEdit, clickDelete.

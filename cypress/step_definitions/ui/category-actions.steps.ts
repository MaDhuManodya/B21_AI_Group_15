// ============================================================
// OWNER: Manodya
// Step definitions for: cypress/e2e/ui/categories/category-actions.feature
// Page object: cypress/support/pages/CategoryListPage.ts
// ============================================================
import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { CategoryListPage } from '../../support/pages/CategoryListPage';

const page = new CategoryListPage();

// TODO Manodya: implement the row-action steps.
// Examples to add:
//   When  I click the edit icon on category row {int}
//   When  I click the delete icon on category row {int}
//   When  I confirm the delete prompt
//   Then  the category {string} should be removed from the list
//   Then  no edit icon should be visible on the categories table
//   Then  no delete icon should be visible on the categories table

When('I open the categories page', () => page.visit());

Then('the categories table should be visible', () => {
  page.table().should('be.visible');
});

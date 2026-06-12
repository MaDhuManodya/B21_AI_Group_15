// ============================================================
// OWNER: Manodya
// Step definitions for: cypress/e2e/ui/categories/category-actions.feature
// Page object: cypress/support/pages/CategoryListPage.ts
// ============================================================
import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { CategoryListPage } from '../../support/pages/CategoryListPage';

const page = new CategoryListPage();

When('I open the categories page', () => page.visit());

Then('the categories table should be visible', () => {
  page.table().should('be.visible');
});

When('I click the edit icon on category row {int}', (index: number) => {
  page.clickEditOnRow(index);
});

When('I click the delete icon on category row {int}', (index: number) => {
  page.clickDeleteOnRow(index);
});

When('I confirm the delete prompt', () => {
  page.confirmDelete();
});

Then('the category {string} should be removed from the list', (name: string) => {
  page.rows().contains('td', name).should('not.exist');
});

Then('no edit icon should be visible on the categories table', () => {
  page.rows().find('a[href*="/edit/"]').should('not.exist');
});

Then('no delete icon should be visible on the categories table', () => {
  page.rows().find('button:has(svg.lucide-trash-2), button:has(.text-red-600)').should('not.exist');
});

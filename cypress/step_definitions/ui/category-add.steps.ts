// ============================================================
// OWNER: Manodya
// Step definitions for: cypress/e2e/ui/categories/category-add.feature
// Page object: cypress/support/pages/CategoryFormPage.ts
// ============================================================
import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { CategoryFormPage } from '../../support/pages/CategoryFormPage';

const form = new CategoryFormPage();

When('I enter category name {string}', (name: string) => form.setName(name));
When('I click Save on the category form', () => form.clickSave());
When('I click Cancel on the category form', () => form.clickCancel());

Then('I should see the category form success alert', () => {
  form.successAlert().should('be.visible');
});

Then('I should see the category name field error', () => {
  form.nameError().should('be.visible');
});

// TODO Manodya: add scenarios for parent-category selection, boundary lengths.

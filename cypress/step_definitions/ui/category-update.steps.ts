// ============================================================
// OWNER: Malinda
// Step definitions for: cypress/e2e/ui/categories/category-update.feature
// Page object: cypress/support/pages/CategoryFormPage.ts
// ============================================================
import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { CategoryFormPage } from '../../support/pages/CategoryFormPage';

const form = new CategoryFormPage();

When('I open the edit category page for id {int}', (id: number) => form.visitEdit(id));
When('I update the category name to {string}', (name: string) => form.setName(name));
When('I save the category form', () => form.clickSave());

Then('I should see {string} on the category page', (text: string) => {
  cy.contains(text).should('be.visible');
});

Then('I should see the {string} success message', (message: string) => {
  form.successAlert()
    .should('be.visible')
    .and('contain.text', message);
});

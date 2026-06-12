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

When('I click the cancel button', () => form.clickCancel());

Then('I should not see {string} on the category page', (text: string) => {
  cy.contains(text).should('not.exist');
});

When('I click the close icon on the error banner', () => {
  cy.get('.alert-danger .btn-close, .alert .btn-close, .btn-close').first().click();
});

Then('the error banner should be dismissed', () => {
  cy.get('.alert-danger, .alert').should('not.exist');
});

Then('the parent category dropdown should contain available categories', () => {
  form.parentSelect().find('option').should('have.length.greaterThan', 1);
});

Then('I should be able to select a category or leave it empty', () => {
  form.parentSelect().select(0);
  form.parentSelect().invoke('val').should('be.empty');
  form.parentSelect().select(1);
  form.parentSelect().invoke('val').should('not.be.empty');
});

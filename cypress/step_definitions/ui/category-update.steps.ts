// ============================================================
// OWNER: Malinda
// Step definitions for: cypress/e2e/ui/categories/category-update.feature
// Page object: cypress/support/pages/CategoryFormPage.ts
// ============================================================
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { CategoryFormPage } from '../../support/pages/CategoryFormPage';
import { categoriesApi } from '../../support/api/categoriesApi';
import { jwtAuthHeader } from '../../support/api/authApi';

const form = new CategoryFormPage();

// Id of the category provisioned by "an editable category ... exists", shared
// between that Given and the "for that category" When below.
let editableCategoryId: number | undefined;

When('I open the edit category page for id {int}', (id: number) => form.visitEdit(id));

// Find-or-create a dedicated category to edit, so the edit test never depends
// on a hard-coded id that may not exist (id 8 had been removed from the DB,
// making /ui/categories/edit/8 return 500). Idempotent: reused across runs.
Given('an editable category {string} exists', (name: string) => {
  jwtAuthHeader('admin').then((auth) => {
    categoriesApi.list(auth).then((res) => {
      const cats = (Array.isArray(res.body) ? res.body : (res.body as any).content || []) as Array<{ id: number; name: string }>;
      const found = cats.find((c) => c.name === name);
      if (found) {
        editableCategoryId = found.id;
      } else {
        categoriesApi.create(auth, { name }).then((created) => {
          editableCategoryId = created.body.id;
        });
      }
    });
  });
});

When('I open the edit category page for that category', () => {
  if (editableCategoryId == null) throw new Error('editable category id not set — Given step missed');
  form.visitEdit(editableCategoryId);
});
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

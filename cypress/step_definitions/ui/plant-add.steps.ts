// ============================================================
// Step definitions for: cypress/e2e/ui/plants/plant-add.feature
// Page object: cypress/support/pages/PlantFormPage.ts
//   (PlantFormPage is shared — Tharindu implemented the EDIT half;
//    this file covers the ADD half, including Bhawanthi's
//    UI_PLANT_ADM_001-003 scenarios.)
// ============================================================
import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { PlantFormPage } from '../../support/pages/PlantFormPage';
import { plantsApi, type PlantDto } from '../../support/api/plantsApi';
import { jwtAuthHeader } from '../../support/api/authApi';

const form = new PlantFormPage();

When('I open the Add Plant page', () => form.visitAdd());

When('I fill in the plant name {string}', (name: string) => form.setName(name));
When('I select the plant category {string}', (name: string) => form.selectCategory(name));
When('I enter the plant price {string}', (price: string) => form.setPrice(price));
When('I enter the plant quantity {string}', (qty: string) => form.setQuantity(qty));
When('I click Save on the plant form', () => form.clickSave());
When('I click Cancel on the plant form', () => form.clickCancel());

When(
  'I fill in the plant form with name {string}, category {string}, price {string} and quantity {string}',
  (name: string, categoryLabel: string, price: string, quantity: string) => {
    form.fill({ name, categoryLabel, price, quantity });
  }
);

Then('I should see the plant form success alert', () => {
  form.successAlert().should('be.visible');
});

// Distinct from the generic "redirected to /ui/plants" check: /ui/plants/add
// itself contains "/ui/plants" as a substring, so an `includes` match would
// not catch a failure to navigate away from the Add form.
Then('I should be redirected to the plants list page', () => {
  cy.url().should('match', /\/ui\/plants(\?.*)?$/);
});

Then('I should see the plant name validation error', () => {
  form.nameError().should('be.visible');
});

Then('I should see the plant name length validation error', () => {
  form.nameLengthError().should('be.visible');
});

Then('I should see the plant category validation error', () => {
  form.categoryError().should('be.visible');
});

Then('I should see the plant price validation error', () => {
  form.priceError().should('be.visible');
});

Then('I should see the plant quantity validation error', () => {
  form.quantityError().should('be.visible');
});

// Cleans up a plant created via the UI (no plantId in scenario state) by
// looking it up by name through the API.
Then('I delete the plant {string} via the API', (name: string) => {
  jwtAuthHeader('admin').then((auth) => {
    plantsApi.list(auth).then((res) => {
      const plant = (res.body as PlantDto[]).find((p) => p.name === name);
      if (plant) plantsApi.delete(auth, plant.id);
    });
  });
});

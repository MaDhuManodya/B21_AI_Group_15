// ============================================================
// OWNER: Malinda
// Step definitions for: cypress/e2e/ui/plants/plant-add.feature
// Page object: cypress/support/pages/PlantFormPage.ts
//   (PlantFormPage is shared — Tharindu implemented the EDIT half;
//    Malinda adds the ADD-specific helpers as needed.)
// ============================================================
import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { PlantFormPage } from '../../support/pages/PlantFormPage';

const form = new PlantFormPage();

When('I open the Add Plant page', () => form.visitAdd());

When('I fill in the plant name {string}', (name: string) => form.setName(name));
When('I select the plant category {string}', (name: string) => form.selectCategory(name));
When('I enter the plant price {string}', (price: string) => form.setPrice(price));
When('I enter the plant quantity {string}', (qty: string) => form.setQuantity(qty));
When('I click Save on the plant form', () => form.clickSave());
When('I click Cancel on the plant form', () => form.clickCancel());

Then('I should see the plant form success alert', () => {
  form.successAlert().should('be.visible');
});

// TODO Malinda: add scenarios for required-field validation, name length 3-25,
// price > 0, quantity >= 0, and User -> 403 on /ui/plants/add.

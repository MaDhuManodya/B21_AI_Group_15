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
When('I select a valid plant category', () => form.selectFirstCategory());
When('I enter the plant price {string}', (price: string) => form.setPrice(price));
When('I enter the plant quantity {string}', (qty: string) => form.setQuantity(qty));
When('I click Save on the plant form', () => form.clickSave());
When('I click Cancel on the plant form', () => form.clickCancel());

Then('I should see the plant form success alert', () => {
  form.successAlert().should('be.visible');
});

Then('I should see the {string} error message below the price field in red', (errorMsg: string) => {
  form.priceError()
    .should('be.visible')
    .and('contain.text', errorMsg)
    .and('have.css', 'color', 'rgb(220, 53, 69)'); // Assuming red text color
});

Then('the plant should not be created', () => {
  cy.url().should('include', '/ui/plants/add'); // Should stay on the same page
});

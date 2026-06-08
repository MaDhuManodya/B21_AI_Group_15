// ============================================================
// OWNER: Bhawanthi
// Step definitions for: cypress/e2e/ui/plants/plant-list.feature
// Page object: cypress/support/pages/PlantListPage.ts
// ============================================================
import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { PlantListPage } from '../../support/pages/PlantListPage';

const page = new PlantListPage();

When('I open the plants page', () => page.visit());
When('I search for plant {string}', (name: string) => page.search(name));

Then('the plant list should show {int} row(s)', (count: number) => {
  page.rows().should('have.length', count);
});

Then('I should see the {string} message on the plants page', (text: string) => {
  cy.contains(text).should('be.visible');
});

Then('the {string} button should be visible on the plants page', (label: string) => {
  cy.contains('a,button', label).should('be.visible');
});

Then('the {string} button should NOT be visible on the plants page', (label: string) => {
  cy.contains('a,button', label).should('not.exist');
});

// TODO Bhawanthi: add steps for sortBy, filterByCategory, "Low" badge assertion.

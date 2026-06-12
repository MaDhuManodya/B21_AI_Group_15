// ============================================================
// OWNER: Bhawanthi Pabasara (215540G)
// Step definitions for: cypress/e2e/ui/plants/plant-actions.feature
// Page object: cypress/support/pages/PlantListPage.ts
// ============================================================
import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { PlantListPage } from '../../support/pages/PlantListPage';

const page = new PlantListPage();

Then('the plants table should be visible', () => {
  page.table().should('be.visible');
});

When('I delete the plant {string} from the list and confirm the prompt', (name: string) => {
  cy.on('window:confirm', (msg) => {
    expect(msg).to.eq('Delete this plant?');
    return true;
  });
  page.deleteButtonFor(name).click();
});

Then('no edit icon should be visible on the plants table', () => {
  page.editIcons().should('not.exist');
});

Then('no delete icon should be visible on the plants table', () => {
  page.deleteForms().should('not.exist');
});

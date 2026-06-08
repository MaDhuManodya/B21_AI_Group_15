// ============================================================
// OWNER: Bhawanthi
// Step definitions for: cypress/e2e/ui/plants/plant-actions.feature
// Page object: cypress/support/pages/PlantListPage.ts
// ============================================================
import { Then } from '@badeball/cypress-cucumber-preprocessor';
import { PlantListPage } from '../../support/pages/PlantListPage';

const page = new PlantListPage();

Then('the plants table should be visible', () => {
  page.table().should('be.visible');
});

// TODO Bhawanthi: implement steps for:
//   When  I click the edit icon on plant row {int}
//   When  I click the delete icon on plant row {int}
//   When  I confirm the plant delete prompt
//   Then  no edit icon should be visible on the plants table
//   Then  no delete icon should be visible on the plants table

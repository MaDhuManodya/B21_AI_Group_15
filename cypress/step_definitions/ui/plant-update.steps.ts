// ============================================================
// OWNER: Tharindu
// Step definitions for: cypress/e2e/ui/plants/plant-update.feature
// Covers IDs: UI_PLANT_ADMIN_001, UI_PLANT_USER_001
//
// Reuses:
//   - shared/auth.steps.ts          Given I am logged in as "..."
//   - shared/common.steps.ts        When I navigate to "...",
//                                   Then I should be redirected to "..." / 403 page
//   - api/plant-update-api.steps.ts Given a plant with id {int} exists
//   - ui/plant-add.steps.ts         When I fill in the plant name "...",
//                                   When I enter the plant price "...",
//                                   When I enter the plant quantity "...",
//                                   When I click Save on the plant form
//                                   (Malinda's shared plant-form steps via PlantFormPage)
// ============================================================
import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { PlantFormPage } from '../../support/pages/PlantFormPage';
import { state } from '../../support/scenarioState';

const form = new PlantFormPage();

When('I open the edit page for plant {int}', (id: number) => {
  // Prefer the real plant id resolved by "a plant with id N exists";
  // fall back to the literal Gherkin id if that Given wasn't run.
  form.visitEdit(state.plantId ?? id);
});

Then('I should see the plant updated success message', () => {
  form.successAlert().should('be.visible');
});

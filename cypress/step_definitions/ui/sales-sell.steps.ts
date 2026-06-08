// ============================================================
// OWNER: Tharindu
// Step definitions for: cypress/e2e/ui/sales/sales-sell.feature
// Covers IDs: UI_SALES_ADMIN_001, UI_SALES_ADMIN_002, UI_SALES_USER_003
//
// Reuses shared steps:
//   - shared/auth.steps.ts        Given I am logged in as "..."
//   - shared/common.steps.ts      When I navigate to "...",
//                                 Then I should be redirected to "...",
//                                 the URL should remain "...",
//                                 I should be redirected to the 403 page
//   - api/sales-create-api.steps.ts   Given a plant exists with stock greater than 0
//                                     (records plantId + stock in scenarioState)
// ============================================================
import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { SellPlantPage } from '../../support/pages/SellPlantPage';
import { state } from '../../support/scenarioState';

const sellPage = new SellPlantPage();

When('I select the first available plant', () => {
  sellPage.selectFirstAvailablePlant().then((label) => {
    state.plantOriginalName = label;
  });
});

When('I enter a sale quantity of {string}', (qty: string) => {
  sellPage.enterQuantity(qty);
});

When('I click the Sell button', () => {
  sellPage.clickSell();
});

Then('the sold plant should appear in the sales list', () => {
  cy.url().should('include', '/ui/sales');
  if (state.plantOriginalName) {
    cy.contains('table tbody tr', state.plantOriginalName).should('exist');
  } else {
    cy.get('table tbody tr').should('have.length.greaterThan', 0);
  }
});

Then('I should see a quantity validation error on the Sell Plant page', () => {
  // Either an inline field error or a global alert is acceptable here.
  cy.get('body').then(($body) => {
    const hasInline = $body.find(':contains("Quantity must be greater than 0")').length > 0;
    const hasGlobal = $body.find('.alert-danger, [role="alert"]').length > 0;
    expect(hasInline || hasGlobal, 'quantity validation error visible').to.eq(true);
  });
});

Then('I should NOT be redirected to the sales list page', () => {
  // The form POSTs to /ui/sales; on error the same Sell Plant form is re-rendered
  // (still showing the Plant + Quantity inputs).
  cy.get('#plantId, select[name="plantId"]').should('exist');
  cy.get('#quantity, input[name="quantity"]').should('exist');
});

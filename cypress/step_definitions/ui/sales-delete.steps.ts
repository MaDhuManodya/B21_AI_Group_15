// ============================================================
// OWNER: Tharindu
// Step definitions for: cypress/e2e/ui/sales/sales-delete.feature
// Covers IDs: UI_SALES_ADMIN_004
//
// Reuses:
//   - shared/auth.steps.ts        Given I am logged in as "admin"
//   - shared/common.steps.ts      When I navigate to "..."
//   - api/sales-list-api.steps.ts Given a sale record exists
//                                 (records saleId in scenarioState)
// ============================================================
import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { SalesListPage } from '../../support/pages/SalesListPage';
import { state } from '../../support/scenarioState';

const page = new SalesListPage();

When('I capture the current sales row count', () => {
  page.rows().its('length').then((n) => {
    state.rowsBefore = n as unknown as number;
  });
});

When('I click the delete icon on the first sales row', () => {
  page.clickDeleteOnRow(0);
});

When('I confirm the delete prompt', () => {
  page.confirmDelete();
});

Then('the sales row count should decrease by 1', () => {
  cy.reload();
  page.rows().its('length').should((n) => {
    const before = state.rowsBefore ?? 0;
    expect(n).to.eq(Math.max(0, before - 1));
  });
});

// ============================================================
// OWNER: Tharindu
// Step definitions for: cypress/e2e/api/sales/sales-delete.feature
// Covers IDs: API_SALES_ADMIN_004, API_SALES_USER_003
//
// Reuses shared "Given I have ... credentials", "Given a sale record exists",
// and the response-status Then steps from sales-create / sales-list step files.
// ============================================================
import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { salesApi } from '../../support/api/salesApi';
import { state } from '../../support/scenarioState';

When('I DELETE the stored sale by id', () => {
  if (!state.auth) throw new Error('auth header missing');
  if (state.saleId == null) throw new Error('saleId not set');
  salesApi.delete(state.auth, state.saleId).then((res) => {
    state.lastResponse = { status: res.status, body: res.body };
  });
});

Then('GET the stored sale by id should return {int}', (expected: number) => {
  if (!state.auth) throw new Error('auth header missing');
  if (state.saleId == null) throw new Error('saleId not set');
  salesApi.getOne(state.auth, state.saleId).then((res) => {
    expect(res.status).to.eq(expected);
  });
});

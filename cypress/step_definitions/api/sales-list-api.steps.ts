// ============================================================
// OWNER: Tharindu
// Step definitions for: cypress/e2e/api/sales/sales-list.feature
// Covers IDs: API_SALES_ADMIN_003, API_SALES_USER_001, API_SALES_USER_005
//
// NOTE: Steps like "Given I have {string} sales API credentials" and
// "Then the sales API response status should be {int}" are defined
// in sales-create-api.steps.ts and reused (Cucumber requires unique
// step phrases across all files).
// ============================================================
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { jwtAuthHeader } from '../../support/api/authApi';
import { salesApi } from '../../support/api/salesApi';
import { state } from '../../support/scenarioState';

Given('a sale record exists', () => {
  jwtAuthHeader('admin').then((adminAuth) => {
    salesApi.list(adminAuth).then((res) => {
      expect(res.status).to.eq(200);
      const items = Array.isArray(res.body) ? res.body : [];
      if (items.length > 0) {
        state.saleId = items[0].id;
        return;
      }
      throw new Error('No sale records exist — testDataManager seed did not run');
    });
  });
});

When('I GET the sales list with page {int} size {int}', (page: number, size: number) => {
  if (!state.auth) throw new Error('auth header missing');
  salesApi.listPaged(state.auth, { page, size }).then((res) => {
    state.lastResponse = { status: res.status, body: res.body };
  });
});

When('I GET the stored sale by id', () => {
  if (!state.auth) throw new Error('auth header missing');
  if (state.saleId == null) throw new Error('saleId not set');
  salesApi.getOne(state.auth, state.saleId).then((res) => {
    state.lastResponse = { status: res.status, body: res.body };
  });
});

Then('the sales API response body should be a sales page or array', () => {
  const body = state.lastResponse?.body as unknown;
  const ok =
    Array.isArray(body) ||
    (typeof body === 'object' && body !== null && 'content' in (body as Record<string, unknown>));
  expect(ok, 'response is paginated object or array').to.eq(true);
});

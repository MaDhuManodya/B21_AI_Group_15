// ============================================================
// Step definitions for: cypress/e2e/api/sales/sales-create.feature
// Covers IDs: API_SALES_ADMIN_001, API_SALES_ADMIN_002, API_SALES_USER_002
// ============================================================
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { jwtAuthHeader } from '../../support/api/authApi';
import { salesApi } from '../../support/api/salesApi';
import { plantsApi, type PlantDto } from '../../support/api/plantsApi';
import { state } from '../../support/scenarioState';
import type { UserRole } from '../../support/index.d';

// ---------- Givens ----------
Given('I have {string} sales API credentials', (role: string) => {
  state.role = role as UserRole;
  jwtAuthHeader(role as UserRole).then((auth) => {
    state.auth = auth;
  });
});

Given('a plant exists with stock greater than 0', () => {
  // Always use Admin auth for data discovery so it works for both
  // admin and user scenarios.
  jwtAuthHeader('admin').then((adminAuth) => {
    plantsApi.list(adminAuth).then((res) => {
      expect(res.status).to.eq(200);
      const items = res.body;
      expect(items, 'No plants in DB — seed one before running').to.have.length.greaterThan(0);
      const withStock = items.find((p) => (p.quantity ?? 0) > 0) ?? items[0];
      state.plantId = withStock.id;
      state.plantStockBefore = withStock.quantity;
    });
  });
});

// ---------- When ----------
When('I POST a new sale with quantity {int}', (qty: number) => {
  if (!state.auth) throw new Error('auth header missing');
  if (state.plantId == null) throw new Error('plantId not set — Given step missed');
  salesApi.create(state.auth, { plantId: state.plantId, quantity: qty }).then((res) => {
    state.lastResponse = { status: res.status, body: res.body };
  });
});

// ---------- Thens (shared by all sales API features) ----------
Then('the sales API response status should be {int}', (expected: number) => {
  expect(state.lastResponse?.status).to.eq(expected);
});

Then('the sales API response status should be one of {int} or {int}', (a: number, b: number) => {
  expect(state.lastResponse?.status).to.be.oneOf([a, b]);
});

Then('the sales API response body should contain an {string} field', (field: string) => {
  expect(state.lastResponse?.body).to.have.property(field);
});

Then('the source plant stock should be reduced by {int}', (delta: number) => {
  if (state.plantId == null || state.plantStockBefore == null) {
    throw new Error('plantId / plantStockBefore not set');
  }
  jwtAuthHeader('admin').then((adminAuth) => {
    plantsApi.getOne(adminAuth, state.plantId!).then((res) => {
      expect(res.status).to.eq(200);
      expect((res.body as PlantDto).quantity).to.eq(state.plantStockBefore! - delta);
    });
  });
});

Then('the source plant stock should be unchanged', () => {
  if (state.plantId == null || state.plantStockBefore == null) {
    throw new Error('plantId / plantStockBefore not set');
  }
  jwtAuthHeader('admin').then((adminAuth) => {
    plantsApi.getOne(adminAuth, state.plantId!).then((res) => {
      expect(res.status).to.eq(200);
      expect((res.body as PlantDto).quantity).to.eq(state.plantStockBefore);
    });
  });
});

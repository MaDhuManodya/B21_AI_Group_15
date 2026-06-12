// ============================================================
// Step definitions for: cypress/e2e/api/plants/plant-update.feature
// ============================================================
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { plantsApi } from '../../support/api/plantsApi';
import { jwtAuthHeader } from '../../support/api/authApi';
import type { UserRole } from '../../support/index.d';

let authHeader: Record<string, string> = {};
let lastResponse: { status: number; body: unknown } | undefined;

Given('I have {string} plants API credentials', (role: string) => {
  jwtAuthHeader(role as UserRole).then((auth) => {
    authHeader = auth;
  });
});

Given('a plant with id {int} exists', (id: number) => {
  // We assume the plant exists via seed data, but we can verify it if needed
});

When('I PUT plant {int} with name {string}, price {float} and quantity {int}', (id: number, name: string, price: number, quantity: number) => {
  // We must pass categoryId as well for PUT requests. The app requires it.
  // The test data has categoryId: 17 for the QA Seed Plant. We'll use 17.
  plantsApi.update(authHeader, id, { name, price, quantity, categoryId: 17 } as any).then((r) => {
    lastResponse = r;
  });
});

Then('the plants API response status should be {int}', (status: number) => {
  expect(lastResponse?.status).to.eq(status);
});

Then('the plants API response body name should be {string}', (expectedName: string) => {
  expect((lastResponse?.body as any).name).to.eq(expectedName);
});

Then('the plant {int} name should NOT be {string}', (id: number, notName: string) => {
  plantsApi.getOne(authHeader, id).then((r) => {
    expect((r.body as any).name).to.not.eq(notName);
  });
});

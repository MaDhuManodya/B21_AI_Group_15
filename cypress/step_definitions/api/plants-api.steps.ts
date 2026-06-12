// ============================================================
// OWNER: Bhawanthi (list/get/delete) + Malinda (create)
// Step definitions for:
//   cypress/e2e/api/plants/plants-crud.feature   (Bhawanthi)
//   cypress/e2e/api/plants/plant-create.feature  (Malinda)
//
// Reuse: cypress/support/api/plantsApi.ts (Tharindu owns `update`)
//        cypress/support/api/authApi.ts   (JWT Bearer helper)
//
// Tharindu's plant-update step defs live in plant-update-api.steps.ts
// and should NOT be duplicated here.
//
// IMPORTANT: auth is JWT (async). Always do:
//   jwtAuthHeader('admin').then((auth) => { authHeader = auth; });
// ============================================================
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { plantsApi } from '../../support/api/plantsApi';
import { jwtAuthHeader, noAuthHeader } from '../../support/api/authApi';
import type { UserRole } from '../../support/index.d';

let authHeader: Record<string, string> = {};
let lastResponse: { status: number; body: unknown } | undefined;

Given('I have {string} API credentials for plants', (role: string) => {
  jwtAuthHeader(role as UserRole).then((auth) => {
    authHeader = auth;
  });
});

Given('I have no API credentials', () => {
  authHeader = noAuthHeader();
});

When('I GET the plants list', () => {
  plantsApi.list(authHeader).then((r) => { lastResponse = r; });
});

When('I GET plant {int}', (id: number) => {
  plantsApi.getOne(authHeader, id).then((r) => { lastResponse = r; });
});

When(
  'I POST a new plant {string} with price {float} and quantity {int} under category {int}',
  (name: string, price: number, quantity: number, categoryId: number) => {
    plantsApi.create(authHeader, categoryId, { name, price, quantity }).then((r) => {
      lastResponse = r;
    });
  }
);

When('I DELETE plant {int}', (id: number) => {
  plantsApi.delete(authHeader, id).then((r) => { lastResponse = r; });
});

Then('the plant API response status should be {int}', (status: number) => {
  expect(lastResponse?.status).to.eq(status);
});

When('I POST a new plant with negative price under the seed sub category', () => {
  cy.task<{ subId: number }>('db:seed').then(({ subId }) => {
    plantsApi.create(authHeader, subId, { name: 'Tulip', price: -10.0, quantity: 5 }).then((r) => {
      lastResponse = r;
    });
  });
});

// TODO Bhawanthi / Malinda: add domain Then steps (body field assertions, list size, etc.)

// ============================================================
// OWNER: Manodya (list/create/delete) + Malinda (update)
// Step definitions for:
//   cypress/e2e/api/categories/categories-crud.feature   (Manodya)
//   cypress/e2e/api/categories/category-update.feature   (Malinda)
//
// Reuse: cypress/support/api/categoriesApi.ts
//        cypress/support/api/authApi.ts   (JWT Bearer helper)
//
// IMPORTANT: auth is JWT (async). Always do:
//   jwtAuthHeader('admin').then((auth) => { authHeader = auth; });
// ============================================================
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { categoriesApi } from '../../support/api/categoriesApi';
import { jwtAuthHeader } from '../../support/api/authApi';
import type { UserRole } from '../../support/index.d';

let authHeader: Record<string, string> = {};
let lastResponse: { status: number; body: unknown } | undefined;

Given('I have {string} API credentials for categories', (role: string) => {
  jwtAuthHeader(role as UserRole).then((auth) => {
    authHeader = auth;
  });
});

When('I GET the categories list', () => {
  categoriesApi.list(authHeader).then((r) => { lastResponse = r; });
});

When('I POST a new category with name {string}', (name: string) => {
  categoriesApi.create(authHeader, { name }).then((r) => { lastResponse = r; });
});

When('I DELETE category {int}', (id: number) => {
  categoriesApi.delete(authHeader, id).then((r) => { lastResponse = r; });
});

When('I PUT category {int} with name {string}', (id: number, name: string) => {
  categoriesApi.update(authHeader, id, { name }).then((r) => { lastResponse = r; });
});

Then('the category API response status should be {int}', (status: number) => {
  expect(lastResponse?.status).to.eq(status);
});

// TODO Manodya / Malinda: add domain-specific Then steps as you need them.

When('I GET the categories summary', () => {
  categoriesApi.getSummary(authHeader).then((r) => { lastResponse = r; });
});

Then('the category API response should have {int} main categories and {int} sub categories', (expectedMain: number, expectedSub: number) => {
  expect(lastResponse?.status).to.eq(200);
  expect((lastResponse?.body as any).mainCategories).to.eq(expectedMain);
  expect((lastResponse?.body as any).subCategories).to.eq(expectedSub);
});

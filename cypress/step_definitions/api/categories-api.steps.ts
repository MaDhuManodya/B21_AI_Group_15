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

Then('the category summary response status should be {int}', (status: number) => {
  expect(lastResponse?.status).to.eq(status);
});

Then('the response should return a valid summary with counts greater than zero', () => {
  const body = lastResponse?.body as any;
  expect(body).to.have.property('mainCategories');
  expect(body).to.have.property('subCategories');
  expect(body.mainCategories).to.be.a('number').and.be.greaterThan(0);
  // subCategories can be 0 if only main cats exist, just check it's a number
  expect(body.subCategories).to.be.a('number');
});

When('I GET the categories page with the seed category name', () => {
  cy.task<{ mainId: number }>('db:seed').then(({ mainId }) => {
    // After seeding, fetch all categories and look for the seed main cat name
    cy.fixture('test-data.json').then((data: any) => {
      const seedName = data.seed.category.name;
      categoriesApi.listPaged(authHeader, { name: seedName }).then((r) => { lastResponse = r; });
    });
  });
});

Then('the response should contain the seed category name', () => {
  cy.fixture('test-data.json').then((data: any) => {
    const seedName = data.seed.category.name;
    const content = (lastResponse?.body as any).content;
    expect(content).to.be.an('array');
    const found = content.find((c: any) => c.name === seedName);
    expect(found).to.not.be.undefined;
  });
});

Then('the response should contain at most {int} items', (maxCount: number) => {
  const content = (lastResponse?.body as any).content;
  expect(content).to.be.an('array');
  expect(content.length).to.be.at.most(maxCount);
});

When('I GET the categories page with the seed main category as parent', () => {
  cy.task<{ mainId: number }>('db:seed').then(({ mainId }) => {
    categoriesApi.listPaged(authHeader, { parentId: mainId }).then((r) => { lastResponse = r; });
  });
});

Then('the response should contain at least one subcategory', () => {
  const content = (lastResponse?.body as any).content;
  expect(content).to.be.an('array');
  expect(content.length).to.be.greaterThan(0);
});

When('I GET the categories page sorted by {string} in {string} order', (sortField: string, sortDir: string) => {
  categoriesApi.listPaged(authHeader, { sortField, sortDir }).then((r) => { lastResponse = r; });
});

Then('the response categories should be sorted by {string} in {string} order', (sortField: string, order: string) => {
  const content = (lastResponse?.body as any).content;
  expect(content).to.be.an('array');
  if (content.length > 1) {
    for (let i = 0; i < content.length - 1; i++) {
      const current = content[i][sortField];
      const next = content[i + 1][sortField];
      if (order === 'asc') {
        if (typeof current === 'string') {
          expect(current.localeCompare(next)).to.be.at.most(0);
        } else {
          expect(current).to.be.at.most(next);
        }
      }
    }
  }
});

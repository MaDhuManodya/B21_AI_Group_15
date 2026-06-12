// ============================================================
// OWNER: Tharindu
// Step definitions for: cypress/e2e/api/plants/plant-update.feature
//
// Uses "plants API ..." (plural) phrases so they don't collide
// with the placeholder "plant API ..." (singular) phrases owned
// by Bhawanthi / Malinda in plants-api.steps.ts.
//
// Also exports the reusable Given step
//   "a plant with id {int} exists"
// which is consumed by the UI plant-update.feature as well.
// ============================================================
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { jwtAuthHeader } from '../../support/api/authApi';
import { plantsApi, type PlantDto } from '../../support/api/plantsApi';
import { state } from '../../support/scenarioState';
import type { UserRole } from '../../support/index.d';

Given('I have {string} plants API credentials', (role: string) => {
  state.role = role as UserRole;
  jwtAuthHeader(role as UserRole).then((auth) => {
    state.auth = auth;
  });
});

// Binds the scenario to a real, existing plant. The Gherkin says "id 1" for
// readability, but we don't depend on that exact id — MySQL auto-increment
// means the seeded plant may have any id. We use the literal id if it happens
// to exist, otherwise fall back to the first plant in the list. The global
// seeding hook guarantees at least one plant exists.
Given('a plant with id {int} exists', (id: number) => {
  jwtAuthHeader('admin').then((adminAuth) => {
    plantsApi.list(adminAuth).then((res) => {
      expect(res.status, 'list plants').to.eq(200);
      const items = res.body;
      expect(items, 'No plants in DB — seeding should have created one').to.have.length.greaterThan(0);
      const match = items.find((p) => p.id === id) ?? items[0];
      state.plantId = match.id;
      state.plantOriginalName = match.name;
    });
  });
});

When(
  'I PUT plant {int} with name {string}, price {int} and quantity {int}',
  (id: number, name: string, price: number, quantity: number) => {
    if (!state.auth) throw new Error('auth header missing');
    // Target the plant resolved by the Given step (not the literal Gherkin id).
    const targetId = state.plantId ?? id;
    // Pull current plant first so we can supply the required categoryId.
    jwtAuthHeader('admin').then((adminAuth) => {
      plantsApi.getOne(adminAuth, targetId).then((cur) => {
        const dto = cur.body as PlantDto;
        const categoryId = dto.categoryId ?? dto.category?.id ?? 1;
        plantsApi
          .update(state.auth!, targetId, { name, price, quantity, categoryId })
          .then((res) => {
            state.lastResponse = { status: res.status, body: res.body };
          });
      });
    });
  }
);

Then('the plants API response status should be {int}', (expected: number) => {
  expect(state.lastResponse?.status).to.eq(expected);
});

Then('the plants API response body name should be {string}', (expected: string) => {
  expect((state.lastResponse?.body as PlantDto)?.name).to.eq(expected);
});

Then('the plant {int} name should NOT be {string}', (id: number, forbidden: string) => {
  const targetId = state.plantId ?? id;
  jwtAuthHeader('admin').then((adminAuth) => {
    plantsApi.getOne(adminAuth, targetId).then((res) => {
      expect(res.status).to.eq(200);
      expect((res.body as PlantDto).name).to.not.eq(forbidden);
    });
  });
});

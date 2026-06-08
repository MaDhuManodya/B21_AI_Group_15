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

Given('a plant with id {int} exists', (id: number) => {
  jwtAuthHeader('admin').then((adminAuth) => {
    plantsApi.getOne(adminAuth, id).then((res) => {
      expect(res.status, `plant id ${id} should exist`).to.eq(200);
      state.plantId = id;
      state.plantOriginalName = (res.body as PlantDto).name;
    });
  });
});

When(
  'I PUT plant {int} with name {string}, price {int} and quantity {int}',
  (id: number, name: string, price: number, quantity: number) => {
    if (!state.auth) throw new Error('auth header missing');
    // Pull current plant first so we can supply the required categoryId.
    jwtAuthHeader('admin').then((adminAuth) => {
      plantsApi.getOne(adminAuth, id).then((cur) => {
        const dto = cur.body as PlantDto;
        const categoryId = dto.categoryId ?? dto.category?.id ?? 1;
        plantsApi
          .update(state.auth!, id, { name, price, quantity, categoryId })
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
  jwtAuthHeader('admin').then((adminAuth) => {
    plantsApi.getOne(adminAuth, id).then((res) => {
      expect(res.status).to.eq(200);
      expect((res.body as PlantDto).name).to.not.eq(forbidden);
    });
  });
});

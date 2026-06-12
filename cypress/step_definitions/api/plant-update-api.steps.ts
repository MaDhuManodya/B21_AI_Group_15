// ============================================================
// Step definitions for: cypress/e2e/api/plants/plant-update.feature
// Covers IDs: API_PLANT_ADMIN_001, API_PLANT_USER_001
//
// Uses "plants API ..." (plural) phrases so they don't collide
// with the placeholder "plant API ..." (singular) phrases owned
// by Bhawanthi / Malinda in plants-api.steps.ts.
//
// Also exports the reusable Given step
//   "a plant with id {int} exists"
// which is consumed by the UI plant-update.feature as well.
//
// NOTE ON "plant 1": the test-case document targets plant id 1, but on a
// freshly created DB the seed plant may have a different id. The Given step
// below resolves the requested id to a REAL plant (preferring the requested
// id, else the first available plant) and stores it in state.plantId. The
// When/Then steps then act on state.plantId, so the suite never depends on a
// specific hard-coded id existing.
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
      if (res.status === 200) {
        state.plantId = id;
        state.plantOriginalName = (res.body as PlantDto).name;
        return;
      }
      // Requested id is absent — fall back to the first real plant in the DB.
      plantsApi.list(adminAuth).then((listRes) => {
        expect(listRes.status).to.eq(200);
        const items = listRes.body;
        expect(items, 'No plants in DB — seed one before running').to.have.length.greaterThan(0);
        state.plantId = items[0].id;
        state.plantOriginalName = items[0].name;
      });
    });
  });
});

When(
  'I PUT plant {int} with name {string}, price {int} and quantity {int}',
  (_id: number, name: string, price: number, quantity: number) => {
    if (!state.auth) throw new Error('auth header missing');
    const target = state.plantId;
    if (target == null) throw new Error('plantId not set — "a plant with id N exists" must run first');
    // Pull current plant first so we can supply the required categoryId.
    jwtAuthHeader('admin').then((adminAuth) => {
      plantsApi.getOne(adminAuth, target).then((cur) => {
        const dto = cur.body as PlantDto;
        const categoryId = dto.categoryId ?? dto.category?.id ?? 1;
        plantsApi
          .update(state.auth!, target, { name, price, quantity, categoryId })
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

Then('the plant {int} name should be {string}', (_id: number, expected: string) => {
  const target = state.plantId;
  if (target == null) throw new Error('plantId not set');
  jwtAuthHeader('admin').then((adminAuth) => {
    plantsApi.getOne(adminAuth, target).then((res) => {
      expect(res.status).to.eq(200);
      expect((res.body as PlantDto).name).to.eq(expected);
    });
  });
});

Then('the plant {int} name should NOT be {string}', (_id: number, forbidden: string) => {
  const target = state.plantId;
  if (target == null) throw new Error('plantId not set');
  jwtAuthHeader('admin').then((adminAuth) => {
    plantsApi.getOne(adminAuth, target).then((res) => {
      expect(res.status).to.eq(200);
      expect((res.body as PlantDto).name).to.not.eq(forbidden);
    });
  });
});

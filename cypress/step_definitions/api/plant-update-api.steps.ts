// ============================================================
// Step definitions for: cypress/e2e/api/plants/plant-update.feature
// Covers IDs: API_PLANT_ADMIN_001, API_PLANT_USER_001
// ============================================================
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { jwtAuthHeader } from '../../support/api/authApi';
import { plantsApi, type PlantDto } from '../../support/api/plantsApi';
import { state } from '../../support/scenarioState';
import type { UserRole } from '../../support/index.d';

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

When(
  'I PUT that plant with name {string} price {float} and quantity {int} under category {int}',
  (name: string, price: number, quantity: number, categoryId: number) => {
    plantsApi.update(state.auth!, state.plantId!, { name, price, quantity, categoryId }).then((res) => {
      state.lastResponse = res;
    });
  }
);

Then(
  'the response should reflect name {string} price {float} and quantity {int}',
  (name: string, price: number, quantity: number) => {
    const body = state.lastResponse?.body as { name: string; price: number; quantity: number };
    expect(body.name).to.eq(name);
    expect(body.price).to.eq(price);
    expect(body.quantity).to.eq(quantity);
  }
);

Then(
  'a subsequent GET for that plant should show name {string} price {float} and quantity {int}',
  (name: string, price: number, quantity: number) => {
    plantsApi.getOne(state.auth!, state.plantId!).then((res) => {
      const body = res.body as { name: string; price: number; quantity: number };
      expect(body.name).to.eq(name);
      expect(body.price).to.eq(price);
      expect(body.quantity).to.eq(quantity);
    });
  }
);

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

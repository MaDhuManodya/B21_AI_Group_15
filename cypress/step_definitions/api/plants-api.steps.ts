import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { plantsApi } from '../../support/api/plantsApi';
import { jwtAuthHeader, noAuthHeader } from '../../support/api/authApi';
import { state } from '../../support/scenarioState';
import type { UserRole } from '../../support/index.d';

// --- GIVEN STEPS ---

Given('I have {string} plants API credentials', (role: string) => {
  state.role = role as UserRole;
  jwtAuthHeader(role as UserRole).then((auth) => {
    state.auth = auth;
  });
});

Given('I have no API credentials', () => {
  state.auth = noAuthHeader();
});

// --- WHEN STEPS ---

When('I GET the plants list', () => {
  plantsApi.list(state.auth ?? {}).then((r) => { state.lastResponse = r; });
});

When('I GET plant {int}', (id: number) => {
  plantsApi.getOne(state.auth ?? {}, id).then((r) => { state.lastResponse = r; });
});

When(
  'I POST a new plant {string} with price {float} and quantity {int} under category {int}',
  (name: string, price: number, quantity: number, categoryId: number) => {
    plantsApi.create(state.auth ?? {}, categoryId, { name, price, quantity }).then((r) => {
      state.lastResponse = r;
    });
  }
);

When('I DELETE plant {int}', (id: number) => {
  plantsApi.delete(state.auth ?? {}, id).then((r) => { state.lastResponse = r; });
});

// --- THEN STEPS ---

Then('the plants API response status should be {int}', (status: number) => {
  expect(state.lastResponse?.status).to.eq(status);
});

Then('the plants API response body name should be {string}', (expectedName: string) => {
  const body = state.lastResponse?.body as { name: string } | undefined;
  expect(body?.name).to.eq(expectedName);
});

Then('the response message should contain {string}', (expectedMessage: string) => {
  const bodyString = JSON.stringify(state.lastResponse?.body);
  expect(bodyString).to.include(expectedMessage);
});

Then('the response should contain a list of plants', () => {
  expect(state.lastResponse?.body).to.be.an('array');
});

Then('the response should contain a valid paginated plant list schema', () => {
  expect(state.lastResponse?.body).to.be.an('array');
});

Then('a subsequent GET for plant {int} should return 404', (id: number) => {
  plantsApi.getOne(state.auth ?? {}, id).then((r) => {
    expect(r.status).to.eq(404);
  });
});
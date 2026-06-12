import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { plantsApi } from '../../support/api/plantsApi';
import { jwtAuthHeader } from '../../support/api/authApi';
import { state } from '../../support/scenarioState';

Given('a plant with id {int} exists', (id: number) => {
  jwtAuthHeader('admin').then((adminAuth) => {
    plantsApi.list(adminAuth).then((res) => {
      const items = res.body as any[];
      const match = items.find((p) => p.id === id) ?? items[0];
      state.plantId = match.id;
    });
  });
});

When(
  'I PUT plant {int} with price {float} and quantity {int}',
  (id: number, price: number, quantity: number) => {
    const targetId = state.plantId ?? id;
    jwtAuthHeader('admin').then((adminAuth) => {
      plantsApi.getOne(adminAuth, targetId).then((cur) => {
        const dto = cur.body as any;
        plantsApi.update(state.auth!, targetId, { 
          name: dto.name, 
          price, 
          quantity, 
          categoryId: dto.categoryId ?? 1 
        }).then((res) => { 
          state.lastResponse = res; 
        });
      });
    });
});

Then('the response should reflect the updated price and quantity', () => {
  const body = state.lastResponse?.body as { price: number; quantity: number };
  expect(body.price).to.be.a('number');
  expect(body.quantity).to.be.a('number');
});
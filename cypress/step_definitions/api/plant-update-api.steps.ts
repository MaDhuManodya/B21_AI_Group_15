import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { plantsApi } from '../../support/api/plantsApi';
import { state } from '../../support/scenarioState';

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

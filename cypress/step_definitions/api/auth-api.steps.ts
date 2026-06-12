import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { apiClient } from '../../support/api/apiClient';

let lastResponse: any;

function postLoginWithFixtureRole(role: 'admin' | 'user') {
  cy.fixture('users.json').then((users) => {
    const { username, password } = users[role];
    const base = Cypress.env('apiBaseUrl') || Cypress.config('baseUrl');
    cy.request({
      method: 'POST',
      url: `${base}/api/auth/login`,
      body: { username, password },
      failOnStatusCode: false,
    }).then((res) => {
      lastResponse = res;
    });
  });
}

When('I POST login with username {string} and password {string}', (username: string, password: string) => {
  const base = Cypress.env('apiBaseUrl') || Cypress.config('baseUrl');
  cy.request({
    method: 'POST',
    url: `${base}/api/auth/login`,
    body: { username, password },
    failOnStatusCode: false,
  }).then((res) => {
    lastResponse = res;
  });
});

When('I POST login with the admin credentials', () => {
  postLoginWithFixtureRole('admin');
});

When('I POST login with the user credentials', () => {
  postLoginWithFixtureRole('user');
});

Then('the auth API response status should be {int}', (status: number) => {
  expect(lastResponse?.status).to.eq(status);
});

Then('the response should contain a valid JWT token', () => {
  expect(lastResponse?.body).to.have.property('token');
  expect(lastResponse?.body.token).to.be.a('string');
  expect(lastResponse?.body).to.have.property('tokenType');
  expect(lastResponse?.body.tokenType).to.eq('Bearer');
});


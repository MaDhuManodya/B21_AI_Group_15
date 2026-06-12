// ============================================================
// Cypress global support file.
// Loaded automatically before every spec by Cypress.
// Adds: allure plugin, custom commands, fail-screenshot hook,
//       per-scenario state reset, DB seeding.
// ============================================================
import '@shelex/cypress-allure-plugin';
import './commands';
import { resetState } from './scenarioState';

// Feed the baseline data (seed category + stocked plant + sale) before the
// spec's scenarios run. The task is idempotent — it only creates what's
// missing — so running it once per spec is safe and self-healing if an
// earlier spec deleted the seed sale. Teardown happens once via after:run
// (see cypress.config.ts). Works in both `cypress run` and `cypress open`.
before(() => {
  cy.task('db:seed').then((ids) => {
    Cypress.log({ name: 'db:seed', message: JSON.stringify(ids) });
  });
});

beforeEach(() => {
  resetState();
});

// Attach a screenshot to Allure on every failure for easier debugging.
afterEach(function attachScreenshotOnFail() {
  if (this.currentTest?.state === 'failed') {
    const name = `failure-${this.currentTest.title}`.replace(/\s+/g, '_');
    cy.screenshot(name, { capture: 'viewport' });
  }
});

// Some Spring Security pages add inline scripts that may throw on hot-reload —
// don't let uncaught app exceptions fail our tests.
Cypress.on('uncaught:exception', () => false);

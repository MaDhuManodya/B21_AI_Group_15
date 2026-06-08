// ============================================================
// Cypress global support file.
// Loaded automatically before every spec by Cypress.
// Adds: allure plugin, custom commands, fail-screenshot hook,
//       per-scenario state reset.
// ============================================================
import '@shelex/cypress-allure-plugin';
import './commands';
import { resetState } from './scenarioState';

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

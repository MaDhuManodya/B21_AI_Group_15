// ============================================================
// OWNER: Malinda
// Step definitions for: cypress/e2e/ui/dashboard/dashboard.feature
//
// Reusable shared steps:
//   Given I am logged in as "admin"|"user"   (auth.steps.ts)
//   When  I navigate to {string}             (common.steps.ts)
//   Then  I should see {string}              (common.steps.ts)
//   Then  I should be redirected to {string} (common.steps.ts)
//
// Reusable page object:
//   cypress/support/pages/DashboardPage.ts
// ============================================================
import { Then } from '@badeball/cypress-cucumber-preprocessor';
import { DashboardPage } from '../../support/pages/DashboardPage';

const page = new DashboardPage();

// Example dashboard-specific assertion. Remove or extend as needed.
Then('I should see the dashboard summary cards', () => {
  page.categoriesCard().should('be.visible');
  page.plantsCard().should('be.visible');
  page.salesCard().should('be.visible');
});

// TODO Malinda: add your dashboard step defs here.

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
import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { DashboardPage } from '../../support/pages/DashboardPage';

const page = new DashboardPage();

// Example dashboard-specific assertion. Remove or extend as needed.
Then('I should see the dashboard summary cards', () => {
  page.categoriesCard().should('be.visible');
  page.plantsCard().should('be.visible');
  page.salesCard().should('be.visible');
});

When('I click the manage categories card', () => {
  page.clickManageCategories();
});

When('I click the manage plants card', () => {
  page.clickManagePlants();
});

When('I click the view sales card', () => {
  page.clickViewSales();
});

When('I click the {string} sidebar item', (itemName: string) => {
  page.sidebarItem(itemName).click();
});

Then('the {string} sidebar item should be highlighted', (itemName: string) => {
  page.sidebarItem(itemName).should('have.class', 'active'); // Assuming 'active' class is used for highlighting
});

Then('the {string} card should display the correct summary values', (cardName: 'Categories'|'Plants'|'Sales') => {
  page.cardValue(cardName).should('match', /\d+/); // Verifies that at least one number is displayed
});

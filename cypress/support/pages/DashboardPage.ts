// ============================================================
// OWNER: Malinda
// URL: /ui/dashboard
// TODO Malinda: confirm real selectors against the running app and
// add any methods your scenarios need (e.g. cardValue('Plants')).
// ============================================================
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly url = '/ui/dashboard';

  categoriesCard() { return cy.contains(/Categories/i); }
  plantsCard()     { return cy.contains(/Plants/i); }
  salesCard()      { return cy.contains(/Sales/i); }

  // TODO Malinda: cardValue(name: 'Categories'|'Plants'|'Sales'): Cypress.Chainable<string>
  // TODO Malinda: clickManageCategories(), clickManagePlants(), clickViewSales()
}

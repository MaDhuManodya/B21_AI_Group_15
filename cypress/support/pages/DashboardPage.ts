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

  cardValue(name: 'Categories'|'Plants'|'Sales'): Cypress.Chainable<string> {
    return this.cardContainer(name).invoke('text');
  }

  cardContainer(name: string) {
    return cy.contains('.card, .summary-card', new RegExp(name, 'i')).closest('.card, .summary-card, div');
  }

  clickManageCategories() { this.categoriesCard().click(); }
  clickManagePlants()     { this.plantsCard().click(); }
  clickViewSales()        { this.salesCard().click(); }

  sidebarItem(name: string) {
    return cy.get('nav, .sidebar').contains('a, button', new RegExp(name, 'i'));
  }
}

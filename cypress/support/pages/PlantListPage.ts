// ============================================================
// OWNER: Bhawanthi
// URL: /ui/plants
// SRS §6.1 — Plant List Page
// TODO Bhawanthi: verify selectors against the running app, then
// add the methods your step defs need.
// Note: Tharindu's plant-update scenarios reach the Edit Plant
// form via direct navigation (PlantFormPage.visitEdit), so they do
// not depend on this page object.
// ============================================================
import { BasePage } from './BasePage';

export class PlantListPage extends BasePage {
  readonly url = '/ui/plants';

  // ---- selectors (placeholder — TODO Bhawanthi: confirm) ----
  searchInput()    { return cy.get('input[placeholder*="Search plant" i]'); }
  categoryFilter() { return cy.get('select[name*="categor" i]'); }
  searchButton()   { return cy.contains('button', /^Search$/); }
  resetButton()    { return cy.contains('button', /^Reset$/); }
  addPlantBtn()    { return cy.contains('a,button', /Add a Plant/i); }
  table()          { return cy.get('table'); }
  rows()           { return this.table().find('tbody tr'); }
  emptyMessage()   { return cy.contains(/No plants found/i); }
  lowBadge()       { return cy.contains(/Low/i); }

  search(name: string) {
    this.searchInput().clear().type(name);
    this.searchButton().click();
  }

  // TODO Bhawanthi: filterByCategory(name: string)
  // TODO Bhawanthi: sortBy(column: 'Name'|'Price'|'Stock')
  // TODO Bhawanthi: clickEditOnRow(index: number)
  // TODO Bhawanthi: clickDeleteOnRow(index: number)
  // TODO Bhawanthi: confirmDelete()
}

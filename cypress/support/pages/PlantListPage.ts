// ============================================================
// OWNER: Bhawanthi
// URL: /ui/plants
// SRS §6.1 — Plant List Page
// Selectors verified against the running QA Training App
// (table.table-striped, filter form method="get", "Low" badge =
// span.badge.bg-danger, edit link /ui/plants/edit/{id}, delete
// form action /ui/plants/delete/{id}).
// Note: Tharindu's plant-update scenarios reach the Edit Plant
// form via direct navigation (PlantFormPage.visitEdit), so they do
// not depend on this page object.
// ============================================================
import { BasePage } from './BasePage';

export class PlantListPage extends BasePage {
  readonly url = '/ui/plants';

  // ---- selectors ----
  searchInput()    { return cy.get('input[placeholder*="Search plant" i]'); }
  categoryFilter() { return cy.get('select[name="categoryId"]'); }
  searchButton()   { return cy.contains('button', /^Search$/); }
  resetButton()    { return cy.contains('a,button', /^Reset$/); }
  addPlantBtn()    { return cy.contains('a,button', /Add a Plant/i); }
  table()          { return cy.get('table'); }
  rows()           { return this.table().find('tbody tr'); }
  // Data rows only — excludes the "No plants found" empty-state row.
  dataRows()       { return this.rows().not(':has(td[colspan])'); }
  emptyMessage()   { return cy.contains(/No plants found/i); }
  editIcons()      { return cy.get('a[href*="/ui/plants/edit/"]'); }
  deleteForms()    { return cy.get('form[action*="/ui/plants/delete/"]'); }

  // ---- actions ----
  search(name: string) {
    this.searchInput().clear().type(name);
    this.searchButton().click();
  }

  filterByCategory(label: string) {
    this.categoryFilter().select(label);
    this.searchButton().click();
  }

  sortByColumn(columnLabel: string) {
    cy.contains('th a', columnLabel).click();
  }

  sortIndicator(columnLabel: string) {
    return cy.contains('th', columnLabel).find('span');
  }

  // ---- row helpers ----
  rowFor(plantName: string) {
    return this.dataRows().contains('td', plantName).closest('tr');
  }

  lowBadgeFor(plantName: string) {
    return this.rowFor(plantName).find('.badge.bg-danger');
  }

  deleteButtonFor(plantName: string) {
    return this.rowFor(plantName).find('form[action*="/ui/plants/delete/"] button');
  }

  nameCells(): Cypress.Chainable<string[]> {
    return this.dataRows()
      .find('td:nth-child(1)')
      .then(($cells) => Cypress._.map($cells, (el) => Cypress.$(el).text().trim()));
  }

  categoryCells(): Cypress.Chainable<string[]> {
    return this.dataRows()
      .find('td:nth-child(2)')
      .then(($cells) => Cypress._.map($cells, (el) => Cypress.$(el).text().trim()));
  }
}

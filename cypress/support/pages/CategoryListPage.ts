// ============================================================
// OWNER: Manodya
// URL: /ui/categories
// SRS §5.1 — Category List Page
// TODO Manodya: verify each selector against the real HTML
// (open dev tools on the running app) and add the methods your
// step defs need.
// ============================================================
import { BasePage } from './BasePage';

export class CategoryListPage extends BasePage {
  readonly url = '/ui/categories';

  // ---- selectors (placeholder — TODO Manodya: confirm) ----
  searchInput()    { return cy.get('input[placeholder*="Search" i]'); }
  parentFilter()   { return cy.get('select[name*="parent" i]'); }
  searchButton()   { return cy.contains('button', /^Search$/); }
  resetButton()    { return cy.contains('button', /^Reset$/); }
  addCategoryBtn() { return cy.contains('a,button', /Add Category/i); }
  table()          { return cy.get('table'); }
  rows()           { return this.table().find('tbody tr'); }
  emptyMessage()   { return cy.contains(/No category found/i); }

  // ---- actions ----
  search(name: string) {
    this.searchInput().clear().type(name);
    this.searchButton().click();
  }

  // TODO Manodya: filterByParent(name: string)
  // TODO Manodya: sortBy(column: 'ID'|'Name'|'Parent')
  // TODO Manodya: clickEditOnRow(index: number)
  // TODO Manodya: clickDeleteOnRow(index: number)
  // TODO Manodya: confirmDelete()
}

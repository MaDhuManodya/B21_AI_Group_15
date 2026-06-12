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
  addCategoryBtn() { return cy.contains('a,button', /Add (A )?Category/i); }
  table()          { return cy.get('table'); }
  rows()           { return this.table().find('tbody tr'); }
  emptyMessage()   { return cy.contains(/No category found/i); }

  // ---- actions ----
  search(name: string) {
    this.searchInput().clear().type(name);
    this.searchButton().click();
  }

  filterByParent(name: string) {
    this.parentFilter().select(name);
    this.searchButton().click();
  }

  sortBy(column: 'ID'|'Name'|'Parent') {
    this.table().find('thead th').contains(new RegExp(`^${column}$`, 'i')).click();
  }

  clickEditOnRow(index: number) {
    this.rows().eq(index).find('[aria-label*="Edit"], [aria-label*="edit"], [title*="Edit"], [title*="edit"], button:contains("Edit"), button:contains("edit")').click();
  }

  clickDeleteOnRow(index: number) {
    this.rows().eq(index).find('[aria-label*="Delete"], [aria-label*="delete"], [title*="Delete"], [title*="delete"], button:contains("Delete"), button:contains("delete")').click();
  }

  confirmDelete() {
    // Cypress auto-accepts native confirm dialogs automatically.
  }
}

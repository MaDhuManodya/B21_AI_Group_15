// ============================================================
// SHARED OWNER: Manodya (Add) + Malinda (Edit)
// URLs:
//   Add  -> /ui/categories/add
//   Edit -> /ui/categories/edit/{id}
// SRS §5.2 — Add / Edit Category Page
//
// Both flows share the SAME form, so this page object covers both.
// Each owner fills in the TODO methods for their flow.
// ============================================================
import { BasePage } from './BasePage';

export class CategoryFormPage extends BasePage {
  readonly url = '/ui/categories/add'; // default; use visitEdit(id) for edit

  // ---- selectors ----
  nameInput()          { return cy.get('input[name="name"]'); }
  parentSelect()       { return cy.get('select[name*="parent" i]'); }
  saveButton()         { return cy.contains('button', /^Save$/); }
  cancelButton()       { return cy.contains('button, a', /^Cancel$/); }
  nameError()          { return cy.contains(/Category name (is required|must be)/i); }
  successAlert()       { return cy.contains(/Category (added|updated) successfully/i); }

  visitAdd()           { return cy.visit('/ui/categories/add'); }
  visitEdit(id: number){ return cy.visit(`/ui/categories/edit/${id}`); }

  setName(name: string) { this.nameInput().clear().type(name); }
  selectParent(label: string) { this.parentSelect().select(label); }
  clickSave()   { this.saveButton().click(); }
  clickCancel() { this.cancelButton().click(); }

  // TODO Manodya / Malinda: fillAndSave({ name, parent? }) — convenience helper
}

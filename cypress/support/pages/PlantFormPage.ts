// ============================================================
// SHARED PAGE OBJECT
//   OWNER (Edit half): Tharindu   — URL /ui/plants/edit/{id}
//   OWNER (Add half):  Malinda    — URL /ui/plants/add
// SRS §6.2 — Add / Edit Plant Page
// Form fields: Plant Name (3-25), Category (sub-category), Price (>0), Quantity (>=0)
// Buttons: Save / Cancel
// Success message: "Plant updated successfully" (edit) or similar (add)
// ============================================================
import { BasePage } from './BasePage';

export class PlantFormPage extends BasePage {
  readonly url = '/ui/plants/add'; // default; use visitEdit(id) for the edit form

  // ---- selectors (shared by Add + Edit) ----
  nameInput()      { return cy.get('input[name="name"]'); }
  categorySelect() { return cy.get('select[name="categoryId"], select[name*="category" i]'); }
  priceInput()     { return cy.get('input[name="price"]'); }
  quantityInput()  { return cy.get('input[name="quantity"]'); }
  saveButton()     { return cy.contains('button', /^Save$/); }
  cancelButton()   { return cy.contains('a, button', /^Cancel$/); }
  successAlert()   { return cy.contains(/Plant (updated|added) successfully/i); }
  nameError()      { return cy.contains(/Plant name (is required|must be)/i); }
  nameLengthError() { return cy.contains(/Plant name must be between 3 and 25 characters/i); }
  priceError()     { return cy.contains(/Price (is required|must be)/i); }
  quantityError()  { return cy.contains(/Quantity (is required|cannot be negative)/i); }
  categoryError()  { return cy.contains(/Category is required/i); }

  // ---- navigation ----
  visitAdd()            { return cy.visit('/ui/plants/add'); }
  visitEdit(id: number) { return cy.visit(`/ui/plants/edit/${id}`); }

  // ---- field setters ----
  setName(name: string)        { this.nameInput().clear().type(name); }
  setPrice(price: string | number)       { this.priceInput().clear().type(String(price)); }
  setQuantity(qty: string | number)      { this.quantityInput().clear().type(String(qty)); }
  selectCategory(label: string) { this.categorySelect().select(label); }
  selectFirstCategory(): Cypress.Chainable<string> {
    return this.categorySelect()
      .find('option')
      .not('[value=""]')
      .first()
      .then(($opt) => {
        const value = $opt.attr('value') ?? '';
        this.categorySelect().select(value);
        return cy.wrap($opt.text().trim());
      });
  }

  clickSave()   { this.saveButton().click(); }
  clickCancel() { this.cancelButton().click(); }

  // ---- convenience: fill fields without saving ----
  fill(input: { name?: string; categoryLabel?: string; price?: string | number; quantity?: string | number }) {
    if (input.name !== undefined) this.setName(input.name);
    if (input.categoryLabel !== undefined) this.selectCategory(input.categoryLabel);
    if (input.price !== undefined) this.setPrice(input.price);
    if (input.quantity !== undefined) this.setQuantity(input.quantity);
  }

  // ---- convenience: fill all fields then Save ----
  fillAndSave(input: { name: string; categoryLabel?: string; price: string | number; quantity: string | number }) {
    this.fill(input);
    this.clickSave();
  }
}

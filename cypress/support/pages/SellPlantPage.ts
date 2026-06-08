// ============================================================
// OWNER: Tharindu
// URL: /ui/sales/new
// SRS §7.2 — Sell Plant Page
// Real HTML:
//   <select id="plantId" name="plantId">
//     <option value="">-- Select Plant --</option>
//     <option value="1">Current (Stock: 8)</option>   <!-- "<name> (Stock: <n>)" -->
//   </select>
//   <input id="quantity" name="quantity" type="number" min="1" value="0">
//   <button class="btn btn-primary">Sell</button>
//   <a class="btn btn-secondary" href="/ui/sales">Cancel</a>
// On success: redirect to /ui/sales.
// On error:   server-rendered alert inside the form.
// ============================================================
import { BasePage } from './BasePage';

export class SellPlantPage extends BasePage {
  readonly url = '/ui/sales/new';

  // ---- selectors ----
  plantSelect()   { return cy.get('#plantId, select[name="plantId"]').first(); }
  quantityInput() { return cy.get('#quantity, input[name="quantity"]').first(); }
  sellButton()    { return cy.contains('button', /^\s*Sell\s*$/); }
  cancelButton()  { return cy.contains('a, button', /^\s*Cancel\s*$/); }
  quantityError() {
    return cy.contains(/Quantity must be greater than 0|Quantity is required|Insufficient/i);
  }
  globalError()   { return cy.get('.alert-danger, .alert-warning, [role="alert"]'); }

  /** Strip the "(Stock: N)" suffix from the option label to get the plant name. */
  private cleanLabel(text: string): string {
    return text.replace(/\s*\(Stock:.*\)\s*$/i, '').trim();
  }

  /**
   * Picks the first option that is NOT the placeholder ("-- Select Plant --").
   * Returns the cleaned plant name (without the "(Stock: N)" suffix).
   */
  selectFirstAvailablePlant(): Cypress.Chainable<string> {
    return this.plantSelect()
      .find('option')
      .not('[value=""]')
      .first()
      .then(($opt) => {
        const value = $opt.attr('value') ?? '';
        const cleaned = this.cleanLabel($opt.text());
        return this.plantSelect().select(value).then(() => cleaned);
      });
  }

  selectPlantByText(label: string) {
    return this.plantSelect().select(label);
  }

  enterQuantity(qty: number | string) {
    // The input has min="1"; for negative-path tests (qty=0) the browser
    // would block form submit with a native popup. Strip min so the server-
    // side validator is what we actually exercise.
    this.quantityInput()
      .invoke('removeAttr', 'min')
      .clear()
      .type(String(qty));
  }

  clickSell()   { this.sellButton().click(); }
  clickCancel() { this.cancelButton().click(); }
}

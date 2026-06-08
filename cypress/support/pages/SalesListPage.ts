// ============================================================
// OWNER: Tharindu
// URL: /ui/sales
// SRS §7.1 — Sales List Page
//
// Real HTML (verified):
//   <a href="/ui/sales/new" class="btn btn-primary btn-sm mb-3">Sell Plant</a>
//   <table class="table table-bordered ...">
//     <thead class="table-dark">
//       <tr>
//         <th><a href="/ui/sales?...&sortField=plant.name&sortDir=asc">Plant</a></th>
//         <th><a href="...&sortField=quantity&...">Quantity</a></th>
//         <th><a href="...&sortField=totalPrice&...">Total Price</a></th>
//         <th><a href="...&sortField=soldAt&...">Sold At</a></th>
//         <th>Actions</th>
//       </tr>
//     </thead>
//     <tbody>
//       <tr>
//         <td>Current</td> <td>2</td> <td>24.00</td> <td>2026-05-22 00:49</td>
//         <td>
//           <form action="/ui/sales/delete/7" method="post"
//                 onsubmit="return confirm('Are you sure...');">
//             <button class="btn btn-sm btn-outline-danger">
//               <i class="bi bi-trash"></i>
//             </button>
//           </form>
//         </td>
//       </tr>
//     </tbody>
//   </table>
// ============================================================
import { BasePage } from './BasePage';

export type SalesColumn = 'plant' | 'quantity' | 'totalPrice' | 'soldAt';

export class SalesListPage extends BasePage {
  readonly url = '/ui/sales';

  // ---- selectors ----
  table()           { return cy.get('table').first(); }
  rows()            { return this.table().find('tbody tr'); }
  headers()         { return this.table().find('thead th'); }
  sellPlantButton() { return cy.contains('a.btn-primary, a.btn, a', 'Sell Plant'); }
  emptyMessage()    { return cy.contains(/No sales found/i); }

  rowByPlantName(name: string) {
    return this.rows().contains('td', name).parents('tr').first();
  }

  /** Each delete <form> is unique per sale id. Returns the form's button. */
  rowDeleteButton(rowIndex: number) {
    return this.rows().eq(rowIndex).find('form[action*="/ui/sales/delete/"] button').first();
  }

  // ---- queries / actions ----
  isSellButtonVisible(): Cypress.Chainable<boolean> {
    return cy.get('body').then(($body) => $body.find('a:contains("Sell Plant")').length > 0);
  }

  isDeleteIconVisibleOnRow(rowIndex: number): Cypress.Chainable<boolean> {
    return this.rows().eq(rowIndex).then(($row) => {
      return $row.find('form[action*="/ui/sales/delete/"]').length > 0;
    });
  }

  clickSellPlantButton() { this.sellPlantButton().click(); }

  clickDeleteOnRow(rowIndex: number) {
    // Native confirm() is auto-accepted by Cypress; install an explicit accept
    // anyway so this doesn't depend on Cypress defaults.
    cy.on('window:confirm', () => true);
    this.rowDeleteButton(rowIndex).click();
  }

  /** No-op — the form's onsubmit confirm() already fired during click. */
  confirmDelete(): void {
    /* nothing to do; window:confirm handler accepts during clickDeleteOnRow */
  }

  /**
   * Sort by clicking the <a> inside the matching <th>.
   * Sorting is server-side (navigates to a new URL with sortField + sortDir).
   */
  sortBy(column: SalesColumn) {
    const labelMap: Record<SalesColumn, string> = {
      plant: 'Plant',
      quantity: 'Quantity',
      totalPrice: 'Total Price',
      soldAt: 'Sold At',
    };
    this.headers().contains('a', labelMap[column]).click();
  }

  /** Read text from a column, rows in current display order. */
  getColumnValues(column: SalesColumn): Cypress.Chainable<string[]> {
    const indexMap: Record<SalesColumn, number> = {
      plant: 0, quantity: 1, totalPrice: 2, soldAt: 3,
    };
    const i = indexMap[column];
    return this.rows().then(($rows) => {
      const out: string[] = [];
      $rows.each((_, row) => {
        const cell = row.querySelectorAll('td')[i];
        if (cell) out.push((cell.textContent || '').trim());
      });
      return out;
    });
  }
}

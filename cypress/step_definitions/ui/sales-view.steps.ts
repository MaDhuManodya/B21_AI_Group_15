// ============================================================
// OWNER: Tharindu
// Step definitions for: cypress/e2e/ui/sales/sales-view.feature
// Covers IDs: UI_SALES_ADMIN_003, UI_SALES_USER_001, UI_SALES_USER_002, UI_SALES_USER_004
// ============================================================
import { Then, When } from '@badeball/cypress-cucumber-preprocessor';
import { SalesListPage, type SalesColumn } from '../../support/pages/SalesListPage';

const page = new SalesListPage();

Then('the sales table should be visible', () => {
  page.table().should('be.visible');
});

Then('the sales table should have the column {string}', (header: string) => {
  page.headers().contains(header).should('be.visible');
});

Then('the Sell Plant button should be visible on the sales page', () => {
  // The real markup is <a class="btn btn-primary ...">Sell Plant</a>.
  cy.contains('a, button', 'Sell Plant').should('be.visible');
});

Then('the Sell Plant button should NOT be visible on the sales page', () => {
  cy.contains('a, button', 'Sell Plant').should('not.exist');
});

Then('no delete icon should be visible in the sales Actions column', () => {
  // Admin rows wrap the delete button in <form action="/ui/sales/delete/{id}">.
  // For a user, the entire form is omitted server-side.
  page.rows().each(($row) => {
    expect($row.find('form[action*="/ui/sales/delete/"]').length).to.eq(0);
    expect($row.find('button.btn-outline-danger, .btn-danger, i.bi-trash').length).to.eq(0);
  });
});

When('I sort the sales list by the {string} column', (col: string) => {
  page.sortBy(col as SalesColumn);
});

Then('the sales list should be sorted by the {string} column ascending', (col: string) => {
  page.getColumnValues(col as SalesColumn).then((values) => {
    const sorted = [...values].sort((a, b) => a.localeCompare(b));
    expect(values).to.deep.equal(sorted);
  });
});

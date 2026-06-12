// ============================================================
// OWNER: Bhawanthi
// Step definitions for: cypress/e2e/ui/plants/plant-list.feature
// Page object: cypress/support/pages/PlantListPage.ts
// ============================================================
import { When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { PlantListPage } from '../../support/pages/PlantListPage';

const page = new PlantListPage();

When('I open the plants page', () => page.visit());
When('I search for plant {string}', (name: string) => page.search(name));

Then('the plant list should show {int} row(s)', (count: number) => {
  page.rows().should('have.length', count);
});

Then('I should see the {string} message on the plants page', (text: string) => {
  cy.contains(text).should('be.visible');
});

Then('the {string} button should be visible on the plants page', (label: string) => {
  cy.contains('a,button', label).should('be.visible');
});

Then('the {string} button should NOT be visible on the plants page', (label: string) => {
  cy.contains('a,button', label).should('not.exist');
});

When('I filter the plant list by category {string}', (category: string) => {
  page.filterByCategory(category);
});

When('I click the {string} column header to sort', (column: string) => {
  page.sortByColumn(column);
});

Then('the {string} row should show the "Low" badge', (plantName: string) => {
  page.lowBadgeFor(plantName).should('be.visible').and('contain.text', 'Low');
});

Then('every row in the plant list should belong to category {string}', (category: string) => {
  page.categoryCells().then((cells) => {
    expect(cells.length).to.be.greaterThan(0);
    cells.forEach((cell) => expect(cell).to.eq(category));
  });
});

Then('the plant names should be sorted in {word} order', (direction: string) => {
  page.nameCells().then((names) => {
    expect(names.length).to.be.greaterThan(0);
    const ascending = [...names].sort((a, b) => a.localeCompare(b));
    const expected = direction === 'ascending' ? ascending : ascending.reverse();
    expect(names).to.deep.equal(expected);
  });
});

Then('the {string} column header should show the {string} sort indicator', (column: string, arrow: string) => {
  page.sortIndicator(column).should('contain.text', arrow);
});

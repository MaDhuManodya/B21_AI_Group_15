// Writes the Allure "extra" files (categories, environment, executor) into
// reports/allure-results before `allure generate` runs. These files are not
// produced by the test run itself but are picked up by the Allure CLI to
// populate the Categories tab and the Environment/Executor widgets.
const fs = require('fs');
const path = require('path');

const RESULTS_DIR = path.join(__dirname, '..', 'reports', 'allure-results');

fs.mkdirSync(RESULTS_DIR, { recursive: true });

const categories = [
  {
    name: 'Known Defects - Blocker (Access Control / RBAC)',
    matchedStatuses: ['failed'],
  },
  {
    name: 'Test Execution Errors',
    matchedStatuses: ['broken'],
  },
];

fs.writeFileSync(
  path.join(RESULTS_DIR, 'categories.json'),
  JSON.stringify(categories, null, 2)
);

const environment = {
  Project: 'QA Training App (Plant Nursery Management)',
  Team: 'QA Warriors',
  'Owner.Sales': 'Tharindu',
  'Owner.Authentication_Dashboard': 'Malinda',
  'Owner.Plants': 'Bhawanthi Pabasara',
  'Owner.Categories': 'Manodya',
  'Test.Framework': 'Cypress 13 + Cucumber BDD (@badeball/cypress-cucumber-preprocessor)',
  Reporting: 'Allure Report (allure-cypress)',
  Browser: 'Electron (headless)',
  'Base.URL': 'http://localhost:8080',
  'Test.Environment': 'Local QA',
};

fs.writeFileSync(
  path.join(RESULTS_DIR, 'environment.properties'),
  Object.entries(environment)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n') + '\n'
);

const executor = {
  name: 'Local',
  type: 'local',
  buildName: 'QA Training App - Regression Suite',
  reportName: 'QA Training App - Allure Report',
};

fs.writeFileSync(
  path.join(RESULTS_DIR, 'executor.json'),
  JSON.stringify(executor, null, 2)
);

console.log('Wrote categories.json, environment.properties and executor.json to reports/allure-results');

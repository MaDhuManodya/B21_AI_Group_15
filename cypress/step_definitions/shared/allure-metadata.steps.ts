// ============================================================
// SHARED — Maps Gherkin tags onto Allure labels for every scenario.
//
// Feature files carry tags such as:
//   @epic("API") @feature("Sales") @story("Create")
//   @owner("Tharindu") @severity("critical")
//
// Cucumber merges Feature-level and Scenario-level tags into a single
// `pickle.tags` array (Feature tags first, Scenario tags last), so for
// single-value labels (epic/feature/story/owner/severity/...) the LAST
// occurrence wins — i.e. a scenario-level tag overrides the feature
// default. Plain tags (@admin, @smoke, @rbac, ...) become Allure "tag"
// labels and remain searchable/filterable in the report.
// ============================================================
import { Before } from '@badeball/cypress-cucumber-preprocessor';
import * as allure from 'allure-js-commons';

const SINGLE_VALUE_LABELS = new Set([
  'epic',
  'feature',
  'story',
  'owner',
  'severity',
  'suite',
  'parentSuite',
  'subSuite',
  'layer',
]);

const LABEL_TAG_PATTERN = /^@(\w+)\((["'])(.*)\2\)$/;

// Gherkin tags may not contain whitespace, even inside quotes, so
// multi-word label values are written as hyphenated slugs in the
// .feature files and expanded back to their display form here.
const DISPLAY_NAME_OVERRIDES: Record<string, string> = {
  'CRUD-and-Access-Control': 'CRUD & Access Control',
  'Row-Actions': 'Row Actions',
  'Bhawanthi-Pabasara': 'Bhawanthi Pabasara',
};

Before(({ pickle }) => {
  const singleValueLabels = new Map<string, string>();
  const tags: string[] = [];

  for (const { name } of pickle.tags) {
    const match = name.match(LABEL_TAG_PATTERN);
    if (match) {
      const [, label, , rawValue] = match;
      const value = DISPLAY_NAME_OVERRIDES[rawValue] ?? rawValue;
      if (SINGLE_VALUE_LABELS.has(label)) {
        singleValueLabels.set(label, value);
      } else {
        tags.push(value);
      }
      continue;
    }
    tags.push(name.replace(/^@/, ''));
  }

  for (const [label, value] of singleValueLabels) {
    void allure.label(label, value);
  }
  for (const tagName of tags) {
    void allure.tag(tagName);
  }
});

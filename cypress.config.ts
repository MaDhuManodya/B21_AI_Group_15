import { defineConfig } from 'cypress';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import createEsbuildPlugin from '@badeball/cypress-cucumber-preprocessor/esbuild';
import { allureCypress } from 'allure-cypress/reporter';
import cypressOnFix from 'cypress-on-fix';
import { seedDatabase, cleanupDatabase } from './cypress/support/seed/dbSeed';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
    specPattern: 'cypress/e2e/**/*.feature',
    supportFile: 'cypress/support/e2e.ts',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    video: false,
    screenshotOnRunFailure: true,
    viewportWidth: 1366,
    viewportHeight: 768,
    defaultCommandTimeout: 8000,
    pageLoadTimeout: 30000,
    retries: { runMode: 1, openMode: 0 },
    env: {
      apiBaseUrl: 'http://localhost:8080',
    },
    async setupNodeEvents(rawOn, config) {
      // cypress-on-fix lets multiple plugins (cucumber preprocessor + allure
      // + our own after:run hook) register handlers for the same event.
      const on = cypressOnFix(rawOn);

      await addCucumberPreprocessorPlugin(on, config);
      on(
        'file:preprocessor',
        createBundler({
          // `as any` because @badeball ships its own esbuild copy, which TS
          // sees as a different (incompatible) Plugin type even though it is
          // the same library at runtime.
          plugins: [createEsbuildPlugin(config) as any],
        })
      );

      allureCypress(on, config, {
        resultsDir: 'reports/allure-results',
      });

      // --- DB seeding (Tharindu) ---
      // Base URL the seed module talks to (same as the API tests).
      const apiBaseUrl = (config.env.apiBaseUrl as string) || config.baseUrl || 'http://localhost:8080';

      // Tasks let step files / hooks drive the Node-side seed module.
      on('task', {
        async 'db:seed'() {
          return seedDatabase(apiBaseUrl);
        },
        async 'db:cleanup'() {
          await cleanupDatabase(apiBaseUrl);
          return null;
        },
      });

      // Remove the seeded data once the whole headless run finishes.
      // (after:run does not fire in `cypress open`; debug data is left in
      //  place there, and the idempotent before() hook reuses it next run.)
      on('after:run', async () => {
        await cleanupDatabase(apiBaseUrl);
      });

      return config;
    },
  },
});

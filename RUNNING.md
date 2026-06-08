# How to Run the Tests — Step by Step

This guide walks you through running the Cypress + Cucumber + Allure automation suite
for the QA Training App, from a cold machine to a generated Allure report.

> **1. Start MySQL → 2. Start the app jar (`java -jar qa-training-app.jar`) → 3. `npm ci` → 1. `npm run cy:run` → 5. `npm run report`**

---

## 1. Prerequisites (install once)

| Tool | Version | Check command | Notes |
|---|---|---|---|
| **Java JDK** | 21+ | `java -version` | Needed to run the app backend jar |
| **MySQL** | 8.0 | `mysql --version` | Database for the app |
| **Node.js** | 18 or 20 LTS | `node -v` | Runs Cypress. **Avoid Node 21/22/23** — Cypress 13 officially supports up to Node 20 |
| **npm** | 9+ | `npm -v` | Comes with Node |
| **Google Chrome** | latest | — | Recommended browser for Cypress |

> ⚠️ **Node version warning:** If you have Node 22/23 installed, some Cypress maintenance
> commands (like `cypress verify`) may print a `bad option --smoke-test` error. The tests
> themselves still run, but for a trouble-free experience install **Node 20 LTS**
> (use [nvm-windows](https://github.com/coreybutler/nvm-windows): `nvm install 20 && nvm use 20`).

---

## 2. Start the application backend (the "server")

The tests run against the **QA Training App** — a Spring Boot app that must be running
locally **before** you start any test.

### Step 2.1 — Start MySQL
Make sure the MySQL service is running. Then create the database **once**:

```sql
CREATE DATABASE qa_training;
```

(Tables are auto-created by the app on first start — no manual table creation needed.)

### Step 2.2 — Configure `application.properties` (if needed)
The app ships with an `application.properties` file. Update it only if your local MySQL
credentials differ from the defaults:

```properties
server.port=8080
spring.datasource.username=root
spring.datasource.password=<your-mysql-root-password>
api.base-url=http://localhost:8080
```

### Step 2.3 — Run the app jar
Open a terminal in the folder that contains `qa-training-app.jar` and run:

```bash
java -jar qa-training-app.jar
```

Wait for the Spring Boot startup banner / "Started ... in X seconds" log line.

### Step 2.4 — Confirm the app is up
Open these in a browser — both should load:

- **UI:**  http://localhost:8080/ui/login
- **Swagger (API reference):**  http://localhost:8080/swagger-ui/index.html

Login credentials used by the tests:

| Role  | Username | Password   |
|-------|----------|------------|
| Admin | `admin`  | `admin123` |
| User  | `testuser`   | `test123`  |

> Keep this terminal open. The app must stay running the whole time you run tests.

---

## 3. Install the test project dependencies (once per clone)

Open a **second** terminal inside the `qa-training-cypress/` folder:

```bash
# Exact, reproducible install from package-lock.json (recommended):
npm ci

# ...or, if you don't have a lock file yet:
npm install
```

This downloads Cypress, the Cucumber preprocessor, and the Allure plugin (~500 packages).
The first run also downloads the Cypress binary — it can take a few minutes.

---

## 4. Run the tests

All commands run from inside `qa-training-cypress/`.

### Option A — Headless (fast, for CI / full runs)

| Command | What it runs |
|---|---|
| `npm run cy:run` | **Everything** — all UI + API features (whole group) |
| `npm run cy:run:ui` | Only UI features |
| `npm run cy:run:api` | Only API features |
| `npm run cy:run:tharindu` | Only Tharindu's 20 scenarios (tag `@tharindu`) |
| `npm run cy:run:smoke` | Only critical-path scenarios (tag `@smoke`) |

Run a **single feature file**:
```bash
npx cypress run --spec "cypress/e2e/ui/sales/sales-sell.feature"
```

Run by **any tag combination**:
```bash
npx cypress run --env tags="@tharindu and @api"
npx cypress run --env tags="@admin and @sales"
npx cypress run --env tags="not @rbac"
```

### Option B — Interactive (great for writing/debugging)

```bash
npm run cy:open
```

Then in the Cypress window:
1. Choose **E2E Testing**
2. Choose **Chrome**
3. Click any `.feature` file to run it and watch it step through live.

---

## 5. Generate and view the Allure report

After any headless run, test results are written to `reports/allure-results/`.
Turn them into a browsable HTML report:

```bash
npm run report
```

That single command does both steps:
- `npm run allure:generate` → builds `reports/allure-report/`
- `npm run allure:open` → opens it in your browser

In the report you can filter by the tags: `@tharindu`, `@admin`, `@user`, `@ui`, `@api`,
`@sales`, `@plants`, `@smoke`, `@negative`, `@rbac`.

---

## 6. Recommended end-to-end run (copy/paste)

With MySQL running and the app jar started in another terminal:

```bash
# inside qa-training-cypress/
npm ci                       # 1. install (first time only)
npm run typecheck            # 2. (optional) confirm TypeScript is clean
npm run cy:run:tharindu      # 3. run my 20 scenarios
npm run report               # 4. open the Allure report
```

To run the **whole group's** suite instead of just Tharindu's part, replace step 3 with
`npm run cy:run`.

---

## 7. What "passing" looks like

- Headless run ends with a green summary table — `✔  All specs passed!`
- Each Tharindu scenario maps 1:1 to a test ID from the Test Case Excel document
  (e.g. `UI_SALES_ADMIN_001`, `API_PLANT_USER_004`).
- The Allure report shows 20 Tharindu scenarios (10 UI + 10 API) once the placeholder
  features for other members are still empty/pending.

---

## 8. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `ECONNREFUSED 127.0.0.1:8080` | App backend not running | Start `java -jar qa-training-app.jar` and wait for startup |
| Tests redirect to `/ui/login` unexpectedly | Session expired / not logged in | Make sure credentials in `cypress/fixtures/users.json` match the app |
| `bad option: --smoke-test` on `cypress verify` | Node 21/22/23 incompatibility | Switch to Node 20 LTS (`nvm use 20`). Does **not** affect `cypress run` |
| Database connection error on app start | Wrong MySQL credentials / DB missing | Check `application.properties`; run `CREATE DATABASE qa_training;` |
| API tests fail with 404 on endpoints | Endpoint path differs from assumption | Confirm the real path in Swagger UI and adjust the client in `cypress/support/api/` |
| Selectors not found in UI tests | App HTML differs from placeholder selectors | Inspect the running page (F12) and update the relevant Page Object in `cypress/support/pages/` |
| Allure report is empty | No results generated yet | Run a `cy:run` command first, then `npm run report` |

---

## 9. Quick reference — folder map

```
cypress/
├── e2e/                      # .feature files (the test scenarios, Gherkin)
│   ├── ui/<module>/
│   └── api/<module>/
├── step_definitions/         # .steps.ts — the code behind each Gherkin step
│   ├── shared/               # login, navigation (reused by everyone)
│   ├── ui/
│   └── api/
├── support/
│   ├── pages/                # Page Objects (UI element selectors + actions)
│   └── api/                  # API client wrappers (one per resource)
└── fixtures/                 # users.json, test-data.json
```

For project conventions (tags, branch rules, ownership), see **README.md**.

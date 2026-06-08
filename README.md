# QA Training App — Automation Suite

Cypress + Cucumber (BDD) + Allure reporting, written in **TypeScript**.

Group assignment for **IS3440 - IT Quality Assurance**. Assigned framework: **Cypress**.

---

## Prerequisites

- **Node.js 20 LTS** (use `nvm use` — see `.nvmrc`)
- **Java JDK 21** and **MySQL 8** (to run the QA Training App backend)
- **Allure CLI** is bundled as a dev dependency; no separate install needed
- The QA Training App jar running locally on `http://localhost:8080` — see `QA Training App – Deployment & Access Instructions.pdf`

---

## Setup

```bash
# 1. From a clean clone:
npm ci

# 2. Make sure the QA Training App backend is up at http://localhost:8080
#    (java -jar qa-training-app.jar)
```

---

## Running tests

| Command | What it does |
|---|---|
| `npm run cy:open` | Open Cypress interactive runner |
| `npm run cy:run` | Headless run — all features (UI + API) |
| `npm run cy:run:ui` | Headless run — UI features only |
| `npm run cy:run:api` | Headless run — API features only |
| `npm run cy:run:smoke` | Headless run — only scenarios tagged `@smoke` |
| `npm run cy:run:tharindu` | Headless run — only scenarios tagged `@tharindu` |
| `npm run typecheck` | TypeScript-only check (`tsc --noEmit`) |
| `npm run allure:generate` | Build the Allure report from `reports/allure-results` |
| `npm run allure:open` | Open the generated Allure report in a browser |
| `npm run report` | Generate + open Allure report (one command) |

Filter by other tag combinations on the fly:
```bash
npx cypress run --env tags="@admin and @sales"
npx cypress run --env tags="not @rbac"
```

---

## Team — Ownership

| Member | UI module(s) | API area(s) | Tag |
|---|---|---|---|
| **Malinda**   | Dashboard, Add Plant form, Category Update form | Categories PUT, Plants POST | `@malinda` |
| **Manodya**   | Category list (search, add, list, row actions) | Categories list/create/delete | `@manodya` |
| **Bhawanthi** | Plant list (search, add, list, row actions)    | Plants list/create/delete     | `@bhawanthi` |
| **Tharindu**  | Sell Plant, Sales list, Sales delete, Edit Plant | Sales CRUD, Plants PUT      | `@tharindu` |

> Each member is responsible for **20 scenarios** (5 Admin UI + 5 User UI + 5 Admin API + 5 User API). Total group target: **80 scenarios**.

---

## Tagging convention (used by Allure filters)

Every scenario MUST carry at minimum:

1. **Member tag**: one of `@malinda` `@manodya` `@bhawanthi` `@tharindu`
2. **Module tag**: one of `@sales` `@plants` `@categories` `@dashboard` `@auth`
3. **Type tag**: `@ui` or `@api`
4. **Role tag**: `@admin` or `@user`

Optional context tags:
- `@smoke` — must-pass critical-path scenarios
- `@negative` — invalid-input / validation scenarios
- `@rbac` — role-based access control / 403 scenarios

Example:
```gherkin
@tharindu @sales @ui @admin @smoke
Scenario: UI_SALES_ADMIN_001 - Admin sells a plant successfully
```

---

## Repository layout

```
qa-training-cypress/
├── cypress/
│   ├── e2e/                # *.feature files only
│   │   ├── ui/<module>/
│   │   └── api/<module>/
│   ├── step_definitions/   # *.steps.ts (one per .feature, plus shared/)
│   ├── support/
│   │   ├── pages/          # Page Object Model classes
│   │   └── api/            # HTTP client wrappers per resource
│   └── fixtures/           # Static test data (users, payloads)
├── reports/                # Allure results + generated report (gitignored)
├── Jenkinsfile             # CI pipeline
├── cypress.config.ts
├── tsconfig.json
└── package.json
```

---

## Git workflow

- `main` is **protected** — no direct pushes.
- Each member works on a feature branch: `feat/<module>-<your-name>` (e.g., `feat/categories-ui-manodya`).
- Open a Pull Request → at least **1 review** → merge.
- Commit message format: `<type>(<module>): <summary>` — e.g. `test(sales-ui): add sales sell scenarios`, `feat(plants-api): plant update step defs`.

### First-time clone
```bash
git clone <repo-url>
cd qa-training-cypress
git checkout -b feat/<your-module>-<your-name>
npm ci
```

---

## Adding your tests (for teammates)

1. Find your placeholder files — they have a banner `OWNER: <YourName>` and `TODO:` comments.
2. **Do not edit** files owned by other members.
3. Reuse helpers from:
   - `cypress/support/commands.ts` — `cy.loginUI`, `cy.apiAuth`
   - `cypress/step_definitions/shared/` — `Given I am logged in as "admin"`, `When I navigate to ...`
   - `cypress/support/pages/BasePage.ts`
   - `cypress/support/api/apiClient.ts`
4. Match the test IDs in the group Test Case Excel document (e.g., `UI_CATEGORY_ADMIN_001`).
5. Run your own scenarios with `npx cypress run --env tags="@<yourname>"` before opening a PR.

---

## CI

`Jenkinsfile` defines the pipeline: install → run all Cypress tests → generate Allure report → archive the HTML report. See the file for stage details.

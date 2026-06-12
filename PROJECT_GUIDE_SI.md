# QA Training App — Cypress Automation Project (සිංහල පැහැදිලි කිරීම)

මෙම ලේඛනය `qa-training-cypress/` project එක මුළුමනින්ම පැහැදිලි කරයි — මොකක්ද implement කරලා තියෙන්නේ, භාවිතා කරපු technology මොනවද, files එකිනෙක සම්බන්ධ වෙන හැටි, සහ Tharindu ගේ වැඩ කොටස කොහොමද කරලා තියෙන්නේ කියන හැම දේම.

---

## 1. Project එක ගැන කෙටි හැඳින්වීමක්

මේක **IS3440 IT Quality Assurance** group assignment එක. අපේ group එකට **Cypress** framework එක දීලා තියෙන්නේ. අපි Spring Boot **QA Training App** එක (port `8080` එක මත run වෙන) automation tests වලින් test කරනවා.

**Coverage:**
- **UI tests** — සැබෑ browser එකේ pages load කරලා buttons click කරලා forms fill කරලා test කරනවා.
- **API tests** — backend endpoints වලට කෙළින්ම HTTP requests යවලා status codes, response body validate කරනවා.
- Tharindu, Malinda, Manodya, Bhawanthi — හතර දෙනාම තමන්ට අයිති modules වලට **20 scenarios බැගින්** ලියන්න ඕන. මුළු group එකේ target එක **80 scenarios**.

---

## 2. Technology Stack එක (මෙතන භාවිතා කරපු දේවල්)

| Layer | Tool | Version | Role එක (අපි කොහොමද use කරන්නේ?) |
|---|---|---|---|
| Language | **TypeScript** | 5.x | Cypress JS වලින් run වෙනවා — TS එකෙන් type safety + autocomplete ලැබෙනවා. |
| Test runner | **Cypress** | 13.x | Browser එක control කරලා UI tests run කරනවා, `cy.request()` එකෙන් API tests වලත් use කරනවා. |
| BDD layer | **@badeball/cypress-cucumber-preprocessor** | 20.x | Gherkin (`*.feature`) files Cucumber syntax එකෙන් ලියන්න පුළුවන් කරනවා. |
| TS Bundler | **@bahmutov/cypress-esbuild-preprocessor** + esbuild | — | TypeScript step definitions Cypress එකට load කරගන්න ඕන esbuild එකෙන් compile කරනවා. |
| Reporting | **@shelex/cypress-allure-plugin** + allure-commandline | 2.x | Beautiful HTML report එකක් generate කරනවා — tags, categories, screenshots පෙන්වනවා. |
| Build/Pkg mgr | **Node.js 20 LTS** + **npm** | — | Dependencies install කරන්න, scripts run කරන්න. |
| CI/CD | **Jenkins** | — | [Jenkinsfile](./Jenkinsfile) එකෙන් pipeline define කරලා — Checkout → Install → Tests → Report. |
| Version control | **Git + GitHub** | — | Team එක එක branch එකේ වැඩ කරනවා, PR review කරලා main එකට merge කරනවා. |

> **වැදගත්:** Cypress එක Java හෝ Python වලින් වැඩ කරන්නේ නෑ. ඒක **Node.js (JavaScript/TypeScript)** වලින් විතරයි run වෙන්නේ. ඒ නිසා අපි TypeScript භාවිතා කරනවා.

---

## 3. Project Folder ව්‍යුහය

```
qa-training-cypress/
├── cypress.config.ts                     # Cypress එකේ main config — baseUrl, plugins සියල්ල
├── tsconfig.json                         # TypeScript compiler options
├── package.json                          # npm scripts + dependencies list
├── package-lock.json                     # Exact dependency versions (npm ci use කරන්න)
├── .cypress-cucumber-preprocessorrc.json # Cucumber step definitions කොහෙද කියලා පෙන්වනවා
├── .gitignore                            # Git එකට push නොකරන files
├── .nvmrc                                # Node version (20)
├── Jenkinsfile                           # Jenkins CI pipeline
├── README.md                             # Project overview
├── RUNNING.md                            # Step-by-step run guide
├── PROJECT_GUIDE_SI.md                   # ← මේ file එක
│
├── cypress/
│   ├── e2e/                              # SCENARIOS — .feature files (Gherkin syntax)
│   │   ├── ui/                           # UI tests (browser වලින්)
│   │   │   ├── auth/login.feature
│   │   │   ├── dashboard/                # ← Malinda
│   │   │   ├── categories/               # ← Manodya + Malinda
│   │   │   ├── plants/                   # ← Bhawanthi + Malinda + Tharindu (edit)
│   │   │   └── sales/                    # ← Tharindu (ALL)
│   │   │       ├── sales-sell.feature           # ✅ Tharindu
│   │   │       ├── sales-view.feature           # ✅ Tharindu
│   │   │       └── sales-delete.feature         # ✅ Tharindu
│   │   └── api/                          # API tests (HTTP වලින්)
│   │       ├── categories/
│   │       ├── plants/
│   │       │   └── plant-update.feature         # ✅ Tharindu
│   │       └── sales/                           # ← Tharindu (ALL)
│   │
│   ├── step_definitions/                 # CODE — feature steps වල code එක මෙතන
│   │   ├── shared/                       # හැම සාමාජිකයාම reuse කරන steps
│   │   │   ├── auth.steps.ts             # Login / logout
│   │   │   └── common.steps.ts           # Navigate / "I should see" / 403 etc.
│   │   ├── ui/                           # UI step files (each .feature → 1 .steps.ts)
│   │   └── api/                          # API step files
│   │
│   ├── support/                          # හවුල් helpers (page objects, api clients, commands)
│   │   ├── e2e.ts                        # Cypress එකට කලින්ම load වෙන file
│   │   ├── commands.ts                   # cy.loginUI, cy.apiAuth වැනි custom commands
│   │   ├── index.d.ts                    # TypeScript type definitions
│   │   ├── scenarioState.ts              # Step files අතර data share කරන shared state
│   │   ├── pages/                        # Page Object Model classes (UI elements)
│   │   │   ├── BasePage.ts
│   │   │   ├── LoginPage.ts
│   │   │   ├── SellPlantPage.ts          # ✅ Tharindu
│   │   │   ├── SalesListPage.ts          # ✅ Tharindu
│   │   │   ├── PlantFormPage.ts          # ✅ Tharindu (edit) + 🚧 Malinda (add)
│   │   │   └── ... (placeholders)
│   │   └── api/                          # REST API client wrappers
│   │       ├── apiClient.ts              # cy.request wrapper
│   │       ├── authApi.ts                # JWT login helper
│   │       ├── salesApi.ts               # ✅ Tharindu
│   │       ├── plantsApi.ts              # Shared (Tharindu = update, others = CRUD)
│   │       └── categoriesApi.ts          # Placeholder for Manodya/Malinda
│   │
│   └── fixtures/                         # Static test data
│       ├── users.json                    # Admin/User credentials
│       └── test-data.json                # Sample payloads
│
└── reports/                              # Auto-generated, git-ignored
    └── allure-results/                   # Allure raw results → HTML report
```

---

## 4. Cucumber + Cypress + Allure එකට වැඩ කරන හැටි

මේ තුන් එක එකට වැඩ කරන flow එක මෙන්න:

```
.feature file (Gherkin)        ↓
   ↓                            ↓
Cucumber preprocessor          Allure plugin
   ↓                            ↓
Step definition (.ts)          Test result + screenshot capture
   ↓                            ↓
Page Object / API client       Allure raw data
   ↓                            ↓
Cypress browser / cy.request   HTML report (npm run report)
   ↓
Spring Boot App (localhost:8080)
```

### 4.1. Feature file එකේ shape එක

[cypress/e2e/ui/sales/sales-sell.feature](./cypress/e2e/ui/sales/sales-sell.feature) බලන්න:

```gherkin
@tharindu @sales @ui
Feature: Sell Plant

  @admin @smoke
  Scenario: UI_SALES_ADMIN_001 - Admin sells a plant successfully
    Given I am logged in as "admin"
    And a plant exists with stock greater than 0
    When I navigate to "/ui/sales/new"
    And I select the first available plant
    And I enter a sale quantity of "2"
    And I click the Sell button
    Then I should be redirected to "/ui/sales"
    And the sold plant should appear in the sales list
```

මෙහි දකින්න:
- **`@tharindu @sales @ui`** — Tags. Allure report එකේ filter කරන්න සහ tag එකෙන් tests run කරන්න (`npm run cy:run:tharindu`).
- **`Given / When / Then / And`** — Gherkin keywords. හැම පේළියක්ම ඊට අදාළ step definition එකට match වෙනවා.
- **`UI_SALES_ADMIN_001`** — Test Case Excel document එකේ ID එක.

### 4.2. Step definition එක (TypeScript code)

[cypress/step_definitions/ui/sales-sell.steps.ts](./cypress/step_definitions/ui/sales-sell.steps.ts) එකේ:

```typescript
When('I select the first available plant', () => {
  sellPage.selectFirstAvailablePlant().then((label) => {
    state.plantOriginalName = label;
  });
});
```

- Cucumber expression (`'I select the first available plant'`) feature එකේ පේළියට match වෙනවා.
- Callback එක Cypress browser එක control කරනවා `sellPage.selectFirstAvailablePlant()` මගින්.
- `state.plantOriginalName` — පසුව `Then` step එකෙන් check කරන්න data store කරගන්නවා (scenarioState).

---

## 5. Authentication ක්‍රමය (JWT + UI session)

App එක **JWT (JSON Web Token)** වලින් API access control කරනවා, UI එක session cookies භාවිතා කරනවා.

### 5.1. API JWT flow

[cypress/support/api/authApi.ts](./cypress/support/api/authApi.ts):

```typescript
export function jwtAuthHeader(role: UserRole): Cypress.Chainable<{ Authorization: string }> {
  // 1. Cache එක check කරනවා (අනවශ්‍ය logins නවත්වන්න)
  if (tokenCache[role]) return cy.wrap({ Authorization: `Bearer ${tokenCache[role]}` });

  // 2. POST /api/auth/login → token ලබාගන්නවා
  return cy.request({
    method: 'POST',
    url: '/api/auth/login',
    body: { username, password },
  }).then((res) => {
    const token = res.body.token;
    tokenCache[role] = token;
    // 3. "Bearer <token>" header එකක් return කරනවා
    return { Authorization: `Bearer ${token}` };
  });
}
```

මෙය step definitions වලින් මෙහෙම call කරනවා:

```typescript
Given('I have {string} sales API credentials', (role: string) => {
  jwtAuthHeader(role as UserRole).then((auth) => {
    state.auth = auth;   // ← scenarioState එකේ save කරනවා
  });
});
```

පසු steps state.auth use කරනවා `salesApi.create(state.auth, ...)` විදියට.

### 5.2. UI login flow

[cypress/support/commands.ts](./cypress/support/commands.ts):

```typescript
Cypress.Commands.add('loginUI', (role: UserRole) => {
  cy.session(['ui', role], () => {       // ← session cache කරනවා
    cy.visit('/ui/login');
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').first().click();
    cy.url().should('include', '/ui/dashboard');
  });
});
```

UI tests වල **`Given I am logged in as "admin"`** call කරපුවාම `cy.loginUI('admin')` run වෙනවා — එක scenario එක තුළ session එක reuse වෙනවා.

### 5.3. Credentials

[cypress/fixtures/users.json](./cypress/fixtures/users.json):

```json
{
  "admin": { "username": "admin",    "password": "admin123" },
  "user":  { "username": "testuser", "password": "test123"  }
}
```

> **සටහන:** User role එකේ username එක **`user` නෙවෙයි**, **`testuser`**. ඒක app එකේ database එකේ එහෙම තමයි seed වෙලා තියෙන්නේ.

---

## 6. Page Object Model (POM)

POM එක එක page එකකට අදාළ **selectors** සහ **actions** එක class එකකට encapsulate කරන pattern එකක්. ඒකෙන් selectors හැම තැනකම නෙවෙයි එක තැනක තියෙනවා — DOM එක වෙනස් වුණොත් එක file එකක update කරපුවාම ඇති.

### 6.1. BasePage — හවුල් parent class

[cypress/support/pages/BasePage.ts](./cypress/support/pages/BasePage.ts):

```typescript
export abstract class BasePage {
  abstract readonly url: string;
  visit() { return cy.visit(this.url); }
  expectUrl(path: string) { cy.url().should('include', path); }
}
```

### 6.2. SellPlantPage (Tharindu)

[cypress/support/pages/SellPlantPage.ts](./cypress/support/pages/SellPlantPage.ts):

```typescript
export class SellPlantPage extends BasePage {
  readonly url = '/ui/sales/new';

  // SELECTORS — DOM ඉන්ද්‍රියන් identify කරන helpers
  plantSelect()   { return cy.get('select[name="plantId"]'); }
  quantityInput() { return cy.get('input[name="quantity"]'); }
  sellButton()    { return cy.contains('button', /^Sell$/i); }

  // ACTIONS — page එක තුළ user behavior
  selectFirstAvailablePlant() { /* ... */ }
  enterQuantity(qty)          { this.quantityInput().clear().type(String(qty)); }
  clickSell()                 { this.sellButton().click(); }
}
```

### 6.3. SalesListPage (Tharindu)

[cypress/support/pages/SalesListPage.ts](./cypress/support/pages/SalesListPage.ts) එකේ:
- Table rows access, sorting, delete icon click — සියල්ල මෙතන.
- Delete button එක `<form action="/ui/sales/delete/{id}">` එකක් යටතේ. Native `confirm()` dialog එක Cypress එක auto-accept කරනවා.

### 6.4. PlantFormPage (Tharindu = edit, Malinda = add)

[cypress/support/pages/PlantFormPage.ts](./cypress/support/pages/PlantFormPage.ts) — Add Plant සහ Edit Plant **එකම form structure එක** use කරන නිසා එක page object එක share කරනවා.

```typescript
visitAdd()            { return cy.visit('/ui/plants/add'); }
visitEdit(id: number) { return cy.visit(`/ui/plants/edit/${id}`); }
```

---

## 7. API Clients (REST endpoints wrap කරන helpers)

### 7.1. apiClient — single wrapper around cy.request

[cypress/support/api/apiClient.ts](./cypress/support/api/apiClient.ts):

```typescript
export const apiClient = {
  get:    (path, qs?, auth?) => request('GET',    path, { auth, qs }),
  post:   (path, body?, auth?, qs?) => request('POST', path, { auth, body, qs }),
  put:    (path, body?, auth?) => request('PUT',    path, { auth, body }),
  delete: (path, auth?)        => request('DELETE', path, { auth }),
};
```

**වැදගත්** — `failOnStatusCode: false` දාලා තියෙනවා. ඒකෙන් 4xx/5xx responses වලින් Cypress retry කරන්නේ නෑ — negative tests වලට අවශ්‍යයි (eg. user POST → 403 expect කරනවා).

### 7.2. salesApi (Tharindu)

[cypress/support/api/salesApi.ts](./cypress/support/api/salesApi.ts):

```typescript
export const salesApi = {
  list:    (auth)         => apiClient.get('/api/sales',           undefined, auth),
  getOne:  (auth, id)     => apiClient.get(`/api/sales/${id}`,     undefined, auth),
  create:  (auth, args)   => apiClient.post(
                                `/api/sales/plant/${args.plantId}`,
                                undefined, auth,
                                { quantity: args.quantity }    // ← query parameter
                              ),
  delete:  (auth, id)     => apiClient.delete(`/api/sales/${id}`, auth),
  listPaged: (auth, qs)   => apiClient.get('/api/sales/page', qs, auth),
};
```

**මතක තබාගන්න:** Sale create කරන්නේ body එකකින් නෙවෙයි — `POST /api/sales/plant/{plantId}?quantity=N` විදියට **path + query** එකෙන්.

### 7.3. plantsApi (Tharindu = update, Bhawanthi = list/get/delete, Malinda = create)

[cypress/support/api/plantsApi.ts](./cypress/support/api/plantsApi.ts) — හවුල් file එක. Owners යාබදව comments වල specify කරලා තියෙනවා.

---

## 8. Shared State — scenarioState

[cypress/support/scenarioState.ts](./cypress/support/scenarioState.ts):

```typescript
export interface ScenarioState {
  auth?: Record<string, string>;
  plantId?: number;
  plantStockBefore?: number;
  saleId?: number;
  lastResponse?: { status: number; body: unknown };
  rowsBefore?: number;
}
export const state: ScenarioState = {};
export function resetState() { /* ... */ }
```

**ඇයි මේක ඕන:** Step definitions වෙන වෙන files වල තියෙනවා. නමුත් එක Scenario එක ඇතුළේ steps වලට එකම data share කරගන්න ඕන.

උදා:
- `Given I have "admin" credentials` → `state.auth = ...` set කරනවා
- `When I POST a new sale` → `state.auth` use කරනවා request යවන්න
- `Then the response status should be 200` → `state.lastResponse.status` check කරනවා

`e2e.ts` එකේ `beforeEach(resetState)` දාලා තියෙන නිසා හැම scenario එකකම fresh start.

[cypress/support/e2e.ts](./cypress/support/e2e.ts):

```typescript
import '@shelex/cypress-allure-plugin';
import './commands';
import { resetState } from './scenarioState';

beforeEach(() => { resetState(); });   // ← Scenario එක පටන් ගන්න මුලින්ම state clear

afterEach(function () {
  if (this.currentTest?.state === 'failed') {
    cy.screenshot(/* ... */);    // ← Fail උනොත් Allure එකට screenshot attach
  }
});
```

---

## 9. Step Definitions — Feature steps වල code එක

Feature file එකේ එක step එකකට ඊට අදාළ TypeScript callback එකක් තියෙන්න ඕන. නැතිනම් Cucumber "Undefined step" error එක දෙනවා.

### 9.1. Shared steps (හැම සාමාජිකයාම reuse කරනවා)

[cypress/step_definitions/shared/auth.steps.ts](./cypress/step_definitions/shared/auth.steps.ts):

```typescript
Given('I am logged in as {string}', (role: string) => {
  cy.loginUI(role as UserRole);
});
```

[cypress/step_definitions/shared/common.steps.ts](./cypress/step_definitions/shared/common.steps.ts):

```typescript
When('I navigate to {string}', (path: string) => {
  cy.visit(path, { failOnStatusCode: false });
});

Then('I should be redirected to the 403 page', () => {
  cy.url().should('match', /403|access[-_ ]?denied/i);
});
```

### 9.2. Tharindu's API step files

| File | Covers |
|---|---|
| [sales-create-api.steps.ts](./cypress/step_definitions/api/sales-create-api.steps.ts) | API_SALES_ADMIN_001, 002, USER_002 |
| [sales-list-api.steps.ts](./cypress/step_definitions/api/sales-list-api.steps.ts) | API_SALES_ADMIN_003, USER_001, USER_005 |
| [sales-delete-api.steps.ts](./cypress/step_definitions/api/sales-delete-api.steps.ts) | API_SALES_ADMIN_004, USER_003 |
| [plant-update-api.steps.ts](./cypress/step_definitions/api/plant-update-api.steps.ts) | API_PLANT_ADMIN_001, USER_004 |

### 9.3. Tharindu's UI step files

| File | Covers |
|---|---|
| [sales-sell.steps.ts](./cypress/step_definitions/ui/sales-sell.steps.ts) | UI_SALES_ADMIN_001, 002, USER_003 |
| [sales-view.steps.ts](./cypress/step_definitions/ui/sales-view.steps.ts) | UI_SALES_ADMIN_003, USER_001, 002, 004 |
| [sales-delete.steps.ts](./cypress/step_definitions/ui/sales-delete.steps.ts) | UI_SALES_ADMIN_004 |
| [plant-update.steps.ts](./cypress/step_definitions/ui/plant-update.steps.ts) | UI_PLANT_ADMIN_001, USER_001 |

> **හවුල් step definitions:** එක step phrase එක එක file එකකම register කරන්න ඕන — duplicates Cucumber error එක දෙනවා. ඒ නිසා Tharindu ගේ `sales-create-api.steps.ts` එකේ define කරපු `Then the sales API response status should be {int}` එක අනිත් sales API features (list, delete) reuse කරනවා.

---

## 10. Tags Strategy — Allure එකේ filtering / Selective runs

හැම scenario එකකම අඩුම තරමේ මේවා තියෙන්න ඕන:

| Tag category | Examples |
|---|---|
| **Member** | `@tharindu`, `@malinda`, `@manodya`, `@bhawanthi` |
| **Module** | `@sales`, `@plants`, `@categories`, `@dashboard`, `@auth` |
| **Type** | `@ui`, `@api` |
| **Role** | `@admin`, `@user` |
| **Optional** | `@smoke`, `@negative`, `@rbac` |

### Tags වලින් filter කරන හැටි:

```bash
# Tharindu ගේ tests විතරක්
npm run cy:run:tharindu

# Admin role API tests විතරක්
npx cypress run --env tags="@admin and @api"

# RBAC scenarios skip කරන්න
npx cypress run --env tags="not @rbac"

# Plants module එකේ negative tests
npx cypress run --env tags="@plants and @negative"
```

---

## 11. Tharindu ගේ Implementation (20 scenarios)

### 11.1. Implementation map

| Test ID | Type | Role | Feature file | Step def file | Page Object / API client |
|---|---|---|---|---|---|
| UI_SALES_ADMIN_001 | UI | Admin | sales-sell.feature | sales-sell.steps.ts | SellPlantPage |
| UI_SALES_ADMIN_002 | UI | Admin | sales-sell.feature | sales-sell.steps.ts | SellPlantPage |
| UI_SALES_USER_003  | UI | User  | sales-sell.feature | (shared common) | — |
| UI_SALES_ADMIN_003 | UI | Admin | sales-view.feature | sales-view.steps.ts | SalesListPage |
| UI_SALES_USER_001  | UI | User  | sales-view.feature | sales-view.steps.ts | SalesListPage |
| UI_SALES_USER_002  | UI | User  | sales-view.feature | sales-view.steps.ts | SalesListPage |
| UI_SALES_USER_004  | UI | User  | sales-view.feature | sales-view.steps.ts | SalesListPage |
| UI_SALES_ADMIN_004 | UI | Admin | sales-delete.feature | sales-delete.steps.ts | SalesListPage |
| UI_PLANT_ADMIN_001 | UI | Admin | plant-update.feature | plant-update.steps.ts + plant-add.steps.ts (Malinda's shared steps) | PlantFormPage |
| UI_PLANT_USER_001  | UI | User  | plant-update.feature | (shared common) | — |
| API_SALES_ADMIN_001 | API | Admin | sales-create.feature | sales-create-api.steps.ts | salesApi |
| API_SALES_ADMIN_002 | API | Admin | sales-create.feature | sales-create-api.steps.ts | salesApi |
| API_SALES_USER_002  | API | User  | sales-create.feature | sales-create-api.steps.ts | salesApi |
| API_SALES_ADMIN_003 | API | Admin | sales-list.feature   | sales-list-api.steps.ts | salesApi |
| API_SALES_USER_001  | API | User  | sales-list.feature   | sales-list-api.steps.ts | salesApi |
| API_SALES_USER_005  | API | User  | sales-list.feature   | sales-list-api.steps.ts | salesApi |
| API_SALES_ADMIN_004 | API | Admin | sales-delete.feature | sales-delete-api.steps.ts | salesApi |
| API_SALES_USER_003  | API | User  | sales-delete.feature | sales-delete-api.steps.ts | salesApi |
| API_PLANT_ADMIN_001 | API | Admin | plant-update.feature | plant-update-api.steps.ts | plantsApi |
| API_PLANT_USER_004  | API | User  | plant-update.feature | plant-update-api.steps.ts | plantsApi |

### 11.2. Sale create කරන end-to-end flow (UI_SALES_ADMIN_001)

```
sales-sell.feature
   ↓ "Given I am logged in as admin"           → shared/auth.steps.ts → cy.loginUI('admin')
   ↓ "And a plant exists with stock > 0"       → sales-create-api.steps.ts → plantsApi.list() → state.plantId
   ↓ "When I navigate to /ui/sales/new"        → shared/common.steps.ts → cy.visit('/ui/sales/new')
   ↓ "And I select the first available plant"  → sales-sell.steps.ts → SellPlantPage.selectFirstAvailablePlant()
   ↓ "And I enter a sale quantity of 2"        → sales-sell.steps.ts → SellPlantPage.enterQuantity(2)
   ↓ "And I click the Sell button"             → sales-sell.steps.ts → SellPlantPage.clickSell()
   ↓ "Then I should be redirected to /ui/sales"→ shared/common.steps.ts → cy.url().should('include', '/ui/sales')
   ↓ "And the sold plant should appear ..."    → sales-sell.steps.ts → cy.contains(tableRow, state.plantOriginalName)
```

---

## 12. අනිත් සාමාජිකයන්ට අත්හරින ලද Placeholder files

හැම placeholder file එකකම මේ වගේ header එකක් තියෙනවා:

```typescript
// ============================================================
// OWNER: Manodya
// MODULE: Category list (/ui/categories)
// SRS REFERENCE: §5.1
// COVERAGE NOTES: ...
// TAGS: @manodya @categories @ui + @admin|@user + @smoke/@negative/@rbac
// REUSE: CategoryListPage.ts (TODO Manodya fill selectors)
// ============================================================
```

සාමාජිකයන්ට කරන්න ඕන:
1. ඔයාගේ name එක තියන placeholder feature files හොයාගන්න (eg. category-list.feature).
2. ඒවාට scenarios add කරන්න — 5 admin + 5 user.
3. ඊට අදාළ page object file එකේ TODO selectors update කරන්න.
4. Step definitions implement කරන්න.
5. **අනික් සාමාජිකයන්ට අයිති files edit කරන්න එපා.**

### Placeholder files location:

| Member | Feature files | Step def stubs | Page object stubs |
|---|---|---|---|
| **Malinda** | `dashboard.feature`, `plant-add.feature`, `category-update.feature` | `dashboard.steps.ts`, `plant-add.steps.ts`, `category-update.steps.ts` | `DashboardPage.ts`, `CategoryFormPage.ts` |
| **Manodya** | `category-list.feature`, `category-add.feature`, `category-actions.feature` | `category-*.steps.ts` | `CategoryListPage.ts`, `CategoryFormPage.ts` |
| **Bhawanthi** | `plant-list.feature`, `plant-actions.feature` | `plant-list.steps.ts`, `plant-actions.steps.ts` | `PlantListPage.ts` |

---

## 13. Tests Run කරන හැටි (Quick Reference)

### Server එක මුලින් start කරන්න

```bash
# Terminal 1 — App backend
cd <jar-folder>
java -jar qa-training-app.jar
# UI: http://localhost:8080/ui/login
# Swagger: http://localhost:8080/swagger-ui/index.html
```

### Tests run කරන්න

```bash
# Terminal 2 — qa-training-cypress/ folder එක ඇතුළේ
npm ci                       # පළමු වරට විතරයි

# Full group suite
npm run cy:run

# Tharindu's 20 scenarios විතරක්
npm run cy:run:tharindu

# UI විතරක් / API විතරක්
npm run cy:run:ui
npm run cy:run:api

# Interactive (browser එක දකින්න ඕන නම්)
npm run cy:open

# Allure report generate + open
npm run report
```

පූර්ණ guide එක: [RUNNING.md](./RUNNING.md).

---

## 14. Allure Report — Test Results කොහොමද බලන්නේ

`npm run cy:run` headless run එකේදී results `reports/allure-results/` ට save වෙනවා. ඊට පස්සේ:

```bash
npm run report
```

මෙය:
1. `allure generate` — raw results වලින් HTML report එකක් build කරනවා (`reports/allure-report/`)
2. `allure open` — browser එකේ open කරනවා

**Report එකේ:**
- හැම scenario එකකම pass/fail status පෙන්නනවා
- Failed tests වලට screenshot embed වෙනවා
- Tags වලින් filter කරන්න පුළුවන් (`@admin`, `@api`, `@tharindu` ආදී)
- Test history (multiple runs) compare කරන්න පුළුවන්
- Duration graphs, category breakdowns

---

## 15. CI/CD — Jenkins Pipeline

[Jenkinsfile](./Jenkinsfile) එකේ stages:

```
1. Checkout         — Git repo එක pull කරනවා
2. Install          — npm ci
3. Type check       — npm run typecheck (TypeScript errors check)
4. Cypress run      — npm run cy:run
5. Allure generate  — HTML report build
6. Post (always)    — Archive screenshots + report
```

සටහන: Jenkinsfile එක syntactically valid. නමුත් test සඳහා real Jenkins server එකක් අවශ්‍යයි.

---

## 16. නිතර අහන ප්‍රශ්න (FAQ)

### Q: `npm ci` දැම්මාම ECONNREFUSED එනවා?
**A:** App backend එක start කරන්න මුලින්. `java -jar qa-training-app.jar` run කරලා `http://localhost:8080/ui/login` browser එකේ load වෙනවද කියලා බලන්න.

### Q: ICY 401 Unauthorized API tests වලින්?
**A:** Credentials `fixtures/users.json` එකේ check කරන්න. **User role එක `testuser` / `test123`**, **`user` / `user123` නෙවෙයි**.

### Q: Cucumber Expression parse error එනවා `/api/sales` වැනි path එකකින්?
**A:** Cucumber expression වල `/` character එක **alternative operator** ලෙස treat වෙනවා. Path එක double quotes ඇතුළට දාන්න — `"/api/sales"`. නැතිනම් `\/` ලෙස escape කරන්න.

### Q: Step definition එකේ "duplicate step definition" error?
**A:** එකම Cucumber phrase දෙපාරක් register කරලා. එක file එකකින් remove කරන්න.

### Q: TypeScript errors අරගෙන run කරන්න බෑ?
**A:** `npm run typecheck` දාලා error message බලන්න. සාමාන්‍යයෙන් wrong import path එකක් හරි type assertion එකක් අවශ්‍ය වෙනවා.

---

## 17. තවදුරටත් කියවන්න ඕන

| ලේඛනය | අන්තර්ගතය |
|---|---|
| [README.md](./README.md) | Project overview, ownership table, branch rules, tag conventions |
| [RUNNING.md](./RUNNING.md) | Step-by-step setup + run commands + troubleshooting |
| `QA Training App – Software Requirements Specification.pdf` | UI behaviour requirements |
| `QA Training App – Deployment & Access Instructions.pdf` | Backend deployment |
| `http://localhost:8080/swagger-ui/index.html` | Real API spec (endpoints, schemas) |
| `QA_Training_App_TestCases.xlsx` | Tharindu's 20 test cases (formal document) |
| `QA_Training_App_BugReport.docx` | Group bug report (10 bugs) |

---

## සාරාංශය

මේ project එක modular architecture එකකින් design කරලා තියෙන්නේ:

- **Feature files** = English වලින් test scenarios පැහැදිලි කිරීම
- **Step definitions** = Feature steps වල code logic
- **Page Objects** = UI elements සහ actions encapsulate කරන classes
- **API Clients** = REST endpoints wrap කරන helpers
- **Shared State** = Steps අතර data share කරන mechanism
- **Tags** = Selective runs සහ filtering enable කරන labels
- **Allure** = Beautiful HTML reports
- **Jenkins** = CI/CD automation

Tharindu ගේ කොටස් (Sales CRUD UI + Sales CRUD API + Plant Update UI + Plant Update API = 20 scenarios) සම්පූර්ණයෙන්ම implement කරලා. අනිත් සාමාජිකයන්ට අවශ්‍ය foundation එක, page object skeletons, placeholder feature files සියල්ල ready.

**Happy testing! 🌸**

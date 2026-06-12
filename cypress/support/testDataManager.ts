// ============================================================
// testDataManager — fixture-driven seed + restore.
//
//   seedTestData()    ↳ called from `before()` in e2e.ts
//   restoreTestData() ↳ called from `after()`  in e2e.ts
//
// Each teammate maintains their own seed file under
// cypress/fixtures/seed/<their-name>.json. The 5 files are merged
// at module load (baseline → tharindu → bhawanthi → manodya → malinda)
// and processed in order:
//
//   1. categories (parents must come before children)
//   2. plants     (sub-category must already exist)
//   3. sales      (plant must already exist)
//
// References use string keys ("parent": "garden") not IDs. The actual
// auto-generated IDs are stored in `keyToId` maps during seeding.
//
// Restore snapshots the pre-existing IDs at seed time, then at spec end
// deletes anything NOT in the snapshot — covering both the seeded items
// and anything the scenarios themselves created.
// ============================================================
import baseline  from '../fixtures/seed/baseline.json';
import tharindu  from '../fixtures/seed/tharindu.json';
import bhawanthi from '../fixtures/seed/bhawanthi.json';
import manodya   from '../fixtures/seed/manodya.json';
import malinda   from '../fixtures/seed/malinda.json';

import { jwtAuthHeader } from './api/authApi';
import { apiClient } from './api/apiClient';
import { plantsApi, type PlantDto } from './api/plantsApi';
import { salesApi, type SaleDto } from './api/salesApi';

// ─── types ──────────────────────────────────────────────────

interface SeedCategory { key: string; name: string; parent?: string }
interface SeedPlant    { key: string; name: string; category: string; price: number; quantity: number }
interface SeedSale     { plant: string; quantity: number }

interface SeedFile {
  categories?: SeedCategory[];
  plants?:     SeedPlant[];
  sales?:      SeedSale[];
}

interface CategoryDto {
  id: number;
  name: string;
  parent?: { id: number } | null;
}

type Auth = Record<string, string>;

// ─── merge all teammates' files ────────────────────────────

// Order matters: baseline first (since other files may reference its keys).
const seedFiles: SeedFile[] = [
  baseline  as SeedFile,
  tharindu  as SeedFile,
  bhawanthi as SeedFile,
  manodya   as SeedFile,
  malinda   as SeedFile,
];

const allCategories: SeedCategory[] = seedFiles.flatMap((f) => f.categories ?? []);
const allPlants:     SeedPlant[]    = seedFiles.flatMap((f) => f.plants     ?? []);
const allSales:      SeedSale[]     = seedFiles.flatMap((f) => f.sales      ?? []);

// ─── state ──────────────────────────────────────────────────

const preExisting = {
  categories: new Set<number>(),
  plants:     new Set<number>(),
  sales:      new Set<number>(),
};

const categoryIdByKey: Record<string, number> = {};
const plantIdByKey:    Record<string, number> = {};

// ─── public API ─────────────────────────────────────────────

export function seedTestData(): Cypress.Chainable<any> {
  resetState();
  return jwtAuthHeader('admin').then((auth) =>
    snapshotExisting(auth).then(() => seedAll(auth))
  );
}

export function restoreTestData(): Cypress.Chainable<any> {
  return jwtAuthHeader('admin').then((auth) =>
    deleteNewSales(auth)
      .then(() => deleteNewPlants(auth))
      .then(() => deleteNewCategories(auth))
      .then(() => cy.log('[restore] DB restored to pre-test state.'))
  );
}

// ─── internals: snapshot + reset ────────────────────────────

function resetState(): void {
  preExisting.categories.clear();
  preExisting.plants.clear();
  preExisting.sales.clear();
  Object.keys(categoryIdByKey).forEach((k) => delete categoryIdByKey[k]);
  Object.keys(plantIdByKey).forEach((k) => delete plantIdByKey[k]);
}

function snapshotExisting(auth: Auth): Cypress.Chainable<any> {
  return apiClient.get<CategoryDto[]>('/api/categories', undefined, auth).then((cr) => {
    asArray<CategoryDto>(cr.body).forEach((c) => preExisting.categories.add(c.id));
    return plantsApi.list(auth).then((pr) => {
      asArray<PlantDto>(pr.body).forEach((p) => preExisting.plants.add(p.id));
      return salesApi.list(auth).then((sr) => {
        asArray<SaleDto>(sr.body).forEach((s) => preExisting.sales.add(s.id));
        cy.log(
          `[seed] snapshot: ${preExisting.categories.size} cats, ${preExisting.plants.size} plants, ${preExisting.sales.size} sales`
        );
      });
    });
  });
}

// ─── internals: seed ────────────────────────────────────────

function seedAll(auth: Auth): Cypress.Chainable<any> {
  let chain: Cypress.Chainable<any> = cy.wrap(null, { log: false });

  // 1. Categories — must process in declared order so parent keys are
  //    already resolved by the time a child references them.
  for (const cat of allCategories) {
    chain = chain.then(() => seedCategory(auth, cat));
  }

  // 2. Plants — every plant references a category by key.
  for (const plant of allPlants) {
    chain = chain.then(() => seedPlant(auth, plant));
  }

  // 3. Sales — every sale references a plant by key.
  for (const sale of allSales) {
    chain = chain.then(() => seedSale(auth, sale));
  }

  return chain;
}

function seedCategory(auth: Auth, cat: SeedCategory): Cypress.Chainable<any> {
  const body: Record<string, unknown> = { name: cat.name };
  if (cat.parent) {
    const parentId = categoryIdByKey[cat.parent];
    if (parentId == null) {
      throw new Error(
        `Seed: category "${cat.key}" references parent "${cat.parent}" which has not been created (check fixture order or spelling).`
      );
    }
    body.parent = { id: parentId };
  }
  return apiClient.post<CategoryDto>('/api/categories', body, auth).then((r) => {
    if (r.status >= 400) {
      throw new Error(`Seed: category "${cat.key}" POST failed: ${r.status} ${JSON.stringify(r.body)}`);
    }
    categoryIdByKey[cat.key] = r.body.id;
    cy.log(`[seed] + category "${cat.name}" (key=${cat.key}) → id ${r.body.id}`);
  });
}

function seedPlant(auth: Auth, plant: SeedPlant): Cypress.Chainable<any> {
  const categoryId = categoryIdByKey[plant.category];
  if (categoryId == null) {
    throw new Error(
      `Seed: plant "${plant.key}" references category "${plant.category}" which has not been created.`
    );
  }
  const body = { name: plant.name, price: plant.price, quantity: plant.quantity };
  return apiClient.post<PlantDto>(`/api/plants/category/${categoryId}`, body, auth).then((r) => {
    if (r.status >= 400) {
      throw new Error(`Seed: plant "${plant.key}" POST failed: ${r.status} ${JSON.stringify(r.body)}`);
    }
    plantIdByKey[plant.key] = r.body.id;
    cy.log(`[seed] + plant "${plant.name}" (key=${plant.key}) → id ${r.body.id}, stock ${plant.quantity}`);
  });
}

function seedSale(auth: Auth, sale: SeedSale): Cypress.Chainable<any> {
  const plantId = plantIdByKey[sale.plant];
  if (plantId == null) {
    throw new Error(
      `Seed: sale references plant "${sale.plant}" which has not been created.`
    );
  }
  return salesApi.create(auth, { plantId, quantity: sale.quantity }).then((r) => {
    if (r.status >= 400) {
      throw new Error(`Seed: sale on "${sale.plant}" POST failed: ${r.status} ${JSON.stringify(r.body)}`);
    }
  });
}

// ─── internals: restore ─────────────────────────────────────

function deleteNewSales(auth: Auth): Cypress.Chainable<any> {
  return salesApi.list(auth).then((r) => {
    const sales = asArray<SaleDto>(r.body).filter((s) => !preExisting.sales.has(s.id));
    if (sales.length === 0) return cy.wrap(null, { log: false });
    cy.log(`[restore] deleting ${sales.length} new sale(s)`);
    let chain: Cypress.Chainable<any> = cy.wrap(null, { log: false });
    for (const s of sales) chain = chain.then(() => salesApi.delete(auth, s.id));
    return chain;
  });
}

function deleteNewPlants(auth: Auth): Cypress.Chainable<any> {
  return plantsApi.list(auth).then((r) => {
    const plants = asArray<PlantDto>(r.body).filter((p) => !preExisting.plants.has(p.id));
    if (plants.length === 0) return cy.wrap(null, { log: false });
    cy.log(`[restore] deleting ${plants.length} new plant(s)`);
    let chain: Cypress.Chainable<any> = cy.wrap(null, { log: false });
    for (const p of plants) chain = chain.then(() => plantsApi.delete(auth, p.id));
    return chain;
  });
}

function deleteNewCategories(auth: Auth): Cypress.Chainable<any> {
  return apiClient.get<CategoryDto[]>('/api/categories', undefined, auth).then((r) => {
    const cats = asArray<CategoryDto>(r.body).filter((c) => !preExisting.categories.has(c.id));
    if (cats.length === 0) return cy.wrap(null, { log: false });
    // Children first so the FK constraint doesn't bite (the parent delete
    // would otherwise 500 — same root cause as BUG-008).
    const ids = new Set(cats.map((c) => c.id));
    const children = cats.filter((c) => c.parent && ids.has(c.parent.id));
    const roots    = cats.filter((c) => !c.parent || !ids.has(c.parent.id));
    const ordered  = [...children, ...roots];
    cy.log(`[restore] deleting ${ordered.length} new category/sub-category(ies)`);
    let chain: Cypress.Chainable<any> = cy.wrap(null, { log: false });
    for (const c of ordered) chain = chain.then(() => apiClient.delete(`/api/categories/${c.id}`, auth));
    return chain;
  });
}

function asArray<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

// ============================================================
// OWNER: Tharindu
// DB seeding + teardown — runs in the Cypress *Node* process
// (registered as cy tasks + after:run in cypress.config.ts).
//
// WHY THIS EXISTS
//   Several scenarios are "verify-against-existing-data" tests:
//   they assume a plant (with stock) and a sale record already
//   exist. On a fresh MySQL DB the tables are auto-created empty,
//   so those scenarios 404 / "no plants in DB". This module feeds
//   the baseline data before the suite runs and removes what the
//   app permits afterwards.
//
// DATA SHAPE (from fixtures/test-data.json -> seed):
//   main category "QASeedTop"  ->  sub category "QASeedSub"
//                              ->  plant "QA Seed Plant" (stock)
//                              ->  one sale on that plant
//   (Plants can only live under a SUB-category, hence the two-level
//    category tree.)
//
// IDENTITY
//   The seed plant is identified by its SUB-CATEGORY, not its name:
//   the plant-update scenarios rename it to "Updated Rose", so a
//   name-based marker would break. Anything under "QASeedSub" is ours.
//
// CLEANUP IS BEST-EFFORT (an app limitation, not a bug here):
//   The app creates an `inventory` row when a plant is sold, with a
//   FK back to the plant. That makes a *sold* plant impossible to
//   DELETE via the API (and deleting the sale does not release it).
//   Since the seed always sells its plant, cleanup:
//     - deletes EVERY sale under the seed sub-category (always works),
//     - tries to delete the seed plant + its two categories; if the
//       plant is FK-locked (sold), it is RETAINED and reused by the
//       next run's idempotent seed (so the footprint never grows).
//
//   Runs in Node, so it cannot reuse the cy.request-based clients in
//   support/api/*. It uses the global fetch (Node 18/20). Credentials
//   come from fixtures/users.json, data from fixtures/test-data.json.
// ============================================================
import * as fs from 'fs';
import * as path from 'path';

interface SeedConfig {
  category: { name: string };
  subCategory: { name: string };
  plant: { name: string; price: number; quantity: number };
  sale: { quantity: number };
}

interface CategoryRecord {
  id: number;
  name: string;
  parentName?: string; // "-" for a main category, else the parent's name
}
interface PlantRecord {
  id: number;
  name: string;
  quantity?: number;
  category?: { id: number; name?: string };
}
interface SaleRecord {
  id: number;
  plant?: { id: number; category?: { name?: string } };
}

const FIXTURES = path.join(process.cwd(), 'cypress', 'fixtures');

function readJson<T>(file: string): T {
  return JSON.parse(fs.readFileSync(path.join(FIXTURES, file), 'utf-8')) as T;
}
function loadSeedConfig(): SeedConfig {
  return readJson<{ seed: SeedConfig }>('test-data.json').seed;
}
function adminCreds(): { username: string; password: string } {
  const users = readJson<Record<string, { username: string; password: string }>>('users.json');
  return { username: users.admin.username, password: users.admin.password };
}

function loadMockCategories(): { name: string; parentName?: string }[] {
  const data = readJson<any>('test-data.json');
  return data.malinda?.mockCategories || [];
}

// Token is cached for the whole Node process so we don't log in per spec.
let cachedToken: string | null = null;

async function adminToken(baseUrl: string): Promise<string> {
  if (cachedToken) return cachedToken;
  const { username, password } = adminCreds();
  const res = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    throw new Error(`[seed] admin login failed: HTTP ${res.status}. Is the app running at ${baseUrl}?`);
  }
  const body = (await res.json()) as { token: string };
  cachedToken = body.token;
  return cachedToken;
}

/** Thin fetch wrapper: returns { status, body }, never throws on 4xx/5xx. */
async function api<T = unknown>(
  baseUrl: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  pathStr: string,
  token: string,
  body?: unknown
): Promise<{ status: number; body: T }> {
  const res = await fetch(`${baseUrl}${pathStr}`, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await res.text(); // DELETE returns an empty body
  const parsed = text ? (JSON.parse(text) as T) : (undefined as unknown as T);
  return { status: res.status, body: parsed };
}

/** Spring list endpoints return either an array or a { content: [] } page. */
function asArray<T>(body: unknown): T[] {
  if (Array.isArray(body)) return body as T[];
  if (body && typeof body === 'object' && 'content' in (body as Record<string, unknown>)) {
    return (body as { content: T[] }).content;
  }
  return [];
}

// ---------- ensure-exists helpers (idempotent) ----------

async function ensureMainCategory(baseUrl: string, token: string, cfg: SeedConfig): Promise<number> {
  const list = await api(baseUrl, 'GET', '/api/categories', token);
  const found = asArray<CategoryRecord>(list.body).find(
    (c) => c.name === cfg.category.name && (c.parentName === '-' || !c.parentName)
  );
  if (found) return found.id;

  // POST /api/categories — a main category has no parent.
  const created = await api<CategoryRecord>(baseUrl, 'POST', '/api/categories', token, {
    name: cfg.category.name,
  });
  return created.body.id;
}

async function ensureSubCategory(baseUrl: string, token: string, cfg: SeedConfig, mainId: number): Promise<number> {
  const list = await api(baseUrl, 'GET', '/api/categories', token);
  const found = asArray<CategoryRecord>(list.body).find(
    (c) => c.name === cfg.subCategory.name && c.parentName === cfg.category.name
  );
  if (found) return found.id;

  // A sub-category nests the parent as `parent: { id }` (NOT a flat parentId).
  const created = await api<CategoryRecord>(baseUrl, 'POST', '/api/categories', token, {
    name: cfg.subCategory.name,
    parent: { id: mainId },
  });
  return created.body.id;
}

async function ensurePlant(baseUrl: string, token: string, cfg: SeedConfig, subId: number): Promise<number> {
  const list = await api(baseUrl, 'GET', '/api/plants', token);
  // Identify by sub-category so a renamed plant ("Updated Rose") still counts.
  const found = asArray<PlantRecord>(list.body).find((p) => p.category?.id === subId);

  if (found) {
    // Reset name + top up stock if the suite drained/renamed it last run.
    // PUT body uses a FLAT categoryId (verified against the live API).
    if (found.name !== cfg.plant.name || (found.quantity ?? 0) < cfg.plant.quantity) {
      await api(baseUrl, 'PUT', `/api/plants/${found.id}`, token, {
        name: cfg.plant.name,
        price: cfg.plant.price,
        quantity: cfg.plant.quantity,
        categoryId: subId,
      });
    }
    return found.id;
  }

  // POST /api/plants/category/{subId} — body has no categoryId.
  const created = await api<PlantRecord>(baseUrl, 'POST', `/api/plants/category/${subId}`, token, {
    name: cfg.plant.name,
    price: cfg.plant.price,
    quantity: cfg.plant.quantity,
  });
  return created.body.id;
}

async function ensureSale(baseUrl: string, token: string, cfg: SeedConfig, plantId: number): Promise<void> {
  const list = await api(baseUrl, 'GET', '/api/sales', token);
  if (asArray<SaleRecord>(list.body).some((s) => s.plant?.id === plantId)) return;

  // POST /api/sales/plant/{plantId}?quantity=N — no body.
  await api(baseUrl, 'POST', `/api/sales/plant/${plantId}?quantity=${cfg.sale.quantity}`, token);
}

// ---------- public API ----------

/**
 * Idempotently ensure the baseline category tree + plant (with stock) + sale
 * exist. Safe to call before every spec — it only creates what's missing.
 */
export async function seedDatabase(baseUrl: string): Promise<{ mainId: number; subId: number; plantId: number }> {
  const cfg = loadSeedConfig();
  const token = await adminToken(baseUrl);

  const mainId = await ensureMainCategory(baseUrl, token, cfg);
  const subId = await ensureSubCategory(baseUrl, token, cfg, mainId);
  const plantId = await ensurePlant(baseUrl, token, cfg, subId);
  await ensureSale(baseUrl, token, cfg, plantId);

  // Seed mock categories for testing pagination and filtering
  const mockCats = loadMockCategories();
  for (const cat of mockCats) {
    if (!cat.parentName) {
      await ensureMainCategory(baseUrl, token, { category: { name: cat.name } } as any);
    }
  }
  for (const cat of mockCats) {
    if (cat.parentName) {
      const list = await api(baseUrl, 'GET', '/api/categories', token);
      const parent = asArray<CategoryRecord>(list.body).find(c => c.name === cat.parentName && (c.parentName === '-' || !c.parentName));
      if (parent) {
        await ensureSubCategory(baseUrl, token, { subCategory: { name: cat.name }, category: { name: cat.parentName } } as any, parent.id);
      }
    }
  }

  return { mainId, subId, plantId };
}

/**
 * Remove the seeded data the app permits us to remove (see file header).
 * Best-effort: never throws, so a teardown hiccup can't fail the run summary.
 */
export async function cleanupDatabase(baseUrl: string): Promise<void> {
  const cfg = loadSeedConfig();
  let token: string;
  try {
    token = await adminToken(baseUrl);
  } catch (err) {
    console.warn(`[seed] cleanup skipped — could not authenticate: ${(err as Error).message}`);
    return;
  }

  try {
    // 1. Every sale under the seed sub-category (always deletable).
    const sales = asArray<SaleRecord>((await api(baseUrl, 'GET', '/api/sales', token)).body).filter(
      (s) => s.plant?.category?.name === cfg.subCategory.name
    );
    for (const s of sales) {
      await api(baseUrl, 'DELETE', `/api/sales/${s.id}`, token);
    }

    // 2. The seed plant(s) under the seed sub-category.
    const plants = asArray<PlantRecord>((await api(baseUrl, 'GET', '/api/plants', token)).body).filter(
      (p) => p.category?.name === cfg.subCategory.name
    );
    let allPlantsRemoved = true;
    for (const p of plants) {
      const del = await api(baseUrl, 'DELETE', `/api/plants/${p.id}`, token);
      if (del.status >= 300) allPlantsRemoved = false; // sold -> FK-locked, retained
    }

    if (!allPlantsRemoved) {
      console.log(
        `[seed] cleanup removed ${sales.length} sale(s). Seed plant/categories retained ` +
          `(app FK forbids deleting a sold plant); they are reused next run.`
      );
      return;
    }

    // 3. Plant(s) gone -> tear the category tree down (sub before main).
    const cats = asArray<CategoryRecord>((await api(baseUrl, 'GET', '/api/categories', token)).body);
    const sub = cats.find((c) => c.name === cfg.subCategory.name && c.parentName === cfg.category.name);
    if (sub) await api(baseUrl, 'DELETE', `/api/categories/${sub.id}`, token);
    const main = cats.find((c) => c.name === cfg.category.name && (c.parentName === '-' || !c.parentName));
    if (main) await api(baseUrl, 'DELETE', `/api/categories/${main.id}`, token);

    // 4. Tear down mock categories (subcategories first)
    const mockCats = loadMockCategories();
    for (const cat of mockCats) {
      if (cat.parentName) {
        const mockSub = cats.find((c) => c.name === cat.name && c.parentName === cat.parentName);
        if (mockSub) await api(baseUrl, 'DELETE', `/api/categories/${mockSub.id}`, token);
      }
    }
    for (const cat of mockCats) {
      if (!cat.parentName) {
        const mockMain = cats.find((c) => c.name === cat.name && (c.parentName === '-' || !c.parentName));
        if (mockMain) await api(baseUrl, 'DELETE', `/api/categories/${mockMain.id}`, token);
      }
    }

    console.log(`[seed] cleanup removed ${sales.length} sale(s) + seed plant + seed categories + mock categories`);
  } catch (err) {
    console.warn(`[seed] cleanup encountered an error (ignored): ${(err as Error).message}`);
  }
}

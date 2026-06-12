# Test data seed files

One JSON file per teammate. Edit **only your own file** — that's how we avoid merge conflicts.

| File | Owner |
|---|---|
| `baseline.json` | Shared — minimum data every spec needs. Don't edit unless the whole team agrees. |
| `tharindu.json` | Tharindu |
| `bhawanthi.json` | Bhawanthi |
| `manodya.json` | Manodya |
| `malinda.json` | Malinda |

The Cypress lifecycle (see [`cypress/support/e2e.ts`](../../support/e2e.ts)):

- `before()` runs at spec start. It snapshots existing DB IDs, then merges every seed file (baseline → tharindu → bhawanthi → manodya → malinda) and POSTs them in order via the admin API.
- `after()` runs at spec end. It deletes anything the database has that wasn't in the pre-seed snapshot — so the DB ends each spec in exactly the state it started in.

## Schema

```jsonc
{
  "categories": [
    { "key": "garden",      "name": "TestGarden" },
    { "key": "indoorPlants","name": "Indoor", "parent": "garden" }
  ],
  "plants": [
    {
      "key": "fern1",
      "name": "Fern",
      "category": "indoorPlants",
      "price": 50.0,
      "quantity": 25
    }
  ],
  "sales": [
    { "plant": "fern1", "quantity": 3 }
  ]
}
```

- Every category and plant has a unique **`key`** (any string — pick whatever is readable).
- References use the key, never an ID:
  - `categories[i].parent` → key from `categories` (any file).
  - `plants[i].category` → key from `categories` (any file).
  - `sales[i].plant` → key from `plants` (any file).
- You can reference a key declared in another teammate's file. Files are merged before processing.
- Order of processing: **categories first, then plants, then sales**. Inside categories/plants, items are processed in the order they appear (so a sub-category must come *after* its parent).

## Constraints from the SRS (so your seed actually succeeds)

| Field | Rule |
|---|---|
| Category `name` | 3–10 characters |
| Plant `name` | 3–25 characters |
| Plant `price` | > 0 |
| Plant `quantity` | ≥ 0 |
| Plant `category` | must reference a **sub-category** (i.e. its category record has `parent`) |
| Sale `quantity` | ≥ 1 |

If your seed POST fails, the test run aborts with a helpful error pointing at the bad item.

## Adding data — example flow for Bhawanthi

She's writing scenarios for the Plant list (search, filter, pagination), so she wants ≥ 3 plants under different sub-categories.

She opens `bhawanthi.json` and writes:

```json
{
  "categories": [
    { "key": "outdoor", "name": "Outdoor", "parent": "garden" },
    { "key": "succulents", "name": "Succulents", "parent": "garden" }
  ],
  "plants": [
    { "key": "cactus",  "name": "Cactus", "category": "succulents", "price": 80,  "quantity": 15 },
    { "key": "palm",    "name": "Palm",   "category": "outdoor",    "price": 250, "quantity": 5  },
    { "key": "lily",    "name": "Lily",   "category": "indoorPlants", "price": 120, "quantity": 30 }
  ],
  "sales": []
}
```

Notice she:
- Defined two **new sub-categories** under `garden` (which lives in `baseline.json`).
- Referenced `indoorPlants` from `manodya.json` (in case Manodya defines it) — cross-file refs work.
- Added no sales — she doesn't need them for her tests.

When her PR is merged, every spec from then on will have these extra plants available too. After each spec, `restoreTestData()` deletes them and the DB returns to its original state.

## What happens if I leave my file as `{ "categories": [], "plants": [], "sales": [] }`?

Nothing — empty arrays are a no-op. That's the default.

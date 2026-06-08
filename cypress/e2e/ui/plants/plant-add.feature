# ============================================================
# OWNER: Malinda
# MODULE: Add Plant form (/ui/plants/add)
# SRS REFERENCE: §6.2 — Add / Edit Plant Page
# COVERAGE NOTES:
#   - Plant Name (required, 3-25 chars)
#   - Category (required, sub-category)
#   - Price (required, > 0)
#   - Quantity (required, >= 0)
#   - Cancel returns to /ui/plants
#   - "Add a Plant" button visible only to Admin (User -> 403 if accessing /ui/plants/add)
# TAGS: @malinda @plants @ui  + @admin|@user + @smoke/@negative/@rbac
# REUSE: PlantFormPage.ts (add half — TODO Malinda) — Tharindu already implemented the edit half.
# ============================================================
@malinda @plants @ui
Feature: Add Plant (Admin form)

  # TODO Malinda: implement scenarios for the Add Plant flow here.
  # Suggested IDs: UI_PLANT_ADMIN_001 (happy path), UI_PLANT_ADMIN_002 (form validation),
  #                UI_PLANT_ADMIN_003 (name length 3-25), UI_PLANT_USER_001 (403 on /ui/plants/add).

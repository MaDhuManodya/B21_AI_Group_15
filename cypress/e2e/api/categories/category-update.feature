# ============================================================
# OWNER: Malinda
# MODULE: Categories API — PUT (update)
# ENDPOINT: PUT /api/categories/{id}
# COVERAGE NOTES:
#   - Admin can update existing category (200)
#   - User PUT -> 403 Forbidden
#   - Validation errors (name length 3-10) -> 400
# TAGS: @malinda @categories @api  + @admin|@user + @smoke/@negative/@rbac
# REUSE: cypress/support/api/categoriesApi.ts (update method — TODO Malinda).
# ============================================================
@malinda @categories @api
Feature: Categories API — Update

  # TODO Malinda: write update scenarios here.
  # Suggested IDs: API_CATEGORY_ADMIN_005 (PUT 200), API_CATEGORY_USER_004 (PUT 403),
  #                API_CATEGORY_ADMIN_006 (name validation 400).

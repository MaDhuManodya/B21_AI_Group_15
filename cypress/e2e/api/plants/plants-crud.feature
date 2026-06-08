# ============================================================
# OWNER: Bhawanthi
# MODULE: Plants API — list, get-one, delete
# ENDPOINTS: GET /api/plants, GET /api/plants/{id}, DELETE /api/plants/{id}
# COVERAGE NOTES:
#   - Admin: list / get-one / delete allowed
#   - User: GET allowed (read-only), DELETE -> 403
#   - No auth -> 401 Unauthorized
# TAGS: @bhawanthi @plants @api  + @admin|@user + @smoke/@negative/@rbac
# REUSE: cypress/support/api/plantsApi.ts (list/get/delete — TODO Bhawanthi).
#        Tharindu has already implemented `update()` in the same file.
# ============================================================
@bhawanthi @plants @api
Feature: Plants API — List / Get / Delete

  # TODO Bhawanthi: write scenarios here.
  # Suggested IDs: API_PLANT_ADMIN_002 (GET list), API_PLANT_ADMIN_003 (DELETE 200),
  #                API_PLANT_USER_001 (GET allowed), API_PLANT_USER_002 (DELETE 403),
  #                API_PLANT_USER_003 (GET specific ID).

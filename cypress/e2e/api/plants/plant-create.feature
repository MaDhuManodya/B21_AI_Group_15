# ============================================================
# OWNER: Malinda
# MODULE: Plants API — POST (create)
# ENDPOINT: POST /api/plants
# COVERAGE NOTES:
#   - Admin can create plant (200/201)
#   - User POST -> 403 Forbidden
#   - Validation: negative price -> 400, name length 3-25 -> 400
# TAGS: @malinda @plants @api  + @admin|@user + @smoke/@negative/@rbac
# REUSE: cypress/support/api/plantsApi.ts (create method — TODO Malinda).
# ============================================================
@malinda @plants @api
Feature: Plants API — Create

  # TODO Malinda: write create scenarios here.
  # Suggested IDs: API_PLANT_ADMIN_001 (POST 200/201), API_PLANT_ADMIN_004 (negative price 400),
  #                API_PLANT_USER_005 (POST 403).

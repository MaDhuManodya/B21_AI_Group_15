# ============================================================
# OWNER: Manodya
# MODULE: Categories API — list, create, delete
# ENDPOINTS: GET /api/categories, POST /api/categories, DELETE /api/categories/{id}
# COVERAGE NOTES:
#   - Admin: full CRUD allowed
#   - User: GET allowed (read-only), POST/DELETE -> 403 Forbidden
#   - Validation errors (name length 3-10) -> 400 Bad Request
#   - No auth -> 401 Unauthorized
# TAGS: @manodya @categories @api  + @admin|@user + @smoke/@negative/@rbac
# REUSE: cypress/support/api/categoriesApi.ts (TODO Manodya).
# ============================================================
@manodya @categories @api
Feature: Categories API

  # TODO Manodya: write CRUD scenarios here.
  # Suggested IDs: API_CATEGORY_ADMIN_001 (POST create 200/201), API_CATEGORY_ADMIN_002 (DELETE 200),
  #                API_CATEGORY_ADMIN_003 (GET list), API_CATEGORY_ADMIN_004 (name length 400),
  #                API_CATEGORY_USER_001 (GET allowed), API_CATEGORY_USER_002 (POST 403),
  #                API_CATEGORY_USER_003 (DELETE 403).

  @admin @smoke
  Scenario: API_CATEGORIES_ADMIN_006 - Verify categories summary endpoint returns successfull response for admin users
    Given I have "admin" API credentials for categories
    When I GET the categories summary
    Then the category API response should have 8 main categories and 3 sub categories

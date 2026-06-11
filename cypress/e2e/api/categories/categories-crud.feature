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
    Then the category API response should have 8 main categories and 16 sub categories

  @admin
  Scenario: API_CATEGORIES_ADMIN_008 - Verify categories are filtered by the category name for admin users
    Given I have "admin" API credentials for categories
    When I GET the categories page with name "SC_01A"
    Then the category API response status should be 200
    And the response should contain a category with name "SC_01A"

  @user
  Scenario: API_CATEGORIES_USER_006 - Verify the categories are retrieved with pagination for users
    Given I have "user" API credentials for categories
    When I GET the categories page with page 0 and size 12
    Then the category API response status should be 200
    And the response should contain exactly 12 subcategories

  @user
  Scenario: API_CATEGORIES_USER_007 - Verify the relevant sub categories are retrived for the parent id for users
    Given I have "user" API credentials for categories
    When I GET the categories page with parent id 11
    Then the category API response status should be 200
    And the response should contain subcategories of parent 11

  @user
  Scenario: API_CATEGORIES_USER_008 - Verify the relevant categories are sorted according to the id for users
    Given I have "user" API credentials for categories
    When I GET the categories page sorted by "id" in "asec" order
    Then the category API response status should be 200
    And the response categories should be sorted by "id" in "asc" order

  @user
  Scenario: API_CATEGORIES_USER_009 - Verify the categories are sorted according to name for users
    Given I have "user" API credentials for categories
    When I GET the categories page sorted by "name" in "asec" order
    Then the category API response status should be 200
    And the response categories should be sorted by "name" in "asc" order

# ============================================================
# OWNER: Manodya
# MODULE: Categories API — list, create, update, delete
# TAGS: @manodya @categories @api  + @admin|@user + @smoke/@negative/@rbac
# ============================================================
@manodya @categories @api
Feature: Categories API

  @admin @smoke
  Scenario: API_CATEGORY_ADMIN_001 - Verify Admin can get authentication token
    Given I have "admin" API credentials for categories

  @admin
  Scenario: API_CATEGORY_ADMIN_002 - Verify Admin can create category using API
    Given I have "admin" API credentials for categories
    When I POST a new category with name "ApiCatTest"
    Then the category API response status should be 201

  @admin
  Scenario: API_CATEGORY_ADMIN_003 - Verify Admin can get category list using API
    Given I have "admin" API credentials for categories
    When I GET the categories list
    Then the category API response status should be 200
    And the response should contain at least one category

  @admin
  Scenario: API_CATEGORY_ADMIN_004 - Verify Admin can update category using API
    Given I have "admin" API credentials for categories
    When I PUT category 1 with name "UpdCatTest"
    Then the category API response status should be 200

  @admin
  Scenario: API_CATEGORY_ADMIN_005 - Verify Admin can delete category using API
    Given I have "admin" API credentials for categories
    When I DELETE category 2
    Then the category API response status should be 204

  @user @rbac
  Scenario: API_CATEGORY_USER_001 - Verify User can get authentication token
    Given I have "user" API credentials for categories

  @user @rbac
  Scenario: API_CATEGORY_USER_002 - Verify User can get category list using API
    Given I have "user" API credentials for categories
    When I GET the categories list
    Then the category API response status should be 200
    And the response should contain at least one category

  @user @rbac
  Scenario: API_CATEGORY_USER_003 - Verify User can search categories using API
    Given I have "user" API credentials for categories
    When I GET the categories list
    Then the category API response status should be 200

  @user @negative @rbac
  Scenario: API_CATEGORY_USER_004 - Verify User cannot create category using API
    Given I have "user" API credentials for categories
    When I POST a new category with name "UserCat"
    Then the category API response status should be 403

  @user @negative @rbac
  Scenario: API_CATEGORY_USER_005 - Verify User cannot update or delete category using API
    Given I have "user" API credentials for categories
    When I PUT category 1 with name "UserUpdate"
    Then the category API response status should be 403
    When I DELETE category 1
    Then the category API response status should be 403

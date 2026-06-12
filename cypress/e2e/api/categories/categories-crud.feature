# ============================================================
# OWNER: Manodya
# MODULE: Categories API — list, create, update, delete
# TAGS: @manodya @categories @api  + @admin|@user + @smoke/@negative/@rbac
# ============================================================
@manodya @categories @api @215550L
Feature: Categories API


  @admin @smoke @malinda
  Scenario: API_CATEGORIES_ADMIN_006 - Verify categories summary endpoint returns successfull response for admin users
    Given I have "admin" API credentials for categories
    When I GET the categories summary
    Then the category API response should have 15 main categories and 2 sub categories

  @admin @malinda
  Scenario: API_CATEGORIES_ADMIN_008 - Verify categories are filtered by the category name for admin users
    Given I have "admin" API credentials for categories
    When I GET the categories page with name "Cat_02"
    Then the category API response status should be 200
    And the response should contain a category with name "Cat_02"

  @user @malinda
  Scenario: API_CATEGORIES_USER_006 - Verify the categories are retrieved with pagination for users
    Given I have "user" API credentials for categories
    When I GET the categories page with page 0 and size 12
    Then the category API response status should be 200
    And the response should contain exactly 12 subcategories

  @user @malinda
  Scenario: API_CATEGORIES_USER_007 - Verify the relevant sub categories are retrived for the parent id for users
    Given I have "user" API credentials for categories
    When I GET the categories page with parent id of "QASeedTop"
    Then the category API response status should be 200
    And the response should contain subcategories of parent "QASeedTop"

  @user @malinda
  Scenario: API_CATEGORIES_USER_008 - Verify the relevant categories are sorted according to the id for users
    Given I have "user" API credentials for categories
    When I GET the categories page sorted by "id" in "asec" order
    Then the category API response status should be 200
    And the response categories should be sorted by "id" in "asc" order

  @user @malinda
  Scenario: API_CATEGORIES_USER_009 - Verify the categories are sorted according to name for users
    Given I have "user" API credentials for categories
    When I GET the categories page sorted by "name" in "asec" order
    Then the category API response status should be 200
    And the response categories should be sorted by "name" in "asc" order
  @manodya @categories @api @215550L @admin @smoke
  Scenario: API_CATEGORY_ADMIN_001 - Verify Admin can get authentication token
    Given I have "admin" API credentials for categories

  @manodya @categories @api @215550L @admin
  Scenario: API_CATEGORY_ADMIN_002 - Verify Admin can create category using API
    Given I have "admin" API credentials for categories
    When I POST a new category with name "ApiCatTest"
    Then the category API response status should be 201

  @manodya @categories @api @215550L @admin
  Scenario: API_CATEGORY_ADMIN_003 - Verify Admin can get category list using API
    Given I have "admin" API credentials for categories
    When I GET the categories list
    Then the category API response status should be 200
    And the response should contain at least one category

  @manodya @categories @api @215550L @admin
  Scenario: API_CATEGORY_ADMIN_004 - Verify Admin can update category using API
    Given I have "admin" API credentials for categories
    When I PUT category 1 with name "UpdCatTest"
    Then the category API response status should be 200

  @manodya @categories @api @215550L @admin
  Scenario: API_CATEGORY_ADMIN_005 - Verify Admin can delete category using API
    Given I have "admin" API credentials for categories
    When I DELETE category 2
    Then the category API response status should be 204

  @manodya @categories @api @215550L @user @rbac
  Scenario: API_CATEGORY_USER_001 - Verify User can get authentication token
    Given I have "user" API credentials for categories

  @manodya @categories @api @215550L @user @rbac
  Scenario: API_CATEGORY_USER_002 - Verify User can get category list using API
    Given I have "user" API credentials for categories
    When I GET the categories list
    Then the category API response status should be 200
    And the response should contain at least one category

  @manodya @categories @api @215550L @user @rbac
  Scenario: API_CATEGORY_USER_003 - Verify User can search categories using API
    Given I have "user" API credentials for categories
    When I GET the categories list
    Then the category API response status should be 200

  @manodya @categories @api @215550L @user @negative @rbac
  Scenario: API_CATEGORY_USER_004 - Verify User cannot create category using API
    Given I have "user" API credentials for categories
    When I POST a new category with name "UserCat"
    Then the category API response status should be 403

  @manodya @categories @api @215550L @user @negative @rbac
  Scenario: API_CATEGORY_USER_005 - Verify User cannot update or delete category using API
    Given I have "user" API credentials for categories
    When I PUT category 1 with name "UserUpdate"
    Then the category API response status should be 403
    When I DELETE category 1
    Then the category API response status should be 403

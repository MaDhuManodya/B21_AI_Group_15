# ============================================================
# OWNER: Manodya
# MODULE: Category list page (/ui/categories)
# TAGS: @manodya @categories @ui  + @admin|@user + @smoke/@negative/@rbac
# ============================================================
@manodya @categories @ui @215550L
Feature: Category List

  @admin @smoke
  Scenario: UI_CATEGORY_ADMIN_001 - Verify category page visible to Admin
    Given I am logged in as "admin"
    When I navigate to "/ui/categories"
    Then the categories table should be visible
    And the "Add Category" button should be visible on the categories page

  @admin
  Scenario: UI_CATEGORY_ADMIN_002 - Verify Admin can search category by name
    Given I am logged in as "admin"
    And I navigate to "/ui/categories"
    When I search for category "Test"
    Then the categories table should be visible
    
  @admin
  Scenario: UI_CATEGORY_ADMIN_003 - Verify Admin can filter categories by parent
    Given I am logged in as "admin"
    And I navigate to "/ui/categories"
    When I filter categories by parent "Electronics"
    Then the categories table should be visible

  @user @smoke @rbac
  Scenario: UI_CATEGORY_USER_001 - Verify category page visible to User
    Given I am logged in as "user"
    When I navigate to "/ui/categories"
    Then the categories table should be visible
    And the "Add Category" button should NOT be visible on the categories page

  @user
  Scenario: UI_CATEGORY_USER_002 - Verify User can view category table
    Given I am logged in as "user"
    When I navigate to "/ui/categories"
    Then the categories table should be visible
    
  @user
  Scenario: UI_CATEGORY_USER_003 - Verify User can search category by name
    Given I am logged in as "user"
    And I navigate to "/ui/categories"
    When I search for category "Test"
    Then the categories table should be visible

  @user
  Scenario: UI_CATEGORY_USER_004 - Verify User can reset category search
    Given I am logged in as "user"
    And I navigate to "/ui/categories"
    When I search for category "NonExistentCategory"
    And the empty message should be visible
    When I click the "Reset" button
    Then the categories table should be visible

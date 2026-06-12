# ============================================================
# OWNER: Manodya
# MODULE: Add Category form (/ui/categories/add)
# TAGS: @manodya @categories @ui  + @admin|@user + @smoke/@negative/@rbac
# ============================================================
@manodya @categories @ui @215550L
Feature: Add Category

  @admin @smoke
  Scenario: UI_CATEGORY_ADMIN_004 - Verify Admin can add new category
    Given I am logged in as "admin"
    And I navigate to "/ui/categories"
    When I click the "Add A Category" button
    And I enter category name "NewCatTest"
    And I click Save on the category form
    Then I should see the category form success alert

  @user @rbac
  Scenario: UI_CATEGORY_USER_005 - Verify User cannot add edit or delete category
    Given I am logged in as "user"
    And I navigate to "/ui/categories"
    Then the "Add A Category" button should NOT be visible on the categories page

# ============================================================
# OWNER: Manodya
# MODULE: Category list — row actions (edit icon + delete icon)
# TAGS: @manodya @categories @ui  + @admin|@user + @smoke/@rbac
# ============================================================
@manodya @categories @ui @215550L
Feature: Category Row Actions

  @manodya @categories @ui @215550L @admin @smoke
  Scenario: UI_CATEGORY_ADMIN_005 - Verify Admin can edit and delete category
    Given I am logged in as "admin"
    And I navigate to "/ui/categories"
    When I click the delete icon on category row 0
    And I confirm the delete prompt
    Then the category "0" should be removed from the list

  @manodya @categories @ui @215550L @user @rbac
  Scenario: UI_CATEGORY_USER_005 - Verify User cannot edit or delete category
    Given I am logged in as "user"
    And I navigate to "/ui/categories"
    Then no edit icon should be visible on the categories table
    And no delete icon should be visible on the categories table

  @user @rbac @malinda
  Scenario: UI_CATEGORY_USER_006 - Verify Edit action is not visible to non-admin user
    Given I am logged in as "user"
    When I open the categories page
    Then the categories table should be visible
    And no edit icon should be visible on the categories table

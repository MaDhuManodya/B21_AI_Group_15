# ============================================================
# OWNER: Manodya
# MODULE: Category list — row actions (edit icon + delete icon)
# SRS REFERENCE: §5.1 — Admin-Specific Features (Edit / Delete)
# COVERAGE NOTES:
#   - Edit icon -> /ui/categories/edit/{id}
#   - Delete icon -> confirmation prompt -> row removed
#   - User: Edit and Delete icons hidden / disabled
# TAGS: @manodya @categories @ui  + @admin|@user + @smoke/@rbac
# REUSE: CategoryListPage.ts (clickEdit, clickDelete, confirmDelete — TODO Manodya).
# ============================================================
@manodya @categories @ui
Feature: Category Row Actions

  # TODO Manodya: implement edit/delete action scenarios.
  # Suggested IDs: UI_CATEGORY_ADMIN_008 (delete with prompt), UI_CATEGORY_USER_005 (no edit/delete icons).

  @user @rbac @malinda
  Scenario: UI_CATEGORY_USER_006 - Verify Edit action is not visible to non-admin user
    Given I am logged in as "user"
    When I open the categories page
    Then the categories table should be visible
    And no edit icon should be visible on the categories table

  @user @debug
  Scenario: debug
    Given I am logged in as "user"
    When I open the categories page
    Then I wait for 2 seconds

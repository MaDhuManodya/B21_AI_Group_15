# ============================================================
# OWNER: Malinda
# MODULE: Category Update form (/ui/categories/edit/{id})
# SRS REFERENCE: §5.2 — Add / Edit Category Page
# COVERAGE NOTES:
#   - Category Name (required, 3-10 chars)
#   - Parent Category (optional — empty = main category)
#   - Success message "Category updated successfully"
#   - Cancel returns to /ui/categories
#   - User -> 403 if accessing /ui/categories/edit/{id}
# TAGS: @malinda @categories @ui  + @admin|@user + @smoke/@negative/@rbac
# REUSE: CategoryFormPage.ts (edit half — TODO Malinda).
# ============================================================
@malinda @categories @ui
Feature: Category Update

  @admin @smoke
  Scenario: UI_PLANT_ADMIN_007 - Verify Admin can edit an existing category with valid data
    Given I am logged in as "admin"
    When I open the edit category page for id 8
    And I update the category name to "Outdoor"
    And I save the category form
    Then I should see the "Category updated successfully" success message
    And I should be redirected to "/ui/categories"
    And I should see "Outdoor" on the category page

  @user @rbac
  Scenario: UI_PLANT_USER_006 - Verify User cannot access Edit Category page via direct URL
    Given I am logged in as "user"
    When I navigate to "/ui/categories/edit/8"
    Then I should be redirected to the 403 page

  @admin @smoke
  Scenario: UI_CATEGORY_USER_007 - Verify Cancel button navigation
    Given I am logged in as "admin"
    When I open the edit category page for id 1
    And I update the category name to "CanceledName"
    And I click the cancel button
    Then I should be redirected to "/ui/categories"
    And I should not see "CanceledName" on the category page

  @user @rbac
  Scenario: UI_CATEGORY_USER_009 - Verify user can dismiss the error banner
    Given I am logged in as "user"
    When I navigate to "/ui/categories/edit/8"
    And I click the close icon on the error banner
    Then the error banner should be dismissed

  @admin @smoke
  Scenario: UI_CATEGORY_USER_008 - Verify Parent Category dropdown options
    Given I am logged in as "admin"
    When I open the edit category page for id 1
    Then the parent category dropdown should contain available categories
    And I should be able to select a category or leave it empty

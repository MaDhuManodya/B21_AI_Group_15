# ============================================================
# OWNER: Bhawanthi Pabasara (215540G)
# MODULE: Plant list — row actions (edit icon + delete icon)
# SRS REFERENCE: §6.1 — Admin-Specific Features (Edit / Delete)
# COVERAGE NOTES:
#   - Edit icon -> /ui/plants/edit/{id}
#   - Delete icon -> confirmation prompt -> row removed
#   - User: "Add a Plant" button and Edit/Delete icons hidden
# TEST IDS: UI_PLANT_ADM_005, UI_PLANT_USR_001
# TAGS: @bhawanthi_pabasara @plants @ui  + @admin|@user + @smoke/@rbac
# REUSE: PlantListPage.ts
# ============================================================
@bhawanthi_pabasara @plants @ui
Feature: Plant Row Actions

  @admin @smoke
  Scenario: UI_PLANT_ADM_005 - Admin deletes a plant after confirmation prompt
    Given I have "admin" plants API credentials
    And I create a plant "Z-Plant-Pabasara-DeleteUI" under category 2 with price 30.0 and quantity 10
    And I am logged in as "admin"
    When I open the plants page
    Then I should see "Z-Plant-Pabasara-DeleteUI"
    When I delete the plant "Z-Plant-Pabasara-DeleteUI" from the list and confirm the prompt
    Then I should NOT see "Z-Plant-Pabasara-DeleteUI"

  @user @rbac
  Scenario: UI_PLANT_USR_001 - Add a Plant button and edit/delete icons are hidden for a normal user
    Given I am logged in as "user"
    When I open the plants page
    Then the "Add a Plant" button should NOT be visible on the plants page
    And no edit icon should be visible on the plants table
    And no delete icon should be visible on the plants table

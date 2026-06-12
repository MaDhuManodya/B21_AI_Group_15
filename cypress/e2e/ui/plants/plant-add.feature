# ============================================================
# MODULE: Add Plant form (/ui/plants/add)
# SRS REFERENCE: §6.2 — Add / Edit Plant Page
# COVERAGE NOTES:
#   - Plant Name (required, 3-25 chars)
#   - Category (required, sub-category)
#   - Price (required, > 0)
#   - Quantity (required, >= 0)
#   - Cancel returns to /ui/plants
#   - "Add a Plant" button visible only to Admin (User -> 403 if accessing /ui/plants/add)
# TEST IDS (Bhawanthi Pabasara, 215540G): UI_PLANT_ADM_001, UI_PLANT_ADM_002, UI_PLANT_ADM_003
# TAGS: @bhawanthi_pabasara @plants @ui  + @admin + @smoke/@negative/@boundary
# REUSE: PlantFormPage.ts (add half)
#
# REMAINING (Malinda): UI_PLANT_USER_001 — User gets 403 when accessing /ui/plants/add directly.
# ============================================================
@bhawanthi_pabasara @plants @ui
Feature: Add Plant (Admin form)

  Background:
    Given I am logged in as "admin"

  @admin @smoke
  Scenario: UI_PLANT_ADM_001 - Admin adds a plant successfully with valid data
    When I open the Add Plant page
    And I fill in the plant form with name "Z-Plant-Pabasara-AddUI", category "QASeedSub", price "45.50" and quantity "12"
    And I click Save on the plant form
    Then I should be redirected to the plants list page
    And I should see "Plant added successfully"
    And I should see "Z-Plant-Pabasara-AddUI"
    And I delete the plant "Z-Plant-Pabasara-AddUI" via the API

  @admin @negative
  Scenario: UI_PLANT_ADM_002 - Form validation when mandatory fields are empty
    When I open the Add Plant page
    And I click Save on the plant form
    Then I should see the plant name validation error
    And I should see the plant category validation error
    And I should see the plant price validation error
    And I should see the plant quantity validation error

  @admin @negative @boundary
  Scenario: UI_PLANT_ADM_003 - Plant Name length boundary validation (3-25 characters)
    When I open the Add Plant page
    And I fill in the plant form with name "AB", category "QASeedSub", price "10" and quantity "5"
    And I click Save on the plant form
    Then I should see the plant name length validation error
    When I open the Add Plant page
    And I fill in the plant form with name "ABCDEFGHIJKLMNOPQRSTUVWXYZ", category "QASeedSub", price "10" and quantity "5"
    And I click Save on the plant form
    Then I should see the plant name length validation error

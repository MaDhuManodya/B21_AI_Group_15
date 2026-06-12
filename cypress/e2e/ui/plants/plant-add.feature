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
@bhawanthi_pabasara @plants @ui @epic("UI") @feature("Plants") @story("Create") @owner("Bhawanthi-Pabasara") @severity("normal")
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

  @admin @negative @severity("minor")
  Scenario: UI_PLANT_ADM_002 - Form validation when mandatory fields are empty
    When I open the Add Plant page
    And I click Save on the plant form
    Then I should see the plant name validation error
    And I should see the plant category validation error
    And I should see the plant price validation error
    And I should see the plant quantity validation error

  @admin @negative @boundary @severity("minor")
  Scenario: UI_PLANT_ADM_003 - Plant Name length boundary validation (3-25 characters)
    When I open the Add Plant page
    And I fill in the plant form with name "AB", category "QASeedSub", price "10" and quantity "5"
    And I click Save on the plant form
    Then I should see the plant name length validation error
    When I open the Add Plant page
    And I fill in the plant form with name "ABCDEFGHIJKLMNOPQRSTUVWXYZ", category "QASeedSub", price "10" and quantity "5"
    And I click Save on the plant form
    Then I should see the plant name length validation error

  @admin @negative @malinda @owner("Malinda") @severity("minor")
  Scenario: UI_PLANT_ADMIN_006 - Verify price validation (must be > 0)
    When I open the Add Plant page
    And I fill in the plant name "Tulip"
    And I select a valid plant category
    And I enter the plant price "0"
    And I enter the plant quantity "10"
    And I click Save on the plant form
    Then I should see the "Price must be greater than 0" error message below the price field in red
    And the plant should not be created

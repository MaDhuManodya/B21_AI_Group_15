# ============================================================
# OWNER: Malinda
# MODULE: Add Plant form (/ui/plants/add)
# SRS REFERENCE: §6.2 — Add / Edit Plant Page
# COVERAGE NOTES:
#   - Plant Name (required, 3-25 chars)
#   - Category (required, sub-category)
#   - Price (required, > 0)
#   - Quantity (required, >= 0)
#   - Cancel returns to /ui/plants
#   - "Add a Plant" button visible only to Admin (User -> 403 if accessing /ui/plants/add)
# TAGS: @malinda @plants @ui  + @admin|@user + @smoke/@negative/@rbac
# REUSE: PlantFormPage.ts (add half — TODO Malinda) — Tharindu already implemented the edit half.
# ============================================================
@malinda @plants @ui
Feature: Add Plant (Admin form)

  @admin @negative
  Scenario: UI_PLANT_ADMIN_006 - Verify price validation (must be > 0)
    Given I am logged in as "admin"
    When I open the Add Plant page
    And I fill in the plant name "Tulip"
    And I select a valid plant category
    And I enter the plant price "0"
    And I enter the plant quantity "10"
    And I click Save on the plant form
    Then I should see the "Price must be greater than 0" error message below the price field in red
    And the plant should not be created

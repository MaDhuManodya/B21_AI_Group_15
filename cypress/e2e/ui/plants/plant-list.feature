# ============================================================
# OWNER: Bhawanthi Pabasara (215540G)
# MODULE: Plant list page (/ui/plants)
# SRS REFERENCE: §6.1 — Plant List Page
# COVERAGE NOTES:
#   - Paginated list of plants (Name, Category, Price, Stock)
#   - Search by plant name
#   - Filter by category (All Categories dropdown)
#   - Sort by Name / Price / Quantity
#   - "Low" badge when quantity < 5
#   - Empty state: "No plants found"
#   - Admin: "Add a Plant" button visible
#   - User: "Add a Plant" hidden / disabled
# TEST IDS: UI_PLANT_ADM_004, UI_PLANT_USR_002, UI_PLANT_USR_003, UI_PLANT_USR_004, UI_PLANT_USR_005
# TAGS: @bhawanthi_pabasara @plants @ui  + @admin|@user + @smoke/@negative
# REUSE: PlantListPage.ts
# ============================================================
@bhawanthi_pabasara @plants @ui
Feature: Plant List

  @admin @smoke
  Scenario: UI_PLANT_ADM_004 - Low stock "Low" badge displayed when quantity is below 5
    Given I have "admin" plants API credentials
    And I create a plant "Z-Plant-Pabasara-LowStock" under category 2 with price 20.0 and quantity 3
    And I am logged in as "admin"
    When I open the plants page
    Then the "Z-Plant-Pabasara-LowStock" row should show the "Low" badge
    And I DELETE that plant

  @user @smoke
  Scenario: UI_PLANT_USR_002 - Search filters the plant list by name
    Given I have "admin" plants API credentials
    And I create a plant "Z-Plant-Pabasara-Search" under category 2 with price 22.0 and quantity 9
    And I am logged in as "user"
    When I open the plants page
    And I search for plant "Z-Plant-Pabasara-Search"
    Then the plant list should show 1 row
    And I should see "Z-Plant-Pabasara-Search"
    And I DELETE that plant

  @user @smoke
  Scenario: UI_PLANT_USR_003 - Category filter restricts the plant list to the selected category
    Given I am logged in as "user"
    When I open the plants page
    And I filter the plant list by category "QASeedSub"
    Then every row in the plant list should belong to category "QASeedSub"

  @user @negative
  Scenario: UI_PLANT_USR_004 - Empty state message is shown when search returns no results
    Given I am logged in as "user"
    When I open the plants page
    And I search for plant "NoSuchPlantXYZ123"
    Then I should see the "No plants found" message on the plants page

  @user @smoke
  Scenario: UI_PLANT_USR_005 - Table sorting toggles ascending and descending order by Name
    Given I have "admin" plants API credentials
    And I create a plant "A-Plant-Pabasara-Sort" under category 2 with price 12.0 and quantity 6
    And I am logged in as "user"
    When I open the plants page
    Then the plant names should be sorted in ascending order
    And the "Name" column header should show the "↑" sort indicator
    When I click the "Name" column header to sort
    Then the plant names should be sorted in descending order
    And the "Name" column header should show the "↓" sort indicator
    And I DELETE that plant

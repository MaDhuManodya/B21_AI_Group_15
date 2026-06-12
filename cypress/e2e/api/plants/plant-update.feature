# OWNERS: Bhawanthi pabasara
# RESOURCE: PUT /api/plants/{id}
# SRS REFERENCE: §6.2 — Edit Plant (Admin only)
# TEST IDS: API_PLANT_ADM_002
# ============================================================

@plants @api
Feature: Plants API - Update

  @admin @smoke @bhawanthi_pabasara
  Scenario: API_PLANT_ADM_002 - Admin updates price and stock via API
    Given I have "admin" plants API credentials
    And I create a plant "Z-Plant-Pabasara-ToUpdate" under category 2 with price 50.0 and quantity 5
    When I PUT that plant with name "Z-Plant-Pabasara-Updated" price 250.0 and quantity 30 under category 2
    Then the plants API response status should be 200
    And the response should reflect name "Z-Plant-Pabasara-Updated" price 250.0 and quantity 30
    And a subsequent GET for that plant should show name "Z-Plant-Pabasara-Updated" price 250.0 and quantity 30
    And I DELETE that plant

  @admin @smoke @tharindu
  Scenario: API_PLANT_ADMIN_001 - Admin updates a plant via PUT
    Given I have "admin" plants API credentials
    And a plant with id 1 exists
    When I PUT plant 1 with name "Updated Plant", price 15 and quantity 25
    Then the plants API response status should be 200
    And the plants API response body name should be "Updated Plant"
    And the plant 1 name should be "Updated Plant"

  @user @rbac @tharindu
  Scenario: API_PLANT_USER_001 - Normal user PUT plant returns 403
    Given I have "user" plants API credentials
    And a plant with id 1 exists
    When I PUT plant 1 with name "Hack Attempt", price 1 and quantity 999
    Then the plants API response status should be 403
    And the plant 1 name should NOT be "Hack Attempt"

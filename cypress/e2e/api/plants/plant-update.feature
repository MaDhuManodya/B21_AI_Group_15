# ============================================================
# OWNERS: Tharindu, bhawanthi pabasara
# RESOURCE: PUT /api/plants/{id}
# SRS REFERENCE: §6.2 — Edit Plant (Admin only)
# TEST IDS: API_PLANT_ADMIN_001, API_PLANT_USER_004, API_PLANT_ADM_002
# ============================================================
@tharindu @bhawanthi_pabasara @plants @api
Feature: Plants API - Update

  @admin @smoke @tharindu
  Scenario: API_PLANT_ADMIN_001 - Admin updates a plant via PUT
    Given I have "admin" plants API credentials
    And a plant with id 1 exists
    When I PUT plant 1 with name "Updated Rose", price 200 and quantity 25
    Then the plants API response status should be 200
    And the plants API response body name should be "Updated Rose"

  @user @rbac @tharindu
  Scenario: API_PLANT_USER_004 - Normal user PUT plant returns 403
    Given I have "user" plants API credentials
    And a plant with id 1 exists
    When I PUT plant 1 with name "HackedName", price 1 and quantity 999
    Then the plants API response status should be 403
    And the plant 1 name should NOT be "HackedName"

  @admin @smoke @bhawanthi_pabasara
  Scenario: API_PLANT_ADM_002 - Admin updates price and stock via API
    Given I have "admin" plants API credentials
    And a plant with id 2 exists
    When I PUT plant 2 with price 250.0 and quantity 30
    Then the plants API response status should be 200
    And the response should reflect the updated price and quantity
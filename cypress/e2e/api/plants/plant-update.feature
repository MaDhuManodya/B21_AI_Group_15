# OWNERS: Bhawanthi pabasara
# RESOURCE: PUT /api/plants/{id}
# SRS REFERENCE: §6.2 — Edit Plant (Admin only)
# TEST IDS: API_PLANT_ADM_002
# ============================================================

@bhawanthi_pabasara @plants @api
Feature: Plants API - Update

  @admin @smoke @bhawanthi_pabasara
  Scenario: API_PLANT_ADM_002 - Admin updates price and stock via API
    Given I have "admin" plants API credentials
    And a plant with id 2 exists
    When I PUT plant 2 with price 250.0 and quantity 30
    Then the plants API response status should be 200
    And the response should reflect the updated price and quantity
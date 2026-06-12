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
    And I create a plant "Z-Plant-Pabasara-ToUpdate" under category 2 with price 50.0 and quantity 5
    When I PUT that plant with name "Z-Plant-Pabasara-Updated" price 250.0 and quantity 30 under category 2
    Then the plants API response status should be 200
    And the response should reflect name "Z-Plant-Pabasara-Updated" price 250.0 and quantity 30
    And a subsequent GET for that plant should show name "Z-Plant-Pabasara-Updated" price 250.0 and quantity 30
    And I DELETE that plant
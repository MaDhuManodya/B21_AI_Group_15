# ============================================================
# OWNER: bhawanthi pabasara
# RESOURCE: POST /api/plants
# SRS REFERENCE: §5 — Add Plant
# TEST IDS: API_PLANT_ADM_001, API_PLANT_ADM_004, API_PLANT_USR_002
# ============================================================
@bhawanthi_pabasara @plants @api
Feature: Plants API - Create

  @admin @smoke
  Scenario: API_PLANT_ADM_001 - Admin creates a new plant record
    Given I have "admin" plants API credentials
    When I POST a new plant "Jasmine" with price 120.0 and quantity 15 under category 1
    Then the plants API response status should be 201
    And the plants API response body name should be "Jasmine"

  @admin @negative
  Scenario: API_PLANT_ADM_004 - Admin cannot create plant with negative price
    Given I have "admin" plants API credentials
    When I POST a new plant "Orchid" with price -10.0 and quantity 5 under category 1
    Then the plants API response status should be 400
    And the response message should contain "Price must be greater than 0"

  @user @rbac
  Scenario: API_PLANT_USR_002 - User creation of plant is forbidden
    Given I have "user" plants API credentials
    When I POST a new plant "Lily" with price 100.0 and quantity 5 under category 1
    Then the plants API response status should be 403
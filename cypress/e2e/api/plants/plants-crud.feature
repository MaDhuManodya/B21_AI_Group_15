# ============================================================
# OWNER: bhawanthi pabasara
# RESOURCE: GET/DELETE /api/plants
# SRS REFERENCE: §5.5, §6.1 — Plant CRUD and Access Control
# TEST IDS: API_PLANT_ADM_003, API_PLANT_ADM_005, API_PLANT_USR_001, API_PLANT_USR_003, API_PLANT_USR_004, API_PLANT_USR_005
# ============================================================
@bhawanthi_pabasara @plants @api
Feature: Plants API - CRUD and Access Control

  @admin @delete
  Scenario: API_PLANT_ADM_003 - Admin deletes a plant successfully
    Given I have "admin" plants API credentials
    And a plant with id 10 exists
    When I DELETE plant 10
    Then the plants API response status should be 204
    And a subsequent GET for plant 10 should return 404

  @admin @schema
  Scenario: API_PLANT_ADM_005 - Admin retrieves plant list schema
    Given I have "admin" plants API credentials
    When I GET the plants list
    Then the plants API response status should be 200
    And the response should contain a valid paginated plant list schema

  @user @smoke
  Scenario: API_PLANT_USR_001 - User can view the plants list
    Given I have "user" plants API credentials
    When I GET the plants list
    Then the plants API response status should be 200
    And the response should contain a list of plants

  @user @rbac
  Scenario: API_PLANT_USR_003 - User cannot delete a plant
    Given I have "user" plants API credentials
    When I DELETE plant 1
    Then the plants API response status should be 403

  @user @smoke
  Scenario: API_PLANT_USR_004 - User can view details of a specific plant
    Given I have "user" plants API credentials
    When I GET plant 1
    Then the plants API response status should be 200
    Then the plants API response body name should be "QA Seed Plant"

  @noauth @security
  Scenario: API_PLANT_USR_005 - Access denied for unauthenticated users
    Given I have no API credentials
    When I GET the plants list
    Then the plants API response status should be 401
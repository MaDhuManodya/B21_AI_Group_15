# ============================================================
# OWNER: Tharindu
# RESOURCE: GET /api/sales, GET /api/sales/{id}
# SRS REFERENCE: §7 — Sales (read-only for User)
# TEST IDS: API_SALES_ADMIN_003, API_SALES_USER_001, API_SALES_USER_005
# ============================================================
@tharindu @sales @api
Feature: Sales API - Read

  @admin
  Scenario: API_SALES_ADMIN_003 - Admin retrieves paginated sales list
    Given I have "admin" sales API credentials
    When I GET the sales list with page 0 size 10
    Then the sales API response status should be 200
    And the sales API response body should be a sales page or array

  @user
  Scenario: API_SALES_USER_001 - Normal user retrieves the sales list (read-only)
    Given I have "user" sales API credentials
    When I GET the sales list with page 0 size 10
    Then the sales API response status should be 200

  @user
  Scenario: API_SALES_USER_005 - Normal user retrieves a single sale by id
    Given I have "user" sales API credentials
    And a sale record exists
    When I GET the stored sale by id
    Then the sales API response status should be 200
    And the sales API response body should contain an "id" field

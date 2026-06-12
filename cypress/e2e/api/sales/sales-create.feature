# ============================================================
# RESOURCE: POST /api/sales
# SRS REFERENCE: §7 — Sales (Admin only)
# ============================================================
@tharindu @sales @api
Feature: Sales API - Create

  @admin @smoke
  Scenario: API_SALES_ADMIN_001 - Admin creates a sale via POST sales endpoint
    Given I have "admin" sales API credentials
    And a plant exists with stock greater than 0
    When I POST a new sale with quantity 2
    Then the sales API response status should be one of 200 or 201
    And the sales API response body should contain an "id" field
    And the source plant stock should be reduced by 2

  @admin @negative
  Scenario: API_SALES_ADMIN_002 - Admin POST sale with quantity 0 returns 400
    Given I have "admin" sales API credentials
    And a plant exists with stock greater than 0
    When I POST a new sale with quantity 0
    Then the sales API response status should be 400
    And the source plant stock should be unchanged

  @user @rbac
  Scenario: API_SALES_USER_002 - Normal user POST sale returns 403
    Given I have "user" sales API credentials
    And a plant exists with stock greater than 0
    When I POST a new sale with quantity 1
    Then the sales API response status should be 403
    And the source plant stock should be unchanged

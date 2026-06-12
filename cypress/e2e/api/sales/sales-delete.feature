# ============================================================
# RESOURCE: DELETE /api/sales/{id}
# SRS REFERENCE: §7 — Sales (Admin only)
# ============================================================
@tharindu @sales @api @epic("API") @feature("Sales") @story("Delete") @owner("Tharindu") @severity("critical")
Feature: Sales API - Delete

  @admin
  Scenario: API_SALES_ADMIN_004 - Admin deletes a sale by id
    Given I have "admin" sales API credentials
    And a sale record exists
    When I DELETE the stored sale by id
    Then the sales API response status should be one of 200 or 204
    And GET the stored sale by id should return 404

  @user @rbac @severity("blocker")
  Scenario: API_SALES_USER_003 - Normal user DELETE sale returns 403
    Given I have "user" sales API credentials
    And a sale record exists
    When I DELETE the stored sale by id
    Then the sales API response status should be 403
    And GET the stored sale by id should return 200

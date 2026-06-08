# ============================================================
# OWNER: Tharindu
# MODULE: Sales list — Delete action
# SRS REFERENCE: §7.1 — Admin-Specific Features (Delete requires confirmation prompt)
# TEST IDS: UI_SALES_ADMIN_004
# ============================================================
@tharindu @sales @ui
Feature: Delete Sale Record

  @admin
  Scenario: UI_SALES_ADMIN_004 - Admin deletes a sale after confirming the prompt
    Given I am logged in as "admin"
    And a sale record exists
    When I navigate to "/ui/sales"
    And I capture the current sales row count
    And I click the delete icon on the first sales row
    And I confirm the delete prompt
    Then the sales row count should decrease by 1

# ============================================================
# MODULE: Sell Plant page (/ui/sales/new)
# SRS REFERENCE: §7.2 — Sell Plant Page
# ============================================================
@tharindu @sales @ui @epic("UI") @feature("Sales") @story("Create") @owner("Tharindu") @severity("critical")
Feature: Sell Plant

  @admin @smoke
  Scenario: UI_SALES_ADMIN_001 - Admin sells a plant successfully
    Given I am logged in as "admin"
    And a plant exists with stock greater than 0
    When I navigate to "/ui/sales/new"
    And I select the first available plant
    And I enter a sale quantity of "2"
    And I click the Sell button
    Then I should be redirected to "/ui/sales"
    And the sold plant should appear in the sales list

  @admin @negative @severity("minor")
  Scenario: UI_SALES_ADMIN_002 - Quantity 0 shows validation error
    Given I am logged in as "admin"
    When I navigate to "/ui/sales/new"
    And I select the first available plant
    And I enter a sale quantity of "0"
    And I click the Sell button
    Then I should see a quantity validation error on the Sell Plant page
    And I should NOT be redirected to the sales list page

  @user @rbac
  Scenario: UI_SALES_USER_003 - Normal user is denied access to /ui/sales/new
    Given I am logged in as "user"
    When I navigate to "/ui/sales/new"
    Then I should be redirected to the 403 page

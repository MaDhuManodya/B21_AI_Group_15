# ============================================================
# OWNER: Tharindu
# MODULE: Sales list page (/ui/sales)
# SRS REFERENCE: §7.1 — Sales List Page
# TEST IDS: UI_SALES_ADMIN_003, UI_SALES_USER_001, UI_SALES_USER_002, UI_SALES_USER_004
# ============================================================
@tharindu @sales @ui
Feature: View Sales List

  @admin
  Scenario: UI_SALES_ADMIN_003 - Admin views the paginated sales list with all required columns
    Given I am logged in as "admin"
    When I navigate to "/ui/sales"
    Then the sales table should be visible
    And the sales table should have the column "Plant"
    And the sales table should have the column "Quantity"
    And the sales table should have the column "Total Price"
    And the sales table should have the column "Sold At"
    And the Sell Plant button should be visible on the sales page

  @user @rbac
  Scenario: UI_SALES_USER_001 - Normal user views sales list without the Sell Plant button
    Given I am logged in as "user"
    When I navigate to "/ui/sales"
    Then the sales table should be visible
    And the Sell Plant button should NOT be visible on the sales page

  @user @rbac
  Scenario: UI_SALES_USER_002 - Normal user does not see the Delete action on any sales row
    Given I am logged in as "user"
    When I navigate to "/ui/sales"
    Then no delete icon should be visible in the sales Actions column

  @user
  Scenario: UI_SALES_USER_004 - Normal user can sort the sales list by the Plant column
    Given I am logged in as "user"
    When I navigate to "/ui/sales"
    And I sort the sales list by the "plant" column
    Then the sales list should be sorted by the "plant" column ascending

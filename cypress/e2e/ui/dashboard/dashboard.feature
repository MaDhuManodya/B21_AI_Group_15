# ============================================================
# OWNER: Malinda
# MODULE: Dashboard (/ui/dashboard)
# SRS REFERENCE: §4 — Dashboard
# COVERAGE NOTES:
#   - Dashboard loads after login (Admin + User)
#   - Category / Plants / Sales summary cards are displayed
#   - Navigation menu highlights the active page
# TAGS TO USE: @malinda @dashboard @ui  + @admin|@user + @smoke/@negative/@rbac
# REUSABLE STEPS (already in repo):
#   Given I am logged in as "admin"|"user"
#   When  I navigate to {string}
#   Then  I should see {string}
#   Then  I should be redirected to {string}
# ============================================================
@malinda @dashboard @ui
Feature: Dashboard

  @admin @smoke
  Scenario: UI_DASH_ADMIN_001 - Verify admin dashboard loads successfully after login
    Given I am logged in as "admin"
    When I navigate to "/ui/dashboard"
    Then I should be redirected to "/ui/dashboard"

  @admin @smoke
  Scenario: UI_DASH_ADMIN_002 - Verify dashboard cards visibility and navigation
    Given I am logged in as "admin"
    When I navigate to "/ui/dashboard"
    Then I should see the dashboard summary cards
    When I click the manage categories card
    Then I should be redirected to "/ui/categories"
    When I navigate to "/ui/dashboard"
    And I click the manage plants card
    Then I should be redirected to "/ui/plants"
    When I navigate to "/ui/dashboard"
    And I click the view sales card
    Then I should be redirected to "/ui/sales"

  @user @smoke
  Scenario: UI_DASH_USER_001 - Verify dashboard loads successfully for user
    Given I am logged in as "user"
    When I navigate to "/ui/dashboard"
    Then I should be redirected to "/ui/dashboard"

  @admin @smoke
  Scenario: UI_DASH_ADMIN_003 - Verify active page highlighting in navigation menu
    Given I am logged in as "admin"
    When I navigate to "/ui/dashboard"
    Then the "Dashboard" sidebar item should be highlighted
    When I click the "Categories" sidebar item
    Then I should be redirected to "/ui/categories"
    And the "Categories" sidebar item should be highlighted

  @admin @smoke
  Scenario: UI_DASH_ADMIN_004 - Verify the summary information visible in each card
    Given I am logged in as "admin"
    When I navigate to "/ui/dashboard"
    Then the "Categories" card should display the correct summary values
    And the "Plants" card should display the correct summary values
    And the "Sales" card should display the correct summary values
  # Example shape:
  #
  # @admin @smoke
  # Scenario: UI_DASHBOARD_ADMIN_001 - Admin sees Categories/Plants/Sales summary cards
  #   Given I am logged in as "admin"
  #   When I navigate to "/ui/dashboard"
  #   Then I should see "Categories"
  #   And I should see "Plants"
  #   And I should see "Sales"

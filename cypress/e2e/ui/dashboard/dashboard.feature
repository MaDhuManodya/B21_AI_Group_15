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

  # TODO Malinda: write your dashboard scenarios here.
  # Plan a mix of Admin and User scenarios — at least 5 of each across all your modules.
  #
  # Example shape:
  #
  # @admin @smoke
  # Scenario: UI_DASHBOARD_ADMIN_001 - Admin sees Categories/Plants/Sales summary cards
  #   Given I am logged in as "admin"
  #   When I navigate to "/ui/dashboard"
  #   Then I should see "Categories"
  #   And I should see "Plants"
  #   And I should see "Sales"

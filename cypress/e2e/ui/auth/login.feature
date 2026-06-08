# ============================================================
# SHARED — Authentication smoke check.
# Owner: any team member can extend this file.
# Other login-validation scenarios (empty fields, wrong password)
# can be added here if a member needs them.
# ============================================================
@auth @ui @smoke
Feature: Login

  Scenario: Admin can log in with valid credentials
    Given I am not logged in
    When I navigate to "/ui/login"
    And I log in as "admin"
    Then I should be redirected to "/ui/dashboard"

  Scenario: User can log in with valid credentials
    Given I am not logged in
    When I navigate to "/ui/login"
    And I log in as "user"
    Then I should be redirected to "/ui/dashboard"

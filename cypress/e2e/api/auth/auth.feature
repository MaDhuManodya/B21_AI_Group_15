# ============================================================
# OWNER: Malinda
# MODULE: Auth API — POST (login)
# ENDPOINT: POST /api/auth/login
# ============================================================
@malinda @auth @api
Feature: Auth API

  @admin @smoke
  Scenario: API_AUTH_ADMIN_001 - Verify Admin can authenticate and receive JWT
    When I POST login with the admin credentials
    Then the auth API response status should be 200
    And the response should contain a valid JWT token

  @user @smoke
  Scenario: API_AUTH_USER_001 - Verify successful login with valid user credentials
    When I POST login with the user credentials
    Then the auth API response status should be 200
    And the response should contain a valid JWT token

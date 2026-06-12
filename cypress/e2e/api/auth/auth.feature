# ============================================================
# OWNER: Malinda
# MODULE: Auth API — POST (login)
# ENDPOINT: POST /api/auth/login
# ============================================================
@malinda @auth @api @epic("API") @feature("Authentication") @story("Login") @owner("Malinda") @severity("critical")
Feature: Auth API

  @admin @smoke
  Scenario: API_AUTH_ADMIN_001 - Verify Admin can authenticate and receive JWT
    When I POST login with username "admin" and password "admin123"
    Then the auth API response status should be 200
    And the response should contain a valid JWT token

  @user @smoke
  Scenario: API_AUTH_USER_001 - Verify successful login with valid user credentials
    When I POST login with username "testuser" and password "test123"
    Then the auth API response status should be 200
    And the response should contain a valid JWT token

# ============================================================
# OWNER: Malinda
# MODULE: Auth API — POST (login)
# ENDPOINT: POST /api/auth/login
# ============================================================
@malinda @auth @api
Feature: Auth API

  @admin @smoke
  Scenario: API_AUTH_ADMIN_001 - Verify Admin can authenticate and receive JWT
    When I POST login with username "admin" and password "admin123"
    Then the auth API response status should be 200
    And the response should contain a valid JWT token

  @admin @smoke
  Scenario: API_CATEGORIES_ADMIN_007 - Verify successful login with valid credentials
    When I POST login with username "testuser" and password "test123"
    Then the auth API response status should be 200
    And the response should contain a valid JWT token

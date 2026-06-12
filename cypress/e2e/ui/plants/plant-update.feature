# ============================================================
# MODULE: Edit Plant page (/ui/plants/edit/{id})
# SRS REFERENCE: §6.2 — Add / Edit Plant Page
# ============================================================
@tharindu @plants @ui
Feature: Edit Plant

  @admin @smoke
  Scenario: UI_PLANT_ADMIN_001 - Admin updates a plant successfully
    Given I am logged in as "admin"
    And a plant with id 1 exists
    When I open the edit page for plant 1
    And I fill in the plant name "Updated Plant"
    And I select the first available sub-category on the plant form
    And I enter the plant price "200"
    And I enter the plant quantity "25"
    And I click Save on the plant form
    Then I should see the plant updated success message
    And I should be redirected to "/ui/plants"

  @user @rbac
  Scenario: UI_PLANT_USER_001 - Normal user is denied access to the edit page
    Given I am logged in as "user"
    When I navigate to "/ui/plants/edit/1"
    Then I should be redirected to the 403 page

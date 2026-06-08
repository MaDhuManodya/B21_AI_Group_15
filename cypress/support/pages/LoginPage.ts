// ============================================================
// LoginPage — shared by every member.
// URL: /ui/login
// Reuse `cy.loginUI(role)` for fast session-cached login.
// Use this page object only when explicitly testing the login form.
// ============================================================
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly url = '/ui/login';

  usernameInput()    { return cy.get('input[name="username"]'); }
  passwordInput()    { return cy.get('input[name="password"]'); }
  submitButton()     { return cy.get('button[type="submit"], input[type="submit"]').first(); }
  globalError()      { return cy.contains('Invalid username or password'); }
  fieldError(field: 'username' | 'password') {
    return cy.contains(field === 'username' ? 'Username is required' : 'Password is required');
  }

  fillUsername(value: string) { this.usernameInput().clear().type(value); }
  fillPassword(value: string) { this.passwordInput().clear().type(value, { log: false }); }
  submit() { this.submitButton().click(); }

  login(username: string, password: string) {
    this.visit();
    this.fillUsername(username);
    this.fillPassword(password);
    this.submit();
  }
}

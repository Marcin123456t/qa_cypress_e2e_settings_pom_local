// cypress/support/pages/settings.pageObject.js
import PageObject from '../PageObject';

class SettingsPageObject extends PageObject {
  url = '/settings';

  get username()  { return cy.get(
    'input[placeholder="Username"], input[name="username"]'); }
  get bio()       { return cy.get(
    'textarea[placeholder="Short bio about you"], textarea[name="bio"]'); }
  get email()     { return cy.get(
    'input[placeholder="Email"], input[type="email"]'); }
  get password()  { return cy.get(
    'input[placeholder="New Password"], input[type="password"]'); }
  get submitBtn() { return cy.contains('button', /^update settings$/i); }
  get logoutBtn() { return cy.contains('button.btn-outline-danger, button, a', /logout/i).first(); }

  visit() {
    cy.visit(this.url);
    cy.url().should('include', '/settings');
  }

  typeUsername(v){ this.username.clear().type(v); }
  typeBio(v){ this.bio.clear().type(v); }
  typeEmail(v){ this.email.clear().type(v); }
  typePassword(v){ this.password.clear().type(v, { log:false }); }
  submit(){ this.submitBtn.click(); }

  logout() {
    cy.intercept('GET', '**/api/articles?limit=10&offset=*').as('homeFeed');
    this.logoutBtn.click();
    cy.wait('@homeFeed'); // upewnij się, że home się przeładował
  }
}

export default SettingsPageObject;


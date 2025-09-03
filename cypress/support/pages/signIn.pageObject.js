import PageObject from '../PageObject';

class SignInPageObject extends PageObject {
  url = '/user/login';

  get email() {
    return cy.get('input[type="email"], input[placeholder="Email"]');
  }

  get password() {
    return cy.get('input[type="password"], input[placeholder="Password"]');
  }

  get submit() {
    return cy.contains('button', /^sign in$/i);
  }

  get errorList() {
    return cy.get('.error-messages, .error, [data-cy="error-list"]');
  }

  typeEmail(v) {
    this.email.clear();
    this.email.type(v);
  }

  typePassword(v) {
    this.password.clear();
    this.password.type(v, { log: false });
  }

  clickSignInBtn() {
    this.submit.click();
  }
}

export default SignInPageObject;


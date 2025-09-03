/// <reference types="cypress" />

import { faker } from '@faker-js/faker';
import SettingsPageObject from '../support/pages/settings.pageObject';
import ProfilePageObject from '../support/pages/profile.pageObject';
import HomePageObject from '../support/pages/home.pageObject';

const settings = new SettingsPageObject();
const profile  = new ProfilePageObject();
const home     = new HomePageObject();

const safeUsername = () =>
  faker.string.alpha({ length: 1, casing: 'lower' }) +
  faker.string
    .alphanumeric({ length: 9, casing: 'lower' })
    .replace(/[^a-z0-9]/g, '');

describe('Settings page', () => {
  let user;

  beforeEach(() => {
    return cy
      .task('generateUser')
      .then((u) => {
        user = u;
        return cy
          .registerViaApi(u.email, u.username, u.password)
          .then(() => cy.auth(u.email, u.password));
      })
      .then(() => {
        settings.visit();
      });
  });

  it('should provide an ability to update username', () => {
    const newUsername = safeUsername();

    settings.typeUsername(newUsername);
    settings.submit();

    cy.visit(profile.urlFor(newUsername));
    profile.assertUsernameIs(newUsername);
  });

  it('should provide an ability to update bio', () => {
    const newBio = faker.lorem.sentence(8);

    settings.typeBio(newBio);
    settings.submit();

    cy.visit(profile.urlFor(user.username));
    profile.assertBioIs(newBio);
  });

  it('should provide an ability to update an email', () => {
    const newEmail = faker.internet
      .email({ allowSpecialCharacters: false })
      .toLowerCase();

    settings.typeEmail(newEmail);
    settings.submit();

    settings.logout();
    cy.forceLoginScreen();
    cy.loginUI(newEmail, user.password);

    home.assertHeaderContainUsername(user.username);
  });

  it('should provide an ability to update password', () => {
    const newPassword =
      faker.internet.password({ length: 12, memorable: false }) + '1!';

    settings.typePassword(newPassword);
    settings.submit();

    settings.logout();
    cy.forceLoginScreen();

    cy.intercept('POST', '**/api/users/login').as('badLogin');
    cy.visit('/user/login');

    const emailSel = 'input[type="email"], input[placeholder="Email"]';
    const passSel = 'input[type="password"], input[placeholder="Password"]';

    cy.get(emailSel).as('email');
    cy.get('@email').clear();
    cy.get('@email').type(user.email);

    cy.get(passSel).as('pwd');
    cy.get('@pwd').clear();
    cy.get('@pwd').type(user.password, { log: false });

    cy.contains('button', /^sign in$/i).click();
    cy.wait('@badLogin').its('response.statusCode').should('eq', 422);
    cy.get('.error-messages, .error').should('be.visible');

    cy.loginUI(user.email, newPassword);
    home.assertHeaderContainUsername(user.username);
  });

it('should provide an ability to log out', () => {
  settings.logout();

  cy.window().then((win) => {
    expect(win.localStorage.getItem('user')).to.be.null;
  });

  cy.contains('a.nav-link', /^sign in$/i, { timeout: 10000 })
    .should('be.visible');

  cy.visit('/settings');

  cy.get('input[type="email"], input[placeholder="Email"]', { timeout: 10000 })
    .should('be.visible');
  cy.get('input[type="password"], input[placeholder="Password"]', 
    { timeout: 10000 })
    .should('be.visible');
  });
});



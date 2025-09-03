/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

/// <reference types="cypress" />

// [data-cy="..."]
Cypress.Commands.add('getByDataCy', (selector) => {
  return cy.get(`[data-cy="${selector}"]`);
});

// Rejestracja przez API (używana w testach: cy.registerViaApi)
Cypress.Commands.add('registerViaApi', (email, username, password) => {
  return cy
    .request({
      method: 'POST',
      url: '/api/users',
      failOnStatusCode: false,
      body: { user: { email, username, password } },
    })
    .then((res) => {
      if (res.status === 200) return;

      const errs = res.body?.errors || {};
      const emailTaken =
        Array.isArray(errs.email) &&
        errs.email.some((m) => /taken/i.test(m));

      // Jeśli backend zwraca 422 "email taken", uznaj za ok
      if (res.status === 422 && emailTaken) return;

      expect(res.status, JSON.stringify(res.body)).to.eq(200);
    });
});

// Zachowana wstecznie nazwa cy.register => woła API
Cypress.Commands.add('register', (email, username, password) => {
  return cy.registerViaApi(email, username, password);
});

// Programmatic login przez API + ustawienie localStorage/cookie (używane: cy.auth)
Cypress.Commands.add('auth', (email, password) => {
  return cy
    .request({
      method: 'POST',
      url: '/api/users/login',
      failOnStatusCode: false,
      body: { user: { email, password} },
    })
    .then((res) => {
      expect(res.status, JSON.stringify(res.body)).to.eq(200);

      const loggedUser = res.body?.user;

      // localStorage
      cy.window().then((win) => {
        try {
          win.localStorage.setItem('user', JSON.stringify(loggedUser));
        } catch {}
      });

      // cookie z tokenem (jeśli aplikacja go używa)
      if (loggedUser?.token) {
        cy.setCookie('auth', loggedUser.token, { log: false });
      }
    });
});

// Logowanie przez UI (używane: cy.loginUI, cy.login)
Cypress.Commands.add('loginUI', (email, password) => {
  cy.visit('/user/login');

  const emailSel = 'input[type="email"], input[placeholder="Email"]';
  const passSel  = 'input[type="password"], input[placeholder="Password"]';

  cy.get(emailSel).as('email');
  cy.get('@email').clear();
  cy.get('@email').type(email);

  cy.get(passSel).as('pwd');
  cy.get('@pwd').clear();
  cy.get('@pwd').type(password, { log: false });

  cy.intercept('POST', '**/api/users/login').as('login');
  cy.contains('button', /^sign in$/i).click();
  cy.wait('@login').its('response.statusCode').should('eq', 200);

  cy.get('a.nav-link[href="/settings"], a.nav-link:contains("Settings")', {
    timeout: 10000,
  }).should('be.visible');
});

// Zachowana wstecznie nazwa cy.login => UI
Cypress.Commands.add('login', (email, password) => {
  return cy.loginUI(email, password);
});

// Wymuszenie ekranu logowania (czyści stan auth)
Cypress.Commands.add('forceLoginScreen', () => {
  cy.window().then((win) => {
    try { win.localStorage.removeItem('user'); } catch {}
  });
  cy.clearCookie('auth', { log: false });

  cy.visit('/user/login');

  cy.get('input[type="email"], input[placeholder="Email"]', {
    timeout: 10000,
  }).should('be.visible');
});


/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    getByDataCy(selector: string): Chainable<JQuery<HTMLElement>>
    register(email: string, username: string, password: string): Chainable<any>
    registerViaApi(email: string, username: string, password: string): Chainable<any>
    auth(email: string, password: string): Chainable<any>
    loginUI(email: string, password: string): Chainable<any>
    login(email: string, password: string): Chainable<any>
    forceLoginScreen(): Chainable<any>
  }
}

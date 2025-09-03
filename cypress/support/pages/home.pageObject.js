import PageObject from '../PageObject';

class HomePageObject extends PageObject {
  url = '/';

  get usernameLink() {
    return cy.get('a.nav-link[href^="/profile/"]');
  }

  assertHeaderContainUsername(username) {
    this.usernameLink.should('contain', username);
  }
}
export default HomePageObject;


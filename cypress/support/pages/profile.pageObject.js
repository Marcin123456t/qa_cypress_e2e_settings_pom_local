import PageObject from '../PageObject';

class ProfilePageObject extends PageObject {
  urlFor(username) { return `/profile/${username}`; }

  get profileUsername() { return cy.get(
    '.user-info h4, .user-info .username, h4'); }
  get profileBio()      { return cy.get(
    '.profile-page .user-info p, .user-info p'); }

  assertUsernameIs(username) {
    this.profileUsername.should('contain', username);
  }
  assertBioIs(bio) {
    this.profileBio.should('contain', bio);
  }
}
export default ProfilePageObject;


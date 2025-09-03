import PageObject from '../PageObject';

class EditorPageObject extends PageObject {
  url = '/editor';

  get titleField() { return cy.get('input[placeholder="Article Title"]'); }
  get aboutField() { return cy.get(
    'input[placeholder="What\'s this article about?"]'); }
  get bodyField()  { return cy.get(
    'textarea[placeholder="Write your article (in markdown)"]'); }
  get tagsField()  { return cy.get('input[placeholder="Enter tags"]'); }
  get publishBtn() { return cy.contains('button', /publish article|update article|save article/i); }

  visit() { super.visit(this.url); cy.url().should('include', '/editor'); }

  typeTitle(v){ this.titleField.clear(); this.titleField.type(v); }
  typeAbout(v){ this.aboutField.clear(); this.aboutField.type(v); }
  typeBody(v){ this.bodyField.clear();  this.bodyField.type(v); }
  typeTags(v){ this.tagsField.clear();  this.tagsField.type(v); }
  publish(){ this.publishBtn.click(); }
}

export default EditorPageObject;

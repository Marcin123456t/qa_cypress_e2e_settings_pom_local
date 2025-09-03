import PageObject from '../PageObject';

class ArticlePageObject extends PageObject {
  urlFor(slug) { return `/article/${slug}`; }

  get title()    { return cy.get('.article-page h1'); }
  get body()     { return cy.get(
    '.article-page .article-content, .article-page p'); }
  get editBtn()  { return cy.contains('.article-page a, .article-page button', /edit article/i); }
  get deleteBtn(){ return cy.contains('.article-page button', /delete article/i); }

  clickEdit(){ this.editBtn.click(); }
  clickDelete(){ this.deleteBtn.click(); }
}
export default ArticlePageObject;

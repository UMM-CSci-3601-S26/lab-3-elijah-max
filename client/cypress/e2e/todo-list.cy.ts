import { TodoListPage } from '../support/todo-list.po';

const page = new TodoListPage();

describe('Todo list', () => {

  before(() => {
    cy.task('seed:database');
  });

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    page.getPageTitle().should('have.text', 'Todos');
  });

  it('Should show 10 users in both card and list view', () => {
    page.getTodoCards().should('have.length', 10);
    page.changeView('list');
    page.getTodoListItems().should('have.length', 10);
  });

  it('Should filter by owner and check returned elements', () => {
    cy.get('[data-test=todoOwnerInput]').type('Chris');

    // All of the user cards should have the name we are filtering by
    page.getTodoCards().each(e => {
      cy.wrap(e).find('.todo-card-owner').should('have.text', 'Chris');
    });

    // (We check this two ways to show multiple ways to check this)
    page.getTodoCards().find('.todo-card-owner').each(el =>
      expect(el.text()).to.equal('Chris')
    );
  });

  it('Should filter by category and check returned elements', () => {
    // Filter for company 'OHMNET'
    cy.get('[formcontrolname=category]').type('video games');

    page.getTodoCards().should('have.lengthOf.above', 0);


    // All of the user cards should have the company we are filtering by
    page.getTodoCards().find('.todo-card-category').each(card => {
      cy.wrap(card).should('have.text', 'video games');
    });
  });

  it('Should filter by partial category text', () => {
    // Filter for companies that contain 'ti'
    cy.get('[formcontrolname=category]').type('wo');

    page.getTodoCards().should('have.lengthOf.above', 0);

    // Each user card's company name should include the text we are filtering by
    page.getTodoCards().each(e => {
      cy.wrap(e).find('.todo-card-category').should('include.text', 'wo');
    });
  });

  it('Should filter by status and check returned elements', () => {

    page.filterByStatus('Complete');

    // Go through each of the cards that are being shown and get the names
    page.getTodoCards().each(e => {
      cy.wrap(e).find('.todo-card-status').should('include.text', 'Complete');
    });

  });

  it('Should change the view', () => {
    // Choose the view type "List"
    page.changeView('list');

    // We should not see any cards
    // There should be list items
    page.getTodoCards().should('not.exist');
    page.getTodoListItems().should('exist');

    // Choose the view type "Card"
    page.changeView('card');

    // There should be cards
    // We should not see any list items
    page.getTodoCards().should('exist');
    page.getTodoListItems().should('not.exist');
  });


  it('Should click view profile on a todo and go to the right URL', () => {
    page.getTodoCards().first().then((card) => {
      const firstTodoOwner = card.find('.todo-card-owner').text();
      const firstTodoBody = card.find('.todo-card-body').text();

      // When the view profile button on the first user card is clicked, the URL should have a valid mongo ID
      page.getTodoCards().first().click();

      // The URL should be '/users/' followed by a mongo ID
      cy.url().should('match', /\/users\/[0-9a-fA-F]{24}$/);

      // On this profile page we were sent to, the name and company should be correct
      cy.get('.todo-card-owner').first().should('have.text', firstTodoOwner);
      cy.get('.todo-card-body').first().should('have.text', firstTodoBody);
    });
  });

  it('Should click add todo and go to the right URL', () => {
    // Click on the button for adding a new user
    page.addTodoButton().click();

    // The URL should end with '/users/new'
    cy.url().should(url => expect(url.endsWith('/todos/new')).to.be.true);

    // On the page we were sent to, We should see the right title
    cy.get('.add-todo-title').should('have.text', 'New Todo');
  });

});

import { Todo } from 'src/app/todos/todo';
import { AddTodoPage } from '../support/add-todo.po';


describe('Add user', () => {
  const page = new AddTodoPage();

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    page.getTitle().should('have.text', 'New Todo');
  });

  it('Should enable and disable the add user button', () => {
    // ADD USER button should be disabled until all the necessary fields
    // are filled. Once the last (`#emailField`) is filled, then the button should
    // become enabled.
    page.addTodoButton().should('be.disabled');
    page.getFormField('owner').type('Test Owner');
    page.addTodoButton().should('be.disabled');
    page.getFormField('body').type('Test Body');
    page.addTodoButton().should('be.disabled');
    page.getFormField('category').type('home');
    page.addTodoButton().should('be.enabled');
  });

  it('Should have the correct title', () => {
    page.getTitle().should('have.text', 'New Todo');
  });

  it('Should enable and disable the add todo button', () => {
    // Button should be disabled until required fields are filled
    page.addTodoButton().should('be.disabled');

    page.getFormField('owner').type('Test Owner');
    page.addTodoButton().should('be.disabled');

    page.getFormField('body').type('Test body');
    page.addTodoButton().should('be.disabled');

    page.getFormField('category').type('home');
    page.addTodoButton().should('be.enabled');
  });

  it('Should show error messages for invalid inputs', () => {

    cy.get('[data-test=ownerError]').should('not.exist');
    page.getFormField('owner').click().blur();
    cy.get('[data-test=ownerError]').should('exist').and('be.visible');

    page.getFormField('owner').type('Valid Owner').blur();
    cy.get('[data-test=ownerError]').should('not.exist');


    cy.get('[data-test=bodyError]').should('not.exist');
    page.getFormField('body').click().blur();
    cy.get('[data-test=bodyError]').should('exist').and('be.visible');

    page.getFormField('body').type('Valid body').blur();
    cy.get('[data-test=bodyError]').should('not.exist');


    cy.get('[data-test=categoryError]').should('not.exist');
    page.getFormField('category').click().blur();
    cy.get('[data-test=categoryError]').should('exist').and('be.visible');

    page.getFormField('category').type('work').blur();
    cy.get('[data-test=categoryError]').should('not.exist');
  });

  describe('Adding a new todo', () => {
    beforeEach(() => {
      cy.task('seed:database');
    });

    it('Should go to the right page, and have the right info', () => {
      const todo: Todo = {
        _id: null,
        owner: 'Test Owner',
        status: false,
        body: 'Test todo body',
        category: 'work',
      };

      // The `page.addUser(user)` call ends with clicking the "Add User"
      // button on the interface. That then leads to the client sending an
      // HTTP request to the server, which has to process that request
      // (including making calls to add the user to the database and wait
      // for those to respond) before we get a response and can update the GUI.
      // By calling `cy.intercept()` we're saying we want Cypress to "notice"
      // when we go to `/api/users`. The `AddUserComponent.submitForm()` method
      // routes to `/api/users/{MongoDB-ID}` if the REST request to add the user
      // succeeds, and that routing will get "noticed" by the Cypress because
      // of the `cy.intercept()` call.
      //
      // The `.as('addUser')` call basically gives that event a name (`addUser`)
      // which we can use in things like `cy.wait()` to say which event or events
      // we want to wait for.
      //
      // The `cy.wait('@addUser')` tells Cypress to wait until we have successfully
      // routed to `/api/users` before we continue with the following checks. This
      // hopefully ensures that the server (and database) have completed all their
      // work, and that we should have a properly formed page on the client end
      // to check.
      cy.intercept('/api/todos').as('addTodo');
      page.addTodo(todo);
      cy.wait('@addTodo');

      // New URL should end in the 24 hex character Mongo ID of the newly added user.
      // We'll wait up to five full minutes for this these `should()` assertions to succeed.
      // Hopefully that long timeout will help ensure that our Cypress tests pass in
      // GitHub Actions, where we're often running on slow VMs.
      cy.url({ timeout: 300000 })
        .should('match', /\/todos\/[0-9a-fA-F]{24}$/)
        .should('not.match', /\/todos\/new$/);

      // The new user should have all the same attributes as we entered
      cy.get('.user-card-owner').should('have.text', todo.owner);
      cy.get('.user-card-body').should('have.text', todo.body);
      cy.get('.user-card-category').should('have.text', todo.category);
      cy.get('.todo-card-status').should(
        'have.text',
        todo.status ? 'Complete' : "Incomplete"
      );

      // We should see the confirmation message at the bottom of the screen
      page.getSnackBar().should('contain', `Added todo ${todo.body}`);
    });

    it('Should fail with missing required field', () => {
      const todo: Todo = {
        _id: null,
        owner: '',
        status: false,
        body: 'Test todo body',
        category: 'work',
      };

      // Here we're _not_ expecting to route to `/api/users` since adding this
      // user should fail. So we don't add `cy.intercept()` and `cy.wait()` calls
      // around this `page.addUser(user)` call. If we _did_ add them, the test wouldn't
      // actually fail because a `cy.wait()` that times out isn't considered a failure,
      // although we could catch the timeout and turn it into a failure if we needed to.
      page.addTodo(todo);

      // We should get an error message
      page.getSnackBar().should('contain', 'Tried to add an illegal new todo');

      // We should have stayed on the new user page
      cy.url()
        .should('not.match', /\/todos\/[0-9a-fA-F]{24}$/)
        .should('match', /\/todos\/new$/);

      // The things we entered in the form should still be there
      page.getFormField('owner').should('have.value', todo.owner);
      page.getFormField('body').should('have.value', todo.body);
      page.getFormField('category').should('have.value', todo.category);
      cy.get('.todo-card-status').should(
        'contain',
        todo.status ? 'Complete' : "Incomplete"
      );
    });
  });
});

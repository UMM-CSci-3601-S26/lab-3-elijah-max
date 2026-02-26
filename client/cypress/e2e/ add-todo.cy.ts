import { Todo } from 'src/app/todo lists/todo';
import { AddTodoPage } from '../support/add-todo.po';

describe('Add todo', () => {
  const page = new AddTodoPage();

  beforeEach(() => {
    page.navigateTo();
  });

  it('Should have the correct title', () => {
    page.getTitle().should('have.text', 'New Todo');
  });

  it('Should enable and disable the add todo button', () => {
    page.addTodoButton().should('be.disabled');
    page.getFormField('owner').type('test');
    page.addTodoButton().should('be.disabled');
    page.getFormField('status').type('complete');
    page.getTodoButton().should('be.disabled');
    page.getFormField('body').type('invalid');
    page.getTodoButton().should('be.disabled');
    page.getFormField('body').type('')
    page.addTodoButton().should('be.enabled');
  });

  it('Should show error messages for invalid inpuits', () => {
    cy.get('[data-test=nameError]').should('exist').and('be.visible');
  }
  )
}

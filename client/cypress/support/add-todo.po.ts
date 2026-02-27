
import {Todo} from 'src/app/todos/todo';

export class AddTodoPage {

  private readonly url = '/todos/new';
  private readonly title = '.add-todo-title';
  private readonly button = '[data-test=confirmAddTodoButton]';
  private readonly snackBar = '.mat-mdc-simple-snack-bar';

  private readonly ownerFieldName = 'owner';
  private readonly statusFieldName = 'status';
  private readonly bodyFieldName = 'body';
  private readonly categoryFieldName = 'category';
  private readonly formFieldSelector = 'mat-form-field';
  private readonly dropDownSelector = 'mat-option';


  navigateTo() {
    return cy.visit(this.url);
  }

  getTitle() {
    return cy.get(this.title);
  }

  getFormField(fieldName: string) {
    return cy.get(`${this.formFieldSelector} [formcontrolname=${fieldName}]`);
  }

  addTodoButton() {
    return cy.get(this.button);
  }

  selectMatSelectValue(select: Cypress.Chainable, value: string) {
    return select.click()
      .get(`${this.dropDownSelector}[value="${value}"]`).click();
  }

  getSnackBar() {
    return cy.get(this.snackBar, {timeout: 10000 });
  }

  addTodo(newTodo: Todo) {
    this.getFormField(this.ownerFieldName).type(newTodo.owner);
    this.getFormField(this.bodyFieldName).type(newTodo.body);
    this.getFormField(this.categoryFieldName).type(newTodo.category);
    const statusValue = newTodo.status ? 'Complete' : 'Incomplete';
    this.selectMatSelectValue(this.getFormField(this.statusFieldName), statusValue);
    return this.addTodoButton().click();
  }
}


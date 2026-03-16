import { Todo } from 'src/app/todos/todo';

export class TodoListPage {
  private readonly baseUrl = '/todos';
  private readonly pageTitle = '.todo-list-title';
  private readonly todoCardSelector = '.todo-cards-container app-todo-card';
  private readonly todoListItemsSelector = '.todo-nav-list .todo-list-item';
  private readonly viewTypeRadioSelector = '[data-test=viewTypeRadio] mat-radio-button';
  private readonly todoOwnerInputSelector = '[formcontrolname=owner]';
  private readonly todoCategoryInputSelector = '[formcontrolname=category]';
  private readonly todoStatusDropdownSelector = '[formcontrolname=status]';
  private readonly dropdownOptionSelector = 'mat-option';
  private readonly addTodoButtonSelector = '[data-test=addTodoButton]';



  navigateTo() {
    return cy.visit(this.baseUrl);
  }

  getPageTitle() {
    return cy.get(this.pageTitle);
  }

  getTodoCards() {
    return cy.get(this.todoCardSelector);
  }

  getTodoCardByTodo(todo: Todo) {
    return cy.contains(this.todoCardSelector, todo.body);
  }


  getTodoListItems() {
    return cy.get(this.todoListItemsSelector);
  }

  getTodoListItemByTodo(todo: Todo) {
    return cy.contains(this.todoListItemsSelector, todo.body);
  }

  changeView(viewType: 'card' | 'list') {
    return cy.get(`${this.viewTypeRadioSelector}[value="${viewType}"]`).click();
  }

  filterByOwner(owner: string) {
    return cy.get(this.todoOwnerInputSelector).clear().type(owner);
  }
  filterByCategory(category: string) {
    return cy.get(this.todoCategoryInputSelector).clear().type(category);
  }

  filterByStatus(status: 'Complete' | 'Incomplete') {
    cy.get(this.todoStatusDropdownSelector).click();
    return cy.get(`${this.dropdownOptionSelector}[value="${status}"]`).click();
  }

  addTodoButton() {
    return cy.get(this.addTodoButtonSelector);
  }
}

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
}

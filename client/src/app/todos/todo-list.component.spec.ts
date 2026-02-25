import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { of } from "rxjs";
import { TodoListComponent } from "./todo-list.component";
import { TodoService } from "./todo.service"



describe('Todo list', () => {
  let todoList: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  const testTodos = [
    { owner: 'Chris', status: true, body: 'This is a video games todo', category: 'video games' },
    { owner: 'Chris', status: true, body: 'This is another video games todo', category: 'video games' },
    { owner: 'Pat', status: false, body: 'This is a homework todo', category: 'homework' },
    { owner: 'Jamie', status: false, body: 'This is a software design todo', category: 'software design' },
    { owner: 'Sam', status: true, body: "This is Sam's todo", category: 'homework' },
  ];



  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TodoListComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoListComponent);
    todoList = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(todoList).toBeTruthy();
  });

  it('should have serverFilteredTodos available', () => {
    const todos = todoList.serverFilteredTodos();
    expect(todos).toBeDefined();
    expect(Array.isArray(todos)).toBe(true);
    expect(todos.length).toBeGreaterThan(0);
  });

  it('filteredTodos() should filter by owner and category', () => {
    todoList.todoOwner.set('Alice');
    todoList.todoCategory.set('shopping');
    const filtered = todoList.filteredTodos();
    expect(filtered.length).toBe(1);
    expect(filtered[0].owner).toBe('Alice');
    expect(filtered [0].category).toBe('shopping');
  });

  it('filteredTodos() should return all if no filters', () => {
    todoList.todoOwner.set(undefined);
    todoList.todoCategory.set(undefined);
    const filtered = todoList.filteredTodos();
    expect(filtered.length).toBe(todoList.serverFilteredTodos().length);
  });

  it('filteredTodos() should filter by status', () => {
    todoList.todoStatus.set(true);
    const filteredComplete = todoList.filteredTodos();
    for (const todo of filteredComplete) {
      expect(todo.status).toBeTrue();
    }
    todoList.todoStatus.set(false);
    const filteredIncomplete = todoList.filteredTodos();
    for (const todo of filteredIncomplete) {
      expect(todo.status).toBeFalse();
    }
  });
});

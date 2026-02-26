import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { TodoListComponent } from "./todo-list.component";
import { TodoService } from "./todo.service"
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";




describe('Todo list', () => {
  let todoList: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let todoService: TodoService;



  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TodoListComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        TodoService
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoListComponent);
    todoList = fixture.componentInstance;
    todoService = TestBed.inject(TodoService);
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

  it('should call getTodos() when todoStatus signal changes', () => {
    const spy = spyOn(todoService, 'getTodos').and.callThrough();
    todoList.todoStatus.set(true);
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith({
      status: true,
      body: undefined,
      owner: undefined,
    });
  });

  it('should call getTodos() when todoBody signal changes', () => {
    const spy = spyOn(todoService, 'getTodos').and.callThrough();
    todoList.todoBody.set("Buy");
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith({
      status: undefined,
      body: "Buy",
      owner: undefined,
    });
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

import { Component, computed, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { catchError, combineLatest, of, switchMap, tap } from 'rxjs';
import { Todo } from './todo';
import { TodoService } from './todo.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-todo-list-component',
  templateUrl: 'todo-list.component.html',
  styleUrls : ['./todo-list.component.scss'],
  providers: [],
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    MatRadioModule,
    MatListModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
  ],
})
export class TodoListComponent {
  private todoService: TodoService = inject(TodoService);
  private snackBar = inject(MatSnackBar);

  todoOwner = signal<string | undefined>(undefined);
  todoStatus = signal<boolean | undefined>(undefined);
  todoBody = signal<string | undefined>(undefined);
  todoCategory = signal<string | undefined>(undefined);

  viewType = signal<'card' | 'list'>('card');

  errMsg = signal<string | undefined>(undefined);

  private todoBody$ = toObservable(this.todoBody);
  private todoStatus$ = toObservable(this.todoStatus);

  serverFilteredTodos =
    toSignal(
      combineLatest([this.todoStatus$, this.todoBody$]).pipe(
        switchMap(([status, body]) =>
          this.todoService.getTodos({
            status,
            body,
          })
        ),
        catchError((err) => {
          if(!(err.error instanceof ErrorEvent)) {
            this.errMsg.set(
              `Problem contacting the server - Error Code:   ${err.status}\nMessage: ${err.message}`
            );
          }
          this.snackBar.open(this.errMsg(), 'OK', {duration: 6000});
          return of<Todo[]>([]);
        }),
        tap(() => {

        })
      )
    );
  filteredTodos = computed(() => {
    const todos =this.serverFilteredTodos() || [];

    return todos.filter(todo => {
      const ownerMatch = this.todoOwner() ? todo.owner.includes(this.todoOwner()!) : true;
      const categoryMatch = this.todoCategory() ? todo.category.includes(this.todoCategory()!) : true;
      return ownerMatch && categoryMatch;
    });
  });
}

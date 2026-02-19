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
import { RouterLink } from '@angular/router';
import { catchError, combineLatest, of, switchMap, tap } from 'rxjs';
import { Todo, TodoBody } from './todo';
import { TodoCardComponent } from './todo.service';
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
    TodoCardComponent,
    MatListModule,
    RouterLink,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
  ],
})
export class TodoListComponent {
  private todoService = inject(todoService);
  private snackBar = inject(MatSnackBar);

  todoOwner = signal<string | undefined>(undefined);
  todoStatus = signal<boolean | undefined>(undefined);
  todoBody = signal<TodoBody | undefined>(undefined);
  todoCategory = signal<string | undefined>(undefined);

  viewType = signal<'card' | 'list'>('card');

  errMsg = signal<string | undefined>(undefined);

  private todoBody$ = toObservable(this.todoBody);
  private todoStatus$ = signal<string | undefined>(undefined);

  serverFilterTodos =

    toSignal(
      combineLatest([this.todoBody$, this.todoStatus$]).pipe(
        switchMap(([body, status]) =>
          this.todoService.getTodos({
            body,
            status,
          }))
      )
    )
}

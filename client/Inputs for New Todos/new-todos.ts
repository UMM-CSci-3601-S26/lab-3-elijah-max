import {Component} from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'new-todos'
  templateUrl: 'new-todos.html',
  styleUrl: 'new-todos.css',
  imports: [FormsModule, MatFormFieldModule, MatInputModule],
})
export class InputFormExample {}

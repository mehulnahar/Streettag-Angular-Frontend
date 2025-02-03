import { Component } from '@angular/core';
import { TodoService, TodoItem } from './todo.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss'],
  providers: [ TodoService ]
})
export class TodoComponent {
  public todoList: TodoItem[] = [];
  public newTodoText: string = '';

  constructor(private todoService: TodoService) {
    this.todoList = this.todoService.getTodoList();
  }

  public getNotDeleted(): TodoItem[] {
    return this.todoList.filter(item => !item.deleted);
  }

  public addToDoItem(event: Event): void {
    event.preventDefault();
    if (this.newTodoText.trim()) {
      this.todoList.push({
        text: this.newTodoText,
        deleted: false
      });
      this.newTodoText = '';
    }
  }

  public deleteTodoItem(index: number): void {
    this.todoService.deleteTodoItem(index);
  }
}
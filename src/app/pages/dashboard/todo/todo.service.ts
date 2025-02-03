import { Injectable } from '@angular/core';

export interface TodoItem {
  text: string;
  deleted?: boolean;
  isActive?: boolean;
}

@Injectable()
export class TodoService {
  private todoList: TodoItem[] = [
    { text: 'Check new team registrations', deleted: false, isActive: false },
    { text: 'Review street tag locations', deleted: false, isActive: false },
    { text: 'Update player statistics', deleted: false, isActive: false },
    { text: 'Monitor daily activity', deleted: false, isActive: false }
  ];

  getTodoList(): TodoItem[] {
    return this.todoList;
  }

  addTodoItem(text: string): void {
    this.todoList.push({ text, deleted: false, isActive: false });
  }

  deleteTodoItem(index: number): void {
    this.todoList[index].deleted = true;
  }
}
import { Pipe, PipeTransform } from '@angular/core';

interface ChatMessage {
  author: string;
  [key: string]: any;
}

@Pipe({ name: 'ChatPersonSearchPipe' })
export class ChatPersonSearchPipe implements PipeTransform {
  transform(value: ChatMessage[], args?: string): Array<ChatMessage> {
    if (!value) return [];
    if (!args) return value;

    let searchText = new RegExp(args, 'ig');
    return value.filter(message => {
      if (message.author) {
        return message.author.search(searchText) !== -1;
      }
      return false;
    });
  }
}

import { Pipe, PipeTransform } from '@angular/core';

interface Mail {
  sender: string;
  subject: string;
  [key: string]: any;
}

@Pipe({
  name: 'MailSearch'
})
export class MailSearchPipe implements PipeTransform {
  transform(value: Mail[], args?: string): Array<Mail> {
    if (!value) return [];
    if (!args) return value;

    let searchText = new RegExp(args, 'ig');
    return value.filter(mail => {
      if (mail.sender || mail.subject) {
        return mail.sender.search(searchText) !== -1 || mail.subject.search(searchText) !== -1;
      }
      return false;
    });
  }
}

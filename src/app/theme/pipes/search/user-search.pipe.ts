import { Pipe, PipeTransform } from '@angular/core';

interface UserProfile {
  name?: string;
}

interface User {
  profile: UserProfile;
  username: string;
  [key: string]: any;
}

@Pipe({ name: 'UserSearchPipe', pure: false })
export class UserSearchPipe implements PipeTransform {
  transform(value: User[], args?: string): Array<User> {
    if (!value) return [];
    if (!args) return value;

    let searchText = new RegExp(args, 'ig');
    return value.filter(user => {
      if (user.profile.name) {
        return user.profile.name.search(searchText) !== -1;
      } else {
        return user.username.search(searchText) !== -1;
      }
    });
  }
}
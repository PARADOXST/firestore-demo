import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  users: User[];
  data: Observable<any>;

  constructor() {
    this.users = [
      {
        firstName: 'Songting1',
        lastName: 'Xu1',
        email: 'xustive@gmail.com',
        image: 'http://lorempixel.com/600/600/people/2',
        isActive: true,
        balance: 100,
        registered: new Date('01/01/2020 00:00:00'),
        hide: true
      },
      {
        firstName: 'Songting2',
        lastName: 'Xu2',
        email: 'xustive@gmail.com',
        image: 'http://lorempixel.com/600/600/people/3',
        isActive: false,
        balance: 100,
        registered: new Date('01/01/2020 00:00:00'),
        hide: true
      }
    ];
  }

  getUsers(): Observable<User[]> {
    console.log('Fetching users from DataService');
    
    setTimeout(() => {console.log('sleeped 5s')}, 5000);
    console.log('hi')
    return of(this.users);
  }

  addUser(user: User) {
    this.users.unshift(user);
  }

  getData() {
    this.data = new Observable(observer => {
      setTimeout(() => {
        observer.next(1);
      }, 1000);

      setTimeout(() => {
        observer.next(2);
      }, 2000);

      setTimeout(() => {
        observer.next(3);
      }, 3000);

      setTimeout(() => {
        observer.next('hahaha');
      }, 3000);
    });
    return this.data;
  }
}

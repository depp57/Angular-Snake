import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import * as firebase from 'firebase/app';
import 'firebase/auth';


@Injectable({providedIn: 'root'})
export class AuthService {
  userSubject: Subject<string> = new Subject<string>();

  constructor() { }

  private logInUser(name: string) {
    this.userSubject.next(name);
  }

  private logOutUser() {
    this.userSubject.next(null);
  }

  createUser(name: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(name, password)
        .then(() => {
            resolve();
            this.logInUser(name.split('@')[0]);
          },
          error => reject(error));
    });
  }

  signInUser(name: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(name, password)
        .then(() => {
          this.logInUser(name.split('@')[0]);
          resolve();
        },
          error => reject(error));
    });
  }

  signOutUser() {
    firebase.auth().signOut()
      .then(() => this.logOutUser());
  }
}

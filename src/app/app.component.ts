import { Component } from '@angular/core';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor() {
    const conf = {
      apiKey: 'AIzaSyATAN9KSZpTzXfAoSKunBLTI8Jm5vSrNDs',
      authDomain: 'angularsnake-bf5da.firebaseapp.com',
      databaseURL: 'https://angularsnake-bf5da.firebaseio.com',
      projectId: 'angularsnake-bf5da',
      storageBucket: 'angularsnake-bf5da.appspot.com',
      messagingSenderId: '860522799223',
      appId: '1:860522799223:web:56389ace2222ea3b09a672'
    };
    // Initialize Firebase
    firebase.initializeApp(conf);
  }
}

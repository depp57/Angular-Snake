import {Injectable, OnDestroy} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import * as firebase from 'firebase/app';

@Injectable({providedIn: 'root'})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isAuth = firebase.auth().currentUser !== null;

    if (!isAuth) {
      this.router.navigate(['signup']);
      return false;
    }
    return true;
  }
}

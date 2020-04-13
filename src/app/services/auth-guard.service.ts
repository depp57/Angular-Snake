import {Injectable, OnDestroy} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from './auth.service';
import {Subscription} from 'rxjs';
import * as firebase from 'firebase';

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

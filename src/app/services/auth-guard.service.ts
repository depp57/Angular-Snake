import {Injectable, OnDestroy} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from './auth.service';
import {Subscription} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthGuardService implements CanActivate, OnDestroy {

  private isAuth: boolean;
  private userSubscription: Subscription;

  constructor(private authService: AuthService,
              private router: Router) {
    this.userSubscription = authService.userSubject.subscribe(
      userName => this.isAuth = (userName != null));
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.isAuth) {
      this.router.navigate(['signup']);
      return false;
    }
    return true;
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }
}

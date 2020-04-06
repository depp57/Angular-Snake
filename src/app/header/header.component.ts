import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isAuth: boolean;
  userSubscription: Subscription;

  constructor(private authService: AuthService,
              private router: Router) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.userSubject.subscribe(
      name => this.isAuth = (name != null)
    );
  }

  onSignOut() {
    this.authService.signOutUser();
    this.router.navigate(['signin']);
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
  }

}

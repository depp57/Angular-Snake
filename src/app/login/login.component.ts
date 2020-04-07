import { Component, OnInit } from '@angular/core';
import anime from 'animejs/lib/anime.es';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.initForm();
    this.animeForm();
  }

  animeForm() {
    anime({
      targets: '#loginFormContainer',
      translateY: 600,
      easing: 'spring(2, 60, 17, 0)',
      duration: 3000
    });
  }

  private initForm() {
    this.loginForm = this.formBuilder.group({
      name: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSignUp() {
    const name = this.loginForm.value.name + '@gmail.com';
    const password = this.loginForm.value.password;
    this.authService.createUser(name, password)
      .then(() => this.authService.signInUser(name, password))
      .then(() => this.router.navigate(['game']))
      .catch(error => this.errorMessage = error);
  }

  onSignIn() {
    const name = this.loginForm.value.name + '@gmail.com';
    const password = this.loginForm.value.password;
    this.authService.signInUser(name, password)
      .then(() => this.router.navigate(['game']))
      .catch(error => this.errorMessage = error);
  }
}

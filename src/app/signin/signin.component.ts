import { Component, OnInit } from '@angular/core';
import anime from 'animejs/lib/anime.es.js';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  signUpForm: FormGroup;
  errorMessage: string;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.animeForm();
    this.initForm();
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
    this.signUpForm = this.formBuilder.group({
      name: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSignUp() {
    const name = this.signUpForm.value.name + '@gmail.com';
    const password = this.signUpForm.value.password;
    this.authService.createUser(name, password)
      .then(() => this.authService.signInUser(name, password))
      .then(() => this.router.navigate(['game']))
      .catch(error => this.errorMessage = error);
  }
}

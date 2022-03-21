import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  faShoppingBag,
  faUser,
  faKey,
  faCheck,
  faShieldAlt,
  faCaretSquareLeft,
} from '@fortawesome/free-solid-svg-icons';
import { FormInput } from 'src/app/shared/models/formInputs.model';
import { LoginResponse } from 'src/app/shared/models/login-response.model';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loggedIn: boolean = false; //for show login message
  isLoading: boolean = false; //for loading spinner effect
  loginErrorMessage: string; //firebase login error messages

  //fontAwesome variable
  faUser = faUser;
  faKey = faKey;
  faCheck = faCheck;
  faShoppingBag = faShoppingBag;
  faShield = faShieldAlt;
  faSquareLeft = faCaretSquareLeft;

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    //create reactive form and define validations
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
    });
  }
  //main login method
  onSubmit(): void {
    //get form values and create a user object to send firebase auth
    this.isLoading = true;
    const user: FormInput = {
      email: this.loginForm.get('email').value,
      password: this.loginForm.get('password').value,
    };
    //login method on login service
    this.auth.login(user).subscribe(
      (responseData: LoginResponse) => {
        this.loggedIn = true; //to show successfull login message
        this.isLoading = false; // loading spinner closed
        this.router.navigate(['/shop']); //route to dashboard
        this.loginForm.reset();
      },
      (error) => {
        //these error list conditions has taken from "https://firebase.google.com/docs/reference/rest/auth#section-create-email-password"
        switch (error.error.error.message) {
          case 'EMAIL_NOT_FOUND':
            this.loginErrorMessage = 'Email not found';
            break;
          case 'INVALID_PASSWORD':
            this.loginErrorMessage = 'Invalid password';
            break;
          case 'USER_DISABLED':
            this.loginErrorMessage = 'User banned!';
            break;
        }
        this.isLoading = false;
      }
    );
  }
  //route to the register page button method
  toRegisterPage(): void {
    this.router.navigate(['/register']);
  }
}

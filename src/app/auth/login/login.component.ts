import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { AuthService } from '../auth.service';

import { Select } from '@ngxs/store';
import { UiState } from '../../shared/ui.state';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  @Select(UiState.isLoading) isLoading$: Observable<boolean>;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', { validators: [Validators.required] }),
    });
  }

  onSubmit(): void {
    const { email, password } = this.loginForm.value;
    const user = {
      email,
      password,
    };
    this.authService.loginUser(user);
  }
}

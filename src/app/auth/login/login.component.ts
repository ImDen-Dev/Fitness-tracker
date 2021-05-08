import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

import { AuthService } from '../auth.service';
import { UIService } from '../../shared/ui.service';

import { Select, Store } from '@ngxs/store';
import { AuthState } from '../../shared/auth.state';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  // isLoading$: Observable<boolean>;
  private loadingSubs: Subscription;

  @Select(AuthState.isLoading) isLoading$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private uiService: UIService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.isLoading$.subscribe((data) => {
      console.log(data);
    });
    //   this.loadingSubs = this.uiService.loadingStateChanged.subscribe(
    //   (isLoading) => {
    //     this.isLoading = isLoading;
    //   }
    // );
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

  ngOnDestroy(): void {
    if (this.loadingSubs) {
      this.loadingSubs.unsubscribe();
    }
  }
}
